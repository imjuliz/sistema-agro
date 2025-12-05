"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_URL } from "@/lib/api";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export async function fetchPublic(url, options = {}) {
    return fetch(url, {headers: { "Content-Type": "application/json" },...options,});
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold text-black dark:text-white mb-5">Esqueci a senha</h1>
                <p className="text-muted-foreground text-sm text-balance mb-15">Insira seu e-mail para recuperar sua senha.</p>
            </div>
            <div className="grid gap-6">
                <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" className="text-white w-full" value={email} required onChange={(e) => setEmail(e.target.value)} />
                <Button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar código"}
                </Button>
            </div>
            <a href="/login" className="underline text-black dark:text-white text-sm">Voltar</a>
        </form>
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
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6 items-center", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center w-full">
                <h1 className="text-3xl font-bold text-black mb-5 dark:text-white">Redefinição de senha</h1>
                <p className="text-muted-foreground text-1sm text-balance mb-15">
                    Defina uma nova senha para sua conta. {emailQuery ? <span className="font-medium">({emailQuery})</span> : null}
                </p>
            </div>
            <div className="grid gap-6 w-full">
                <div className="grid gap-3">
                    <Label htmlFor="Senha" className={'text-black dark:text-white'}>Senha</Label>
                    <Input id="senha" type="password" placeholder="Digite sua nova senha" className={'text-black w-[100%] dark:text-white'} value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="Confirmar senha" className={'text-black dark:text-white'}>Confirme sua senha</Label>
                    <Input id="senhaConfirmada" type="password" placeholder="Confirme a senha" className={'text-black w-[100%] dark:text-white'} value={confSenha} onChange={(e) => setConfSenha(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-black text-white mt-15 dark:bg-white dark:text-black" disabled={loading}>
                    {loading ? 'Redefinindo...' : 'Redefinir'}
                </Button>
            </div>
            {message && (
                <div className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</div>
            )}
            <div className="text-center text-sm text-white">
                <a href="/login" className="underline underline-offset-4 text-black dark:text-white">
                    Voltar
                </a>
            </div>
        </form>
    );
}
