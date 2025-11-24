// 'use client';

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { usePathname } from 'next/navigation';

// const AuthContext = createContext();

// const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/';
// const LOGIN_ENDPOINT = `${BACKEND_BASE}auth/login`;
// const REFRESH_ENDPOINT = `${BACKEND_BASE}auth/refresh`;
// const LOGOUT_ENDPOINT = `${BACKEND_BASE}auth/logout`;

// let refreshPromise = null;

// export function AuthProvider({ children, skipInitialRefresh = false }) {
//   const pathname = usePathname();
//   const [accessToken, setAccessToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initialized, setInitialized] = useState(false); // nova flag

//   const doRefresh = useCallback(async () => {
//     if (refreshPromise) return refreshPromise;
//     refreshPromise = (async () => {
//       try {
//         const res = await fetch(REFRESH_ENDPOINT, {
//           method: 'POST',
//           credentials: 'include',
//           headers: { 'Accept': 'application/json' },
//         });

//         if (!res.ok) {
//           // Mantemos limpeza do estado, mas não logamos ruidosamente aqui.
//           setAccessToken(null);
//           setUser(null);

//           // lança erro com status para quem chamou poder agir
//           throw new Error(`refresh-failed:${res.status}`);
//         }

//         const data = await res.json();
//         const newAccessToken = data.accessToken ?? data.data?.accessToken ?? null;
//         let usuario = data.usuario ?? data.data?.usuario ?? null;


//         if (!usuario && newAccessToken) {
//           try {
//             const meRes = await fetch(`${BACKEND_BASE}auth/me`, {
//               method: 'GET',
//               credentials: 'include',
//               headers: {
//                 Authorization: `Bearer ${newAccessToken}`,
//               },
//             });
//             if (meRes.ok) {
//               const meData = await meRes.json();
//               usuario = meData.usuario ?? null;
//             }
//           } catch (err) {
//             console.warn('Falha ao buscar /auth/me:', err);
//           }
//         }

//         if (newAccessToken) setAccessToken(newAccessToken);
//         // if (usuario)
//         //   setUser({
//         //     ...usuario,
//         //     // perfil: usuario?.perfil?.funcao ?? null,
//         //   });
//         if (usuario) setUser(usuario);

//         return { data, newAccessToken, usuario };
//       } finally {
//         refreshPromise = null;
//       }
//     })();

//     return refreshPromise;
//   }, []);

//   // useEffect(() => {
//   //   let mounted = true;

//   //   async function tryRefresh() {
//   //     if (!mounted) return;
//   //     setLoading(true); // Definir loading como true no início

//   //     // Se o provider for usado em páginas públicas (ex: login) e quisermos pular o refresh inicial:
//   //     const publicPaths = ['/login', '/cadastrar', '/esqueciSenha'];
//   //     if (skipInitialRefresh || publicPaths.some(p => pathname?.startsWith(p))) {
//   //       // não tentar refresh automático nessas páginas
//   //       if (mounted) setLoading(false);
//   //       return;
//   //     }

//   //     try {
//   //       await doRefresh();
//   //     } catch (err) {
//   //       // Suprima erro de refresh 401 (esperado quando não há cookie)
//   //       if (!String(err).includes('refresh-failed:401')) {
//   //         console.error('refresh on mount failed', err);
//   //       } else {
//   //         // opcional: console.debug('refresh 401 on mount (expected)');
//   //       }
//   //       setAccessToken(null);
//   //       setUser(null);
//   //     } finally {
//   //       if (mounted) setLoading(false);
//   //     }
//   //   }

//   //   tryRefresh();
//   //   return () => { mounted = false; };
//   // }, [doRefresh, pathname, skipInitialRefresh]); // Adicionado doRefresh como dependência
//   useEffect(() => {
//     let mounted = true;

//     async function tryRefresh() {
//       if (!mounted) return;
//       setLoading(true);
//       setInitialized(false);

//       const publicPaths = ['/login', '/cadastrar', '/esqueciSenha'];
//       const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

