'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const usePerfilProtegido = (perfilNecessario) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // enquanto checa refresh, não redirecionar (previne flash)
    if (loading) return;

    const perfil = user?.perfil ?? null;
    if (!user) {
      router.push('/login');
      return;
    }

    if (perfilNecessario && perfil !== perfilNecessario) {
      router.push('/login'); // ou /403
    }
  }, [user, loading, router, perfilNecessario]);
};
