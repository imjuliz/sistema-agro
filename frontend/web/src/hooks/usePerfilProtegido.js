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
    
    // user.perfil may be a string (e.g. 'GERENTE_LOJA') or an object ({ funcao, descricao })
    const perfilRaw = user.perfil ?? null;
    let perfilValue = '';
    if (typeof perfilRaw === 'string') perfilValue = perfilRaw;
    else if (typeof perfilRaw === 'object' && perfilRaw !== null) {
      perfilValue = String(perfilRaw.funcao ?? perfilRaw.nome ?? '');
    }
    const userPerfilUppercase = String(perfilValue).toUpperCase();

    // perfilNecessario can be a string or an array of strings
    if (Array.isArray(perfilNecessario)) {
      return perfilNecessario.some(p => String(p).toUpperCase() === userPerfilUppercase);
    } else {
      return userPerfilUppercase === String(perfilNecessario).toUpperCase();
    }
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