//       if (skipInitialRefresh || publicPaths.some(p => currentPath.startsWith(p))) {
//         if (mounted) {
//           setLoading(false);
//           // microtick para garantir ordem no React render
//           setTimeout(() => { if (mounted) setInitialized(true); }, 0);
//         }
//         return;
//       }

//       try {
//         console.debug('[Auth] starting initial refresh');
//         const result = await doRefresh();
//         console.debug('[Auth] doRefresh result', result);
//       } catch (err) {
//         if (!String(err).includes('refresh-failed:401')) {
//           console.error('[Auth] refresh on mount failed', err);
//         } else {
//           console.debug('[Auth] refresh 401 on mount (expected)');
//         }
//         setAccessToken(null);
//         setUser(null);
//       } finally {
//         if (mounted) {
//           setLoading(false);
//           // delay curto garante que setUser tenha sido aplicado
//           setTimeout(() => {
//             if (!mounted) return;
//             setInitialized(true);
//             console.debug('[Auth] initial check finished (delayed). user=', user);
//           }, 150); // 150ms - conservador; reduz depois se quiser
//         }
//       }
//     }

//     tryRefresh();
//     return () => { mounted = false; };
//   }, [doRefresh, skipInitialRefresh]);

//   // login: envia credenciais, backend seta cookie HttpOnly e retorna accessToken
//   const login = useCallback(async ({ email, senha }) => {
//     const res = await fetch(LOGIN_ENDPOINT, {
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, senha }),
//     });

//     const data = await res.json().catch(() => ({}));

//     if (!res.ok) {
//       const errMsg = data.error || data.mensagem || data.erro || 'Erro ao autenticar';
//       return { success: false, error: errMsg, status: res.status };
//     }

//     // extrair payload com robustez
//     const payload = data.data ?? data;
//     const token = payload.accessToken ?? data.accessToken ?? null;
//     const usuario = payload.usuario ?? payload.user ?? null;

//     if (token) setAccessToken(token);
//     if (usuario) setUser(usuario);

//     return { success: true, payload, token, usuario };
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       await fetch(LOGOUT_ENDPOINT, { method: 'POST', credentials: 'include' });
//     } catch (err) {
//       console.warn('logout failed', err);
//     } finally {
//       setAccessToken(null);
//       setUser(null);
//     }
//   }, []);

//   const fetchWithAuth = useCallback(async (input, init = {}) => {
//     let initCopy = {
//       ...init,
//       credentials: 'include',
//       headers: {
//         ...(init.headers || {}),
//         ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//       },
//     };

//     let res = await fetch(input, initCopy);

//     if (res.status === 401) {
//       try {
//         const refreshResult = await doRefresh();
//         const newAccessToken = refreshResult?.newAccessToken ?? null;


//         if (!newAccessToken) {
//           setAccessToken(null);
//           setUser(null);
//           throw new Error('Sessão expirada');
//         }

//         initCopy = {
//           ...init,
//           credentials: 'include',
//           headers: {
//             ...(init.headers || {}),
//             Authorization: `Bearer ${newAccessToken}`,
//           },
//         };
//         res = await fetch(input, initCopy);
//       } catch (err) {
//         throw err;
//       }
//     }

//     return res;
//   }, [accessToken, doRefresh]);

//   return (
//     <AuthContext.Provider value={{ accessToken, user, loading, initialized, login, logout, fetchWithAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const AuthContext = createContext();

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/';
const LOGIN_ENDPOINT = `${BACKEND_BASE}auth/login`;
const REFRESH_ENDPOINT = `${BACKEND_BASE}auth/refresh`;
const LOGOUT_ENDPOINT = `${BACKEND_BASE}auth/logout`;

let refreshPromise = null;

/**
 * doRefresh agora APENAS busca e retorna { success, newAccessToken, usuario, data }
 * Não altera diretamente os estados do provider — quem chama aplica o estado.
 */
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
    <AuthContext.Provider value={{ accessToken, user, loading, initialized, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
