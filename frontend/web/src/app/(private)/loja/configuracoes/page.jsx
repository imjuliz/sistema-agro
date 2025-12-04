"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import buildImageUrl from '@/lib/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Image as ImageIcon, Bell, Monitor, AlertTriangle, Copy } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';
import { usePerfilProtegido } from "@/hooks/usePerfilProtegido";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAppearance } from "@/contexts/AppearanceContext"; // Importar useAppearance

export default function SettingsPage() {
    usePerfilProtegido("GERENTE_LOJA");

    const { user, loading, initialized, fetchWithAuth, doRefresh } = useAuth();
    const { toast } = useToast();
    const { theme: globalTheme, selectedFontSize: globalSelectedFontSize, applyPreferences } = useAppearance(); // Obter do contexto

    const { lang, changeLang } = useTranslation();
    const languageOptions = [
        { value: 'pt-BR', label: 'Português (BR)' },
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' }
    ];

    const [active, setActive] = useState("Perfil");
    const [username, setUsername] = useState("agrotech_admin");
    const [telefone, setTelefone] = useState("");
    const [emailSelect, setEmailSelect] = useState("");
    const [nome, setNome] = useState("");
    const [urls, setUrls] = useState(["https://agrotech.com.br"]);
    const [avatarUrl, setAvatarUrl] = useState("");
    const fileRef = useRef(null);

    // Estados locais para edição temporária antes de salvar
    const [localTheme, setLocalTheme] = useState(globalTheme); 
    const [localSelectedFontSize, setLocalSelectedFontSize] = useState(globalSelectedFontSize); 

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [profileEditing, setProfileEditing] = useState(false);
    const [companyEditing, setCompanyEditing] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [companyAvatarUrl, setCompanyAvatarUrl] = useState("");

    // Sincronizar estados locais com o contexto global na montagem e quando o contexto muda
    useEffect(() => {
        setLocalTheme(globalTheme);
        setLocalSelectedFontSize(globalSelectedFontSize);
    }, [globalTheme, globalSelectedFontSize]);

    // Remover useEffects antigos de tema e font size
    // ... (o conteúdo dos useEffects para theme e selectedFontSize deve ser removido aqui)
    
    // popula os estados quando user chegar (dep array estável - primitivos)
    useEffect(() => {
        if (!loading && user) {
            setNome(user.nome ?? "");
            const firstName = user.nome ? String(user.nome).split(' ')[0] : null;
            setUsername(firstName || (user.email ? user.email.split('@')?.[0] : "") || "");
            setEmailSelect(user.email ?? "");
            setTelefone(user.telefone ?? "");
            setAvatarUrl(user.ftPerfil ?? ""); // Usar ftPerfil do backend
            // se backend não retorna urls ou companyName, mantenha defaults
        }

        if (!loading && !user) {
            // limpar campos se não autenticado
            setNome("");
            setUsername("");
            setEmailSelect("");
            setTelefone("");
            setAvatarUrl("");
            setUrls(["https://agrotech.com.br"]);
        }
    }, [
        loading,
        user?.id,
        user?.nome,
        user?.email,
        user?.telefone,
        user?.ftPerfil // Usar ftPerfil aqui
    ]);

    // handlers (mantidos)
    function handleAvatarChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setAvatarUrl(url);
    }
    function handleCompanyAvatarChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setCompanyAvatarUrl(url);
    }
    function addUrl() { setUrls((s) => [...s, ""]); }
    function updateUrl(index, value) { setUrls((s) => s.map((u, i) => (i === index ? value : u))); }
    function removeUrl(index) { setUrls((s) => s.filter((_, i) => i !== index)); }
    async function saveProfile() {
        console.log("saveProfile - Função chamada.");
        setProfileEditing(false);
        
        const dataToUpdate = {
            nome: nome,
            telefone: telefone,
            ftPerfil: avatarUrl, // Mapear avatarUrl para ftPerfil
        };

        console.log("saveProfile - Dados a enviar:", dataToUpdate);

        try {
            const res = await fetchWithAuth("/api/auth/me", { // Alterado para usar /api/auth/me
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });

            const result = await res.json();
            console.log("saveProfile - Resposta da API:", res.status, result);

            if (res.ok) {
                console.log("saveProfile - Chamando toast de sucesso.");
                toast({
                    title: "Sucesso",
                    description: result.mensagem || "Perfil atualizado com sucesso!",
                });
                await doRefresh(); 
            } else {
                console.log("saveProfile - Chamando toast de erro.");
                toast({
                    title: "Erro",
                    description: result.erro || "Falha ao atualizar perfil.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("saveProfile - Erro ao salvar perfil:", error);
            toast({
                title: "Erro",
                description: "Ocorreu um erro inesperado ao salvar o perfil.",
                variant: "destructive",
            });
        }
    }

    function cancelProfileEdit() { setProfileEditing(false); }
    function saveCompany() { setCompanyEditing(false); }
    function cancelCompanyEdit() { setCompanyEditing(false); }

    async function savePreferences() {
        console.log("savePreferences - Função chamada.");
        applyPreferences(localTheme, localSelectedFontSize); 
        console.log("savePreferences - Chamando toast de sucesso.");
        toast({
            title: "Sucesso",
            description: "Preferências salvas com sucesso!",
        });
    }

    // --- Render de carregamento / não autenticado (diagnóstico)
    if (!initialized || loading) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-2"><Transl>Configurações</Transl></h1>
                <p className="text-muted-foreground mb-6"><Transl>Carregando informações do usuário…</Transl></p>

                {/* debug útil temporário — remova em produção */}
                <pre className="whitespace-pre-wrap text-xs mt-4 bg-muted p-4 rounded">
                    {JSON.stringify({ loading, initialized, user: user ? { id: user.id, email: user.email, nome: user.nome } : null }, null, 2)}
                </pre>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-2"><Transl>Configurações</Transl></h1>
                <p className="text-muted-foreground mb-6"><Transl>Usuário não autenticado.</Transl></p>
            </div>
        );
    }

    const regexTelefone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

    function formatarTelefoneBR(tel) {
        if (!tel) return "";

        const digits = tel.replace(/\D/g, ""); // remove tudo que não é número

        // 11 dígitos → celular: (11) 98765-4321
        if (digits.length === 11) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        }

        // 10 dígitos → fixo: (11) 3876-4321
        if (digits.length === 10) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }

        return tel; // fallback: retorna como está
    }

    return (
        <div className="container mx-auto py-8">
            
            <div className="flex gap-6">
                {/* Sidebar */}
                <aside className="w-72 h-fit rounded-lg border border-border bg-background p-4">
                    <nav className="flex flex-col gap-1">
                        {[
                            { key: "Perfil", label: "Perfil", icon: User },
                            { key: "Aparencia", label: "Aparência", icon: ImageIcon },
                            // { key: "Notificacoes", label: "Notificações", icon: Bell }
                        ].map((it) => {
                            const Icon = it.icon;
                            const selected = active === it.key;
                            return (
                                <button key={it.key} onClick={() => setActive(it.key)} className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm ${selected ? "bg-accent text-accent-foreground" : "hover:bg-muted/50 text-foreground"}`}>
                                    <Icon className="h-4 w-4" />
                                    <span><Transl>{it.label}</Transl></span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content */}
                <section className="flex-1">
                    <div className="rounded-lg border border-border bg-background p-6">
                        {/* ---------- Perfil ---------- */}
                        {active === "Perfil" && (
                            <>
                                <h2 className="text-lg font-semibold mb-4"><Transl>Perfil</Transl></h2>
                                <div className="flex gap-6">
                                    <div className="flex-1 gap-6">
                                        <div className="grid gap-4">
                                            <div className="w-48">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-20 w-20">
                                                        {avatarUrl ? (
                                                            <AvatarImage src={buildImageUrl(avatarUrl)} alt="Avatar" />
                                                        ) : (
                                                            <AvatarFallback>
                                                                {username?.[0]?.toUpperCase() || "A"}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        {/* mostrar upload somente em modo edição */}
                                                        {profileEditing ? (
                                                            <>
                                                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                                                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                                                                    <Transl>Fazer upload</Transl>
                                                                </Button>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className={"pb-3 font-bold"} htmlFor="nome"><Transl>Nome completo</Transl></Label>
                                                {profileEditing ? (
                                                    <>
                                                        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            <Transl>Digite seu nome completo.</Transl>
                                                        </p>
                                                    </>

                                                ) : (<p className="text-sm text-foreground">{nome || "Nome não informado"}</p>)}

                                            </div>

                                            <div>
                                                <Label className="pb-3 font-bold" htmlFor="emailInput">
                                                    <Transl>Email</Transl>
                                                </Label>

                                                {profileEditing ? (
                                                    <>
                                                        <Input
                                                            id="emailInput"
                                                            type="email"
                                                            value={emailSelect}
                                                            onChange={(e) => setEmailSelect(e.target.value)}
                                                        />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            <Transl>Gerencie seus emails.</Transl>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-foreground">
                                                        {emailSelect || "Email não informado"}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className={"pb-3 font-bold"} htmlFor="telefone"><Transl>Telefone</Transl></Label>
                                                {profileEditing ? (
                                                    <><Input id="telefone" value={formatarTelefoneBR(telefone)} onChange={(e) => { const value = e.target.value; if (value === "" || regexTelefone.test(value)) { setTelefone(value); } }} />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            <Transl>Telefone de contato.</Transl>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-foreground">
                                                        {telefone ? formatarTelefoneBR(telefone) : "Telefone não informado"}
                                                    </p>
                                                )}

                                            </div>

                                            {/* <div>
                                                <Label className={"pb-3 font-bold"}>URLs</Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    <Transl>Adicione links do site da unidade, blog ou perfis sociais.</Transl>
                                                </p>
                                                <div className="flex flex-col gap-2">
                                                    {profileEditing ? (
                                                        urls.map((u, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <Input value={u} onChange={(e) => updateUrl(i, e.target.value)} className="flex-1" />
                                                                <Button variant="outline" size="sm" onClick={() => removeUrl(i)}>
                                                                    <Transl>Remover</Transl>
                                                                </Button>
                                                            </div>
                                                        ))
                                                    ) : (urls.map((u, i) => (<p key={i} className="text-sm text-foreground">{u}</p>)))}
                                                    {profileEditing ? (
                                                        <div>
                                                            <Button size="sm" onClick={addUrl} variant="secondary">
                                                                <Transl>Adicionar URL</Transl>
                                                            </Button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div> */}

                                            <div className="pt-3">
                                                {profileEditing ? (
                                                    <div className="flex gap-2">
                                                        <Button onClick={saveProfile}><Transl>Salvar</Transl></Button>
                                                        <Button variant="outline" onClick={cancelProfileEdit}><Transl>Cancelar</Transl></Button>
                                                    </div>
                                                ) : (<Button onClick={() => setProfileEditing(true)}><Transl>Editar perfil</Transl></Button>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ---------- Aparencia ---------- */}
                        {active === "Aparencia" && (
                            <>
                                <h2 className="text-lg font-semibold mb-4"><Transl>Aparência</Transl></h2>
                                <div className="grid gap-4">
                                    <div>
                                        <Label className="pb-3 font-bold"><Transl>Tamanho da fonte</Transl></Label>
                                        <Select onValueChange={(v) => setLocalSelectedFontSize(v)} value={localSelectedFontSize}>
                                            <SelectTrigger className="w-64">
                                                <SelectValue placeholder={<Transl>Selecionar tamanho</Transl>} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text-sm"><Transl>Pequeno</Transl></SelectItem>
                                                <SelectItem value="text-base"><Transl>Médio</Transl></SelectItem>
                                                <SelectItem value="text-lg"><Transl>Grande</Transl></SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            <Transl>Defina o tamanho da fonte de sua preferência.</Transl>
                                        </p>
                                    </div>

                                    {/* Language selector */}
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="language-select" className="hidden md:inline-block font-bold"><Transl>Idioma</Transl></Label>
                                        <Select value={lang} onValueChange={(v) => changeLang(v)}>
                                            <SelectTrigger id="language-select" className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languageOptions.map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="pb-3 font-bold"><Transl>Tema</Transl></Label>
                                        <div className="flex items-start gap-6 mt-3">
                                            <button onClick={() => setLocalTheme("light")} className={`rounded-lg border p-3 ${localTheme === "light" ? "border-primary" : "border-border"}`} aria-pressed={localTheme === "light"}>
                                                <div className="w-32 h-20 bg-white border rounded" />
                                                <div className="text-sm mt-2 text-center"><Transl>Claro</Transl></div>
                                            </button>

                                            <button onClick={() => setLocalTheme("dark")} className={`rounded-lg border p-3 ${localTheme === "dark" ? "border-primary" : "border-border"}`} aria-pressed={localTheme === "dark"}>
                                                <div className="w-32 h-20 bg-slate-900 border rounded" />
                                                <div className="text-sm mt-2 text-center"><Transl>Escuro</Transl></div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button onClick={savePreferences}><Transl>Salvar preferências</Transl></Button> 
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </section>
            </div>
        </div>
    );
}
