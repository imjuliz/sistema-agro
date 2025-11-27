// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';

// export const usePerfilProtegido = (perfilNecessario) => {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     // enquanto checa refresh, não redirecionar (previne flash)
//     if (loading) return;

//     const perfil = user?.perfil ?? null;
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     if (perfilNecessario && perfil !== perfilNecessario) {
//       router.push('/login'); // ou /403
//     }
//   }, [user, loading, router, perfilNecessario]);
// };
// hooks/usePerfilProtegido.js
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export const usePerfilProtegido = (perfilNecessario) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const allowed = useMemo(() => {
    if (!user) return false;
    if (!perfilNecessario) return true;
    return String(user.perfil ?? "").toUpperCase() === String(perfilNecessario).toUpperCase();
  }, [user, perfilNecessario]);

  useEffect(() => {
    // enquanto o auth ainda carrega, mantenha checking true
    if (loading) {
      setChecking(true);
      return;
    }

    // terminou de carregar
    setChecking(false);

    // se não há usuário ou não tem permissão, redireciona imediatamente
    if (!user) {
      // use replace para não deixar rota anterior no histórico
      router.replace("/login");
      return;
    }
    if (perfilNecessario && !allowed) {
      // opcional: redirecionar para 403 ou login
      router.replace("/login"); // ou "/403"
    }
  }, [loading, user, allowed, perfilNecessario, router]);

  return { checking, allowed, user };
};
