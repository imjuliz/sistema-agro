"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_URL } from "@/lib/api";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"

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
export async function fetchPublic(url, options = {}) {
    return fetch(url, { headers: { "Content-Type": "application/json" }, ...options, });
};

export function EsqueciForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const url = `${API_URL}/auth/esqSenha`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Código enviado para seu e-mail. Verifique sua caixa de entrada.');
                router.push(`/verificacao?email=${encodeURIComponent(email)}`);
                return;
            }
            toast.error(data?.error || data?.message || "Erro ao enviar código");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao conectar ao servidor.");
        }
        finally { setLoading(false); }
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Esqueci a senha</CardTitle>
                <CardDescription>Digite seu e-mail e enviaremos instruções para redefinir sua senha</CardDescription>
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
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar código"}
                            </Button>
                        </Field>

                        <Field><a href="/login" className="underline text-black dark:text-white text-center mt-5 text-sm">Voltar</a></Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}

export function RedefinirForm({ className, ...props }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const codigo = searchParams?.get?.('codigo') || null;
    const emailQuery = searchParams?.get?.('email') || '';
    const [senha, setSenha] = useState('');
    const [confSenha, setConfSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        if (!codigo) { setMessage({ type: 'error', text: 'Código ausente. Volte e gere um novo código.' }); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/updateSenha/${encodeURIComponent(codigo)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha, confSenha }),
            });
            const data = await res.json();
            if (res.ok && data.sucesso) {
                toast.success('Senha redefinida com sucesso. Faça login.');
                router.push('/login');
                return;
            }
            const errText = data?.erro || data?.message || 'Erro ao redefinir senha.';
            setMessage({ type: 'error', text: errText });
            toast.error(errText);
        } catch (err) {
            console.error('Erro updateSenha:', err);
            setMessage({ type: 'error', text: 'Erro ao conectar ao servidor.' });
            toast.error('Erro ao conectar ao servidor.');
        } finally { setLoading(false); }
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Redefinição de senha</CardTitle>
                <CardDescription>Defina uma nova senha para sua conta {emailQuery ? <span className="font-semibold">{emailQuery}</span> : null}</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit}>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="email">Senha</FieldLabel>
                        <Input id="senha" type="password" placeholder="Digite sua nova senha" className={'text-black w-[100%] dark:text-white'} value={senha} onChange={(e) => setSenha(e.target.value)} required />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="Confirmar senha" className={'text-black dark:text-white'}>Confirme sua senha</FieldLabel>
                        <Input id="senhaConfirmada" type="password" placeholder="Confirme a senha" className={'text-black w-[100%] dark:text-white'} value={confSenha} onChange={(e) => setConfSenha(e.target.value)} required />
                    </Field>

                    <Field>
                        <Button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black" disabled={loading}>
                            {loading ? 'Redefinindo...' : 'Redefinir'}
                        </Button>
                    </Field>
                    {message && (
                        <div className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</div>
                    )}
                    <Field className="text-center text-sm text-white mt-5">
                        <a href="/login" className="underline underline-offset-4 text-black dark:text-white">
                            Voltar
                        </a>
                    </Field>
                </FieldGroup>
            </form>
            </CardContent>
        </Card>
    );
}
