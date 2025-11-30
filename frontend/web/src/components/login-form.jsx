"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation'
import { EyeOff, Eye } from 'lucide-react';

export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ email, senha });
      if (!result.success) {
        setError(result.error || `Erro: ${result.status ?? ''}`);
        return;
      }
      // console.log('login result =>', result);

      const payload = result.payload ?? result.data ?? result.data?.data ?? null;
      const perfil = payload?.usuario?.perfil ?? payload?.usuario?.perfil ?? payload?.perfil ?? null;
      console.log('perfil detectado:', perfil);

      // se não houver perfil, você pode chamar um endpoint /me com fetchWithAuth para pegar info
      switch (perfil) {
        case "GERENTE_MATRIZ":
          router.push("/matriz/dashboard");
          break;
        case "GERENTE_FAZENDA":
          router.push("/fazenda/dashboard");
          break;
        case "GERENTE_LOJA":
          router.push("/loja/dashboard");
          break;
        default:
          // rota padrão
          router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Informe seu e-mail para continuar
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pr-10"
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <a href="/esqueciSenha" className="ml-auto text-sm underline-offset-4 hover:underline">
          Esqueci a senha
        </a>
        <Button type="submit" className="w-full">
          {loading ? "Carregando..." : "Login"}
        </Button>
        {/* <div
          className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_4507_2)">
              <path d="M47.5391 19.5474H24.5113V28.7747H37.7431C37.5304 30.0805 37.0528 31.3652 36.3534 32.5366C35.552 33.8786 34.5613 34.9004 33.5459 35.6785C30.5042 38.0093 26.958 38.4859 24.4952 38.4859C18.2738 38.4859 12.9581 34.4649 10.9002 29.0011C10.8172 28.8029 10.762 28.5981 10.6949 28.3956C10.2401 27.005 9.99169 25.5323 9.99169 24.0015C9.99169 22.4084 10.2607 20.8835 10.7513 19.4432C12.6864 13.7628 18.122 9.52012 24.4997 9.52012C25.7824 9.52012 27.0178 9.67282 28.1892 9.97738C30.8665 10.6734 32.7603 12.0442 33.9207 13.1286L40.9225 6.27151C36.6634 2.36633 31.1111 5.90435e-09 24.488 5.90435e-09C19.1933 -0.000113959 14.305 1.64956 10.2992 4.43757C7.05062 6.69857 4.38633 9.72576 2.58825 13.2415C0.915782 16.5013 0 20.1138 0 23.9979C0 27.8822 0.917181 31.5322 2.58966 34.7619V34.7837C4.3562 38.2124 6.93949 41.1646 10.0792 43.4152C12.8221 45.3814 17.7403 48 24.488 48C28.3684 48 31.8075 47.3004 34.8405 45.9893C37.0285 45.0435 38.9671 43.8098 40.7222 42.2244C43.0413 40.1294 44.8575 37.5382 46.0972 34.557C47.3369 31.5757 48 28.2044 48 24.5493C48 22.8471 47.829 21.1184 47.5391 19.5473V19.5474Z" fill="currentColor" />
            </g>
            <defs>
              <clipPath id="clip0_4507_2">
                <rect width="48" height="48" fill="currentColor" />
              </clipPath>
            </defs>
          </svg>

          Entrar com o Google
        </Button> */}
      </div>
      <div className="text-center text-sm">
        Ainda não tem uma conta?{" "}
        <a href="/cadastrar" className="underline underline-offset-4">
          Cadastre-se
        </a>
      </div>
    </form>
  );
}
