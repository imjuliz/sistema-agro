// "use client";
// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext";
// import FullPageLoader from "./FullPageLoader";

// /**
//  * Componente para proteger rotas/client layout.
//  * - Enquanto loading -> mostra FullPageLoader
//  * - Quando loading false + !user -> router.replace('/login') e retorna null (nenhum conteúdo protegido é renderizado)
//  * - Quando user existe -> renderiza children
//  */
// export default function RequireAuth({ children, redirectTo = "/login" }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // efeito apenas para redirecionamento (hooks no topo, ordem fixa)
//   useEffect(() => {
//     if (!loading && !user) {
//       // replace evita empilhar histórico
//       router.replace(redirectTo);
//     }
//   }, [loading, user, router, redirectTo]);

//   // Enquanto estamos verificando sessão, mostramos loader completo
//   if (loading) {
//     return <FullPageLoader />;
//   }

//   // Se não estamos loading e não há usuário, já estamos redirecionando no efeito.
//   // Retornamos null para não renderizar conteúdo privado por nenhum frame.
//   if (!user) {
//     return null;
//   }

//   // usuário autenticado: renderiza children (conteúdo privado)
//   return <>{children}</>;
// }
'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import FullPageLoader from "./FullPageLoader";

export default function RequireAuth({ children, redirectTo = "/login" }) {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return; // espera inicialização completa
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [initialized, loading, user, router, redirectTo]);

  // Enquanto init não completa ou está carregando -> mostra loader completo.
  if (!initialized || loading) {
    return <FullPageLoader />;
  }

  // Se já inicializou e não há usuário, null (o effect já faz router.replace)
  if (!user) return null;

  return <>{children}</>;
}
