"use client"

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

export default function Matriz() {
    usePerfilProtegido("GERENTE_MATRIZ");

    const { user, loading, initialized } = useAuth();

    const [profileEditing, setProfileEditing] = useState(false);
    const [companyEditing, setCompanyEditing] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [companyAvatarUrl, setCompanyAvatarUrl] = useState("");
    const [urls, setUrls] = useState(["https://agrotech.com.br"]);

    function addUrl() { setUrls((s) => [...s, ""]); }
    function updateUrl(index, value) { setUrls((s) => s.map((u, i) => (i === index ? value : u))); }
    function removeUrl(index) { setUrls((s) => s.filter((_, i) => i !== index)); }
    function saveProfile() { setProfileEditing(false); }
    function cancelProfileEdit() { setProfileEditing(false); }
    function saveCompany() { setCompanyEditing(false); }
    function cancelCompanyEdit() { setCompanyEditing(false); }
    return (

        <>
            <main className="container mx-auto py-8">
                <h2 className="text-lg font-semibold mb-4"><Transl>Empresa</Transl></h2>
                {/* Conteúdo principal */}
                <div className="flex gap-6">
                    <div className="flex-1 gap-6">
                        <div className="grid gap-4">

                            {/* Nome da empresa */}
                            <div className="">
                                <Label className={"pb-3 font-bold"}><Transl>Nome da empresa</Transl></Label>

                                <div className="w-full max-w-md">
                                    <div className="flex flex-col w-full items-start gap-2">
                                        {companyEditing ? (
                                            <><p className="text-sm text-muted-foreground mb-2">
                                                <Transl>Nome visível da Matriz ou da Unidade.</Transl>
                                            </p>
                                                <Input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="flex-1" />
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    <Transl>Máximo de 32 caracteres.</Transl>
                                                </p>
                                            </>
                                        ) : (<p className="text-sm text-foreground">{companyName || "Nome não informado"}</p>)}
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            {/* URL da unidade */}
                            <div>
                                <Label className={"pb-3 font-bold"}>URLs</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    <Transl>Adicione links do site da unidade, blog ou perfis sociais.</Transl>
                                </p>
                                <div className="flex flex-col gap-2">
                                    {companyEditing ? (
                                        urls.map((u, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <Input value={u} onChange={(e) => updateUrl(i, e.target.value)} className="flex-1" />
                                                <Button variant="outline" size="sm" onClick={() => removeUrl(i)}>
                                                    <Transl>Remover</Transl>
                                                </Button>
                                            </div>
                                        ))
                                    ) : (urls.map((u, i) => (<p key={i} className="text-sm text-foreground">{u}</p>)))}

                                    {companyEditing ? (
                                        <div>
                                            <Button size="sm" onClick={addUrl} variant="secondary">
                                                <Transl>Adicionar URL</Transl>
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <Separator className="my-4" />

                            {/* Avatar da empresa */}
                            <div className="">
                                <Label className={"pb-3 font-bold"}>
                                    <Transl>Avatar da empresa</Transl>
                                </Label>

                                <div className="flex flex-wrap items-center gap-4">
                                    <Avatar className="h-16 w-16 cursor-pointer border-2 border-muted hover:border-primary">
                                        {companyAvatarUrl ? (
                                            <>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    <Transl>Avatar opcional para identificar a Matriz ou a Unidade.</Transl>
                                                </p>
                                                <AvatarImage src={companyAvatarUrl} alt={<Transl>Team Avatar</Transl>} />
                                            </>
                                        ) : (<AvatarFallback />)}
                                    </Avatar>
                                    <div>
                                        {companyEditing ? (
                                            <>
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <Transl>Recomendado para identificação visual.</Transl>
                                                </p>
                                                <input type="file" className="hidden" onChange={handleCompanyAvatarChange} ref={fileRef} />
                                                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                                                    <Transl>Mudar avatar</Transl>
                                                </Button>
                                            </>
                                        ) : (<p className="mb-2 text-sm text-muted-foreground"><Transl>Recomendado para identificação visual.</Transl></p>)}
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />

                            {/* Identificador da Unidade */}
                            <div className="">
                                <Label className={"pb-3 font-bold"}><Transl>ID da Unidade</Transl></Label>

                                <div className="w-full max-w-md">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {companyEditing ? (
                                            <>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    <Transl>Identificador usado em integrações e APIs.</Transl>
                                                </p>
                                                <Input type="text" value={''} readOnly className="flex-grow font-mono text-sm" />
                                                <Button variant="outline" size="icon" aria-label="Copiar ID da Unidade">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    <Transl>Usado ao integrar outros sistemas com a Matriz.</Transl>
                                                </p>
                                            </>
                                        ) : (<p className="text-sm text-foreground">(id-da-unidade-1234)</p>)}
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />

                            {/* Ferramentas e transferências (ex.: Transferir Matriz) */}
                            <div className="">
                                <Label className={"pb-3 font-bold"}>
                                    <Transl>Transferência</Transl>
                                </Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    <Transl>Transferir dados ou responsabilidades entre unidades.</Transl>
                                </p>
                                <div className="flex max-w-md items-center justify-end">
                                    <p className="mr-4 text-sm text-muted-foreground">
                                        <Transl>Saiba mais sobre transferência de unidades</Transl>
                                        <a href={''} className="text-primary underline">
                                            <Transl>Documentação</Transl>
                                        </a>
                                    </p>
                                    <Button size="sm" variant="secondary">
                                        <Transl>Transferir</Transl>
                                    </Button>
                                </div>
                            </div>
                            <Separator className="my-4" />

                            {/* Apagar empresa */}
                            <div>
                                <Label className={"pb-3 font-bold"}>
                                    <Transl>Deletar empresa</Transl>
                                </Label>
                                <Alert variant="destructive" className="mb-4 max-w-md">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle><Transl>Aviso</Transl></AlertTitle>
                                    <AlertDescription>
                                        <p>
                                            <Transl>Excluir permanentemente a empresa (Matriz) e todos os dados. A ação não é reversível — </Transl><span className="font-medium underline"><Transl>proceda com cuidado.</Transl></span>
                                        </p>
                                    </AlertDescription>
                                </Alert>
                                <Button variant="destructive"><Transl>Deletar empresa</Transl></Button>
                            </div>

                            <div className="pt-3">
                                {companyEditing ? (
                                    <div className="flex gap-2">
                                        <Button onClick={saveCompany}><Transl>Salvar</Transl></Button>
                                        <Button variant="outline" onClick={cancelCompanyEdit}><Transl>Cancelar</Transl></Button>
                                    </div>
                                ) : (<Button onClick={() => setCompanyEditing(true)}><Transl>Editar informações</Transl></Button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}