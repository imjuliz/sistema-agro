'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const AuthContext = createContext();

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/';
const LOGIN_ENDPOINT = `${BACKEND_BASE}auth/login`;
const REFRESH_ENDPOINT = `${BACKEND_BASE}auth/refresh`;
const LOGOUT_ENDPOINT = `${BACKEND_BASE}auth/logout`;

let refreshPromise = null;

async function fetchRefreshOnce() {
  const res = await fetch(REFRESH_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    return { success: false, status: res.status };
  }

  const data = await res.json().catch(() => ({}));
  const newAccessToken = data.accessToken ?? data.data?.accessToken ?? null;
  let usuario = data.usuario ?? data.data?.usuario ?? null;

  // fallback /auth/me se necessário
  if (!usuario && newAccessToken) {
    try {
      const meRes = await fetch(`${BACKEND_BASE}auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
      if (meRes.ok) {
        const meData = await meRes.json().catch(() => ({}));
        usuario = meData.usuario ?? meData.user ?? null;
      }
    } catch (err) {
      console.warn('[Auth] /auth/me failed', err);
    }
  }

  return { success: true, newAccessToken, usuario, data };
}

export function AuthProvider({ children, skipInitialRefresh = false }) {
  const pathname = usePathname();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // wrapper que evita chamadas concorrentes ao endpoint e reutiliza a promise
  const doRefresh = useCallback(async () => {
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async () => {
      try {
        return await fetchRefreshOnce();
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
      setLoading(true);
      setInitialized(false);

      const publicPaths = ['/login', '/cadastrar', '/esqueciSenha'];
      const currentPath = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');

      if (skipInitialRefresh || publicPaths.some(p => currentPath.startsWith(p))) {
        if (!mounted) return;
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const result = await doRefresh();
        if (!mounted) return;

        if (result?.success) {
          // aplicar estado AQUI, no mesmo contexto
          if (result.newAccessToken) setAccessToken(result.newAccessToken);
          if (result.usuario) setUser(result.usuario);
          else setUser(null);
        } else {
          // refresh falhou (por ex 401) => limpar estado
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth] initial refresh failed', err);
        setAccessToken(null);
        setUser(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
        setInitialized(true);
      }
    }

    tryRefresh();
    return () => { mounted = false; };
  }, [doRefresh, skipInitialRefresh, pathname]);

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
        if (!refreshResult?.success) {
          setAccessToken(null);
          setUser(null);
          throw new Error('Sessão expirada');
        }

        // aplicar o resultado DO REFRESH aqui, antes de re-tentar
        if (refreshResult.newAccessToken) setAccessToken(refreshResult.newAccessToken);
        if (refreshResult.usuario) setUser(refreshResult.usuario);
        else setUser(null);

        // reconstroi init com novo token
        initCopy = {
          ...init,
          credentials: 'include',
          headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${refreshResult.newAccessToken}`,
          },
        };
        res = await fetch(input, initCopy);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
        throw err;
      }
    }

    return res;
  }, [accessToken, doRefresh]);

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, initialized, login, logout, fetchWithAuth, doRefresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
