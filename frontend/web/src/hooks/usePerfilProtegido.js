import { useEffect } from "react";
import { useRouter } from "next/router";

export const usePerfilProtegido = (perfilNecessario) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const perfil = localStorage.getItem("perfil");

    if (!token || perfil !== perfilNecessario) {
      router.push("/login"); // redireciona para login se não autorizado
    }
  }, [router, perfilNecessario]);
};
