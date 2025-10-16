// // Gerencia o estado global do usuário autenticado (login, logout, token, dados do usuário).
// // Todos os componentes podem consultar useAuth() para saber se há um usuário logado e quem ele é.

// "use client"; 
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; 

// // base da url do backend
// const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/";
// // endpoints concatenando a base c/ as rotas
// const PROFILE_ENDPOINT = `${BACKEND_BASE}auth/me`;
// const LOGIN_ENDPOINT = `${BACKEND_BASE}auth/login`;
// const LOGOUT_ENDPOINT = `${BACKEND_BASE}auth/logout`;

// // cria o contexto de autenticação (objeto q vai ser compartilhado entre componentes)
// const AuthContext = createContext();

// // exporta o provider que encapsula a app/parte da app e fornece autenticação via contexto
// export function AuthProvider({ children }) {
//   const router = useRouter(); 
  
//   const [user, setUser] = useState(undefined); // undefined -> carregando, null -> nn autenticado, object -> user autenticado
//   const [loading, setLoading] = useState(true); // controlar carregamento

//   // função que tenta obter os dados do usuário a partir do endpoint /auth/me
//   async function loadUser() {
//     setLoading(true); 
//     try {
//       const res = await fetch(PROFILE_ENDPOINT, {
//         method: "GET", 
//         credentials: "include", 
//         headers: { "Content-Type": "application/json" }, 
//       });

//       if (res.ok) {
//         const data = await res.json(); 
//         setUser(data); // atualiza o estado do usuário com os dados recebidos
//       } else {
//         // se status nn for duzentos e alguma coisa, considera usuario nn autenticado
//         setUser(null);
//       }
//     } catch (err) {
//       // captura erros de rede ou parse e marca como nn autenticado (loga o erro no console)
//       console.error("Erro loadUser:", err);
//       setUser(null);
//     } finally {
//       setLoading(false); // finaliza estado de carregamento (independente do resultado)
//     }
//   }

//   useEffect(() => {
//     loadUser(); // funcao p popular user no inicio
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // função de login que envia credenciais p back; backend deve setar cookie httpOnly
//   async function login({ email, senha }) {
//     try {
//       const res = await fetch(LOGIN_ENDPOINT, {
//         method: "POST", 
//         credentials: "include", 
//         headers: { "Content-Type": "application/json" }, 
//         body: JSON.stringify({ email, senha }), 
//       });

//       const data = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         const errMsg = data.error || data.mensagem || "Erro ao autenticar";
//         return { success: false, error: errMsg }; 
//       }

//       // se o back retornou os dados do usuario no body, usa eles p setar estado local
//       if (data.user) {
//         setUser(data.user);
//       } else {
//         // caso contrário, faz chamada p /auth/me para recuperar dados (ainda n temos essa rota)
//         await loadUser();
//       }

//       // redirecionamento com base no perfil do usuario
//       // tenta obter perfil a partir do data.user ou do state user
//       const perfil = (data.user && data.user.perfil) || (user && user.perfil);
//       switch (perfil) {
//         case "gerente_matriz":
//           router.push("/matriz/dashboard"); 
//           break;
//         case "gerente_fazenda":
//           router.push("/fazenda/dashboard"); 
//           break;
//         case "gerente_loja":
//           router.push("/loja/dashboard"); 
//           break;
//         default:
//           router.push("/"); // se perfil desconhecido -> home
//       }

//       return { success: true }; 
//     } catch (err) {
//       console.error("Erro no login:", err);
//       return { success: false, error: err.message || "Erro de login" };
//     }
//   }

//   // funcao de logout que chama o endpoint do back que expira/limpa o cookie (ainda n existe essa rota)
//   async function logout() {
//     try {
//       await fetch(LOGOUT_ENDPOINT, {
//         method: "POST", 
//         credentials: "include", 
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (err) {
//       // se ocorrer erro no fetch, loga um aviso (não bloqueia fluxo)
//       console.warn("Erro no logout:", err);
//     } finally {
//       setUser(null); // limpa estado de usuário local (desloga no front)
//       router.push("/login"); 
//     }
//   }

//   // helper p fzr fetchs que precisam do cookie; adiciona credentials e trata 401
//   async function fetchWithAuth(url, options = {}) {
//     const opts = {
//       ...options, // preserva options passadas pelo chamador
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         ...(options.headers || {}), // mescla headers customizados se existirem
//       },
//     };
//     const res = await fetch(url, opts); // executa fetch com as opções ajustadas
//     if (res.status === 401) {
//       // se servidor responder 401 limpa estado local p refletir logout
//       setUser(null);
//       // opcional: poderíamos redirecionar p login aqui com router.push("/login");
//     }
//     return res; 
//   }

//   // o provider fornece via contexto o `user`, `loading` e funções de controle
//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, loadUser, fetchWithAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // hook de conveniência para consumir o contexto de autenticação
// export function useAuth() {
//   return useContext(AuthContext);
// }
