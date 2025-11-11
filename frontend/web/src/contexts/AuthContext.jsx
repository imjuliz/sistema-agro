// Gerencia o estado global do usuário autenticado (login, logout, token, dados do usuário).
// Todos os componentes podem consultar useAuth() para saber se há um usuário logado e quem ele é.
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/';
const LOGIN_ENDPOINT = `${BACKEND_BASE}auth/login`;
const REFRESH_ENDPOINT = `${BACKEND_BASE}auth/refresh`;
const LOGOUT_ENDPOINT = `${BACKEND_BASE}auth/logout`;

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tenta obter novo accessToken ao montar (o refresh cookie pode existir)
  // useEffect(() => {
  //   let mounted = true;
  //   async function tryRefresh() {
  //     try {
  //       const res = await fetch(REFRESH_ENDPOINT, {
  //         method: 'POST',
  //         credentials: 'include', // importante: envia cookie HttpOnly
  //         headers: { 'Content-Type': 'application/json' },
  //       });
  //       if (!res.ok) {
  //         setAccessToken(null);
  //         setUser(null);
  //       } else {
  //         const data = await res.json();
  //         // backend retorna { accessToken, maybe userData }
  //         if (mounted) {
  //           setAccessToken(data.accessToken ?? null);
  //           if (data.usuario) setUser(data.usuario);
  //         }
  //       }
  //     } catch (err) {
  //       console.error('refresh on mount failed', err);
  //       setAccessToken(null);
  //       setUser(null);
  //     } finally {
  //       if (mounted) setLoading(false);
  //     }
  //   }
  //   tryRefresh();
  //   return () => { mounted = false; };
  // }, []);
  useEffect(() => {
    let mounted = true;
    async function tryRefresh() {
      // Se já temos accessToken (ex.: usuário fez login), não precisa aqui
      if (!mounted) return;
      try {
        const res = await fetch(REFRESH_ENDPOINT, { method: 'POST', credentials: 'include' });
        if (!res.ok) { setAccessToken(null); setUser(null); return; }
        const data = await res.json();
        setAccessToken(data.accessToken ?? data.data?.accessToken ?? null);
        if (data.usuario || data.data?.usuario) setUser(data.usuario ?? data.data?.usuario);
      } catch (err) {
        console.error('refresh on mount failed', err);
        setAccessToken(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    tryRefresh();
    return () => { mounted = false; };
  }, []);


  // login: envia credenciais, backend seta cookie HttpOnly e retorna accessToken
  const login = useCallback(async ({ email, senha }) => {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || data.mensagem || data.erro || 'Erro ao autenticar' };
    }


    const payload = data.data ?? data;
    const usuario = payload.usuario ?? payload.user ?? null;

    setAccessToken(payload.accessToken ?? payload.accessToken); // redundante mas explícito
    if (usuario) setUser(usuario);

    return { success: true, payload }; // retorno consistente
  }, []);

  // logout: chama endpoint que revoga sessao e limpa cookie
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

  // fetchWithAuth: envia Authorization + tenta refresh se 401
  // const fetchWithAuth = useCallback(async (input, init = {}) => {
  //   const initCopy = {
  //     ...init,
  //     credentials: 'include', // garante envio do cookie de refresh quando necessário
  //     headers: {
  //       ...(init.headers || {}),
  //       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  //     },
  //   };

  //   let res = await fetch(input, initCopy);
  //   if (res.status === 401) {
  //     // tentar refresh token
  //     const refreshRes = await fetch(REFRESH_ENDPOINT, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (!refreshRes.ok) {
  //       // não foi possível renovar -> logout
  //       setAccessToken(null);
  //       setUser(null);
  //       throw new Error('Sessão expirada. Faça login novamente.');
  //     }
  //     const refreshData = await refreshRes.json();
  //     const newAccessToken = refreshData.accessToken;
  //     setAccessToken(newAccessToken);

  //     // repetir requisição original com novo token
  //     const retryInit = {
  //       ...init,
  //       credentials: 'include',
  //       headers: {
  //         ...(init.headers || {}),
  //         Authorization: `Bearer ${newAccessToken}`,
  //       },
  //     };
  //     res = await fetch(input, retryInit);
  //   }
  //   return res;
  // }, [accessToken]);
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
    // tentar refresh
    const refreshRes = await fetch(REFRESH_ENDPOINT, { method: 'POST', credentials: 'include' });
    if (!refreshRes.ok) {
      setAccessToken(null);
      setUser(null);
      throw new Error('Sessão expirada');
    }
    const refreshData = await refreshRes.json();
    const newAccessToken = refreshData.accessToken ?? refreshData.data?.accessToken;
    if (newAccessToken) setAccessToken(newAccessToken);

    // retry
    initCopy = {
      ...init,
      credentials: 'include',
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
    };
    res = await fetch(input, initCopy);
  }

  return res;
}, [accessToken]);


  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
