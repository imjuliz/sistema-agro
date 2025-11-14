'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const AuthContext = createContext();

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/';
const LOGIN_ENDPOINT = `${BACKEND_BASE}auth/login`;
const REFRESH_ENDPOINT = `${BACKEND_BASE}auth/refresh`;
const LOGOUT_ENDPOINT = `${BACKEND_BASE}auth/logout`;

let refreshPromise = null;

export function AuthProvider({ children, skipInitialRefresh = false }) {
  const pathname = usePathname();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const doRefresh = useCallback(async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const res = await fetch(REFRESH_ENDPOINT, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          // Mantemos limpeza do estado, mas não logamos ruidosamente aqui.
          setAccessToken(null);
          setUser(null);
          // lança erro com status para quem chamou poder agir
          throw new Error(`refresh-failed:${res.status}`);
        }

        const data = await res.json();
        const newAccessToken = data.accessToken ?? data.data?.accessToken ?? null;
        let usuario = data.usuario ?? data.data?.usuario ?? null;

        if (!usuario && newAccessToken) {
          try {
            const meRes = await fetch(`${BACKEND_BASE}auth/me`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            if (meRes.ok) {
              const meData = await meRes.json();
              usuario = meData.usuario ?? null;
            }
          } catch (err) {
            console.warn('Falha ao buscar /auth/me:', err);
          }
        }

        if (newAccessToken) setAccessToken(newAccessToken);
        if (usuario)
          setUser({
            ...usuario,
            perfil: usuario?.perfil?.funcao ?? null,   // <- este é o segredo
          });

        return { data, newAccessToken, usuario };
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function tryRefresh() {
      if (!mounted) return;

      // Se o provider for usado em páginas públicas (ex: login) e quisermos pular o refresh inicial:
      const publicPaths = ['/login', '/cadastrar', '/esqueciSenha'];
      if (skipInitialRefresh || publicPaths.some(p => pathname?.startsWith(p))) {
        // não tentar refresh automático nessas páginas
        if (mounted) setLoading(false);
        return;
      }

      try {
        await doRefresh();
      } catch (err) {
        // Suprima erro de refresh 401 (esperado quando não há cookie)
        if (!String(err).includes('refresh-failed:401')) {
          console.error('refresh on mount failed', err);
        } else {
          // opcional: console.debug('refresh 401 on mount (expected)');
        }
        setAccessToken(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    tryRefresh();
    return () => { mounted = false; };
  }, [doRefresh, pathname, skipInitialRefresh]);

  // login: envia credenciais, backend seta cookie HttpOnly e retorna accessToken
  const login = useCallback(async ({ email, senha }) => {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.error || data.mensagem || data.erro || 'Erro ao autenticar';
      return { success: false, error: errMsg, status: res.status };
    }

    // extrair payload com robustez
    const payload = data.data ?? data;
    const token = payload.accessToken ?? data.accessToken ?? null;
    const usuario = payload.usuario ?? payload.user ?? null;

    if (token) setAccessToken(token);
    if (usuario) setUser(usuario);

    return { success: true, payload, token, usuario };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(LOGOUT_ENDPOINT, { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.warn('logout failed', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const fetchWithAuth = useCallback(async (input, init = {}) => {
    let initCopy = {
      ...init,
      credentials: 'include',
      headers: {
        ...(init.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    };

    let res = await fetch(input, initCopy);

    if (res.status === 401) {
      try {
        const refreshResult = await doRefresh();
        const newAccessToken = refreshResult?.newAccessToken ?? null;

        if (!newAccessToken) {
          setAccessToken(null);
          setUser(null);
          throw new Error('Sessão expirada');
        }

        initCopy = {
          ...init,
          credentials: 'include',
          headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
        };
        res = await fetch(input, initCopy);
      } catch (err) {
        throw err;
      }
    }

    return res;
  }, [accessToken, doRefresh]);

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
