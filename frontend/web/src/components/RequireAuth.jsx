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
