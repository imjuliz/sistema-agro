import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EsqueciForm({ className, ...props }) {
    return (
        <form className={cn("flex flex-col gap-6 items-center", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold text-black mb-5 dark:text-white">Esqueci a senha</h1>
                <p className="text-muted-foreground text-1sm text-balance mb-15">
                    Não se preocupe, acontece com todos nós! Insira seu e-mail abaixo para recuperar sua senha.
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email" className={'text-black dark:text-white'}>Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" className={'text-white h-15 w-100'} required />
                </div><a href="/verificacao">
                    <Button type="submit" className="w-full bg-black text-white mt-15 dark:bg-white dark:text-black">
                        Enviar código</Button></a>
            </div>
            <div className="text-center text-sm text-white">
                <a href="/login" className="underline underline-offset-4 text-black dark:text-white">
                    Voltar
                </a>
            </div>
        </form>
    );
}
export function RedefinirForm({ className, ...props }) {
    return (
        <form className={cn("flex flex-col gap-6 items-center", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold text-black mb-5 dark:text-white">Redefinição de senha</h1>
                <p className="text-muted-foreground text-1sm text-balance mb-15">
                    Defina uma nova senha para sua conta.
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="Senha" className={'text-black dark:text-white'}>Senha</Label>
                    <Input id="senha" type="text" placeholder="" className={'text-black h-15 w-100 dark:text-white'} required />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="Confirmar senha" className={'text-black dark:text-white'}>Confirme sua senha</Label>
                    <Input id="senhaConfirmada" type="password" placeholder="" className={'text-black h-15 w-100 dark:text-white'} required />
                </div><a href="/verificacao">
                    <Button type="submit" className="w-full bg-black text-white mt-15 dark:bg-white dark:text-black">
                        Redefinir</Button></a>
            </div>
            <div className="text-center text-sm text-white">
                <a href="/login" className="underline underline-offset-4 text-black dark:text-white">
                    Voltar
                </a>
            </div>
        </form>
    );
}
