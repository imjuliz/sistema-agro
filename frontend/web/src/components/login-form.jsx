"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation'
import { EyeOff, Eye } from 'lucide-react';

// Componentes Field simplificados usando componentes existentes
function FieldGroup({ className, ...props }) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />;
}

function Field({ className, ...props }) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function FieldLabel({ className, ...props }) {
  return <Label className={cn("", className)} {...props} />;
}

function FieldDescription({ className, ...props }) {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function FieldSeparator({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-4 text-sm text-muted-foreground",
        "before:flex-1 before:border-t before:border-border",
        "after:flex-1 after:border-t after:border-border",
        className
      )}
      {...props}
    >
      <span data-slot="field-separator-content">{children}</span>
    </div>
  );
}

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

      const payload = result.payload ?? result.data ?? result.data?.data ?? null;
      const perfil = payload?.usuario?.perfil ?? payload?.usuario?.perfil ?? payload?.perfil ?? null;
      console.log('perfil detectado:', perfil);
      localStorage.setItem('accessToken', payload.accessToken);

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Faça login com sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="/esqueciSenha"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Carregando..." : "Login"}
                </Button>
                
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Ao continuar, você concorda com nossos <a href="#" className="underline-offset-4 hover:underline">Termos de Serviço</a>{" "}
        e <a href="/politicaPrivacidade" className="underline-offset-4 hover:underline">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  );
}
