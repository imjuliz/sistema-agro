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
          if (result.usuario) {
            // If usuario doesn't include ftPerfil, try to fetch /auth/me to obtain full profile
            if (!result.usuario.ftPerfil) {
              try {
                const meRes = await fetch(`${BACKEND_BASE}auth/me`, {
                  method: 'GET',
                  credentials: 'include',
                  headers: { Authorization: result.newAccessToken ? `Bearer ${result.newAccessToken}` : undefined },
                });
                if (meRes.ok) {
                  const meData = await meRes.json().catch(() => ({}));
                  const fullUser = meData.usuario ?? meData.user ?? result.usuario;
                  setUser(fullUser);
                } else {
                  setUser(result.usuario);
                }
              } catch (err) {
                setUser(result.usuario);
              }
            } else {
              setUser(result.usuario);
            }
          } else setUser(null);
        } else {
          // refresh falhou (por ex 401) => limpar estado
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        // console.error('[Auth] initial refresh failed', err);
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
    let lastError = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[login] Tentativa ${attempt}/${maxRetries}...`);
        const res = await fetch(LOGIN_ENDPOINT, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });

        let data;
        let responseText = '';
        // Ler como texto primeiro e tentar parsear como JSON; em respostas de erro o servidor
        // pode devolver texto simples (ex: "Internal Server Error"). Evitamos explodir o app
        // e retornamos um objeto com a mensagem de erro para a UI.
        responseText = await res.text();
        try {
          data = JSON.parse(responseText);
        } catch (parseErr) {
          // Não-JSON: registrar e criar fallback com o texto bruto
          console.warn(`[login] resposta não-JSON na tentativa ${attempt}:`, parseErr);
          console.warn(`[login] Corpo da resposta (texto):`, responseText ? responseText.substring(0, 500) : '<vazio>');
          console.warn(`[login] Status HTTP:`, res.status, res.statusText);
          data = { error: responseText || res.statusText || `HTTP ${res.status}` };

          // Se o status for 5xx ou 4xx, e ainda quiser tentar retry em caso específico,
          // podemos continuar o loop. Atualmente, tentamos retry só quando o parse falhava
          // por motivos transitórios — manter comportamento de retry breve.
          if (!res.ok && attempt < maxRetries) {
            const delay = 500 * attempt;
            console.log(`[login] Aguardando ${delay}ms antes de retry devido a resposta não-JSON...`);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
          if (!res.ok) return { success: false, error: data.error, status: res.status };
        }

        if (!res.ok) {
          const errMsg = data.error || data.mensagem || data.erro || 'Erro ao autenticar';
          // console.error(`[login] Resposta não-OK na tentativa ${attempt}: ${res.status} - ${errMsg}`);
          return { success: false, error: errMsg, status: res.status };
        }

        const payload = data.data ?? data;
        const token = payload.accessToken ?? data.accessToken ?? null;
        const usuario = payload.usuario ?? payload.user ?? null;

        if (token) setAccessToken(token);
        if (usuario) setUser(usuario);

        console.log(`[login] ✅ Login bem-sucedido na tentativa ${attempt}`);
        return { success: true, payload, token, usuario };
      } catch (err) {
        // console.error(`[login] Erro na tentativa ${attempt}:`, err.message);
        lastError = err;
        
        if (attempt < maxRetries) {
          // aguarda antes de tentar novamente (delay exponencial: 500ms, 1s, 1.5s)
          const delay = 500 * attempt;
          console.log(`[login] Aguardando ${delay}ms antes de retry...`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    const errMsg = lastError?.message || 'Erro ao autenticar após múltiplas tentativas';
    // console.error(`[login] ❌ Login falhou após ${maxRetries} tentativas:`, errMsg);
    return { success: false, error: errMsg, status: 0 };
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

    let res;
    try {
      res = await fetch(input, initCopy);
    } catch (fetchErr) {
      // Se a fetch falhar (ex: ECONNRESET), tenta refresh e re-tenta uma vez
      console.warn('[fetchWithAuth] Erro na requisição:', fetchErr.message);
      try {
        const refreshResult = await doRefresh();
        if (!refreshResult?.success) {
          throw new Error('Refresh falhou durante retry');
        }
        if (refreshResult.newAccessToken) setAccessToken(refreshResult.newAccessToken);
        if (refreshResult.usuario) {
          // try to ensure ftPerfil is present
          if (!refreshResult.usuario.ftPerfil) {
            try {
              const meRes = await fetch(`${BACKEND_BASE}auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: { Authorization: refreshResult.newAccessToken ? `Bearer ${refreshResult.newAccessToken}` : undefined },
              });
              if (meRes.ok) {
                const meData = await meRes.json().catch(() => ({}));
                setUser(meData.usuario ?? meData.user ?? refreshResult.usuario);
              } else setUser(refreshResult.usuario);
            } catch (e) { setUser(refreshResult.usuario); }
          } else setUser(refreshResult.usuario);
        }

        // reconstrói init com novo token
        const retryInit = {
          ...init,
          credentials: 'include',
          headers: {
            ...(init.headers || {}),
            ...(refreshResult.newAccessToken ? { Authorization: `Bearer ${refreshResult.newAccessToken}` } : {}),
          },
        };

        console.log('[fetchWithAuth] Retentando requisição após refresh...');
        res = await fetch(input, retryInit);
      } catch (retryErr) {
        // console.error('[fetchWithAuth] Erro mesmo após retry:', retryErr.message);
        throw fetchErr; // lança o erro original
      }
    }

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
        if (refreshResult.usuario) {
          if (!refreshResult.usuario.ftPerfil) {
            try {
              const meRes = await fetch(`${BACKEND_BASE}auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: { Authorization: refreshResult.newAccessToken ? `Bearer ${refreshResult.newAccessToken}` : undefined },
              });
              if (meRes.ok) {
                const meData = await meRes.json().catch(() => ({}));
                setUser(meData.usuario ?? meData.user ?? refreshResult.usuario);
              } else setUser(refreshResult.usuario);
            } catch (e) { setUser(refreshResult.usuario); }
          } else setUser(refreshResult.usuario);
        } else setUser(null);

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

  // Força um fetch de /auth/me e atualiza o estado `user` no contexto.
  const refreshUser = useCallback(async () => {
    try {
      const meRes = await fetch(`${BACKEND_BASE}auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (meRes.ok) {
        const meData = await meRes.json().catch(() => ({}));
        const usuario = meData.usuario ?? meData.user ?? null;
        setUser(usuario);
        return { success: true, usuario };
      }
      setUser(null);
      return { success: false };
    } catch (err) {
      console.warn('[Auth] refreshUser failed', err);
      return { success: false, error: err };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, initialized, login, logout, fetchWithAuth, doRefresh, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
