'use client'
import { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CadastrarForm({
  className,
  ...props
}) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetPassword, setRepetPassword] = useState("");

  const [errors, setErrors] = useState({});

  // Função de validação
  const validate = () => {
    const newErrors = {};

    if (!nome.trim()) {
      newErrors.nome = "O nome é obrigatório";
    }

    if (!email.trim()) {
      newErrors.email = "O email é obrigatório";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "A senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    if (!repetPassword) {
      newErrors.repetPassword = "Confirme sua senha";
    } else if (password !== repetPassword) {
      newErrors.repetPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);

    // Retorna true se não houver erros
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // Aqui você pode enviar os dados para o backend
      console.log({ nome, email, password });
      alert("Cadastro válido!");
    }
  };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Cadastrar-se</h1>
        <p className="text-muted-foreground text-sm">
          Preencha os dados abaixo para criar uma nova conta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" type="text" placeholder="Digite nome e sobrenome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="grid gap-3">
          {/* <div className="flex items-center"> */}
          <Label htmlFor="password">Senha</Label>
          {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div> */}
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {errors.password && (<p className="text-red-500 text-sm">{errors.password}</p>)}
        </div>
        <div className="grid gap-3">
          {/* <div className="flex items-center"> */}
          <Label htmlFor="repetPassword">Confirmar senha</Label>
          {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div> */}
          <Input id="repetPassword" type="password" value={repetPassword} onChange={(e) => setRepetPassword(e.target.value)} required />
          {errors.repetPassword && ( <p className="text-red-500 text-sm">{errors.repetPassword}</p> )}
        </div>
        <Button type="submit" className="w-full">
          Criar conta
        </Button>

      </div>
      <div className="text-center text-sm">
        Já tem uma conta?{" "}
        <a href="/login" className="underline underline-offset-4">
          Entrar
        </a>
      </div>
    </form>
  );
}
