"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    User,
    CreditCard,
    Image as ImageIcon,
    Bell,
    Monitor,
    Info,
    Copy,
    ExternalLink,
    AlertTriangle,
} from "lucide-react";
import { useTranslation } from "@/components/useTranslation/useTranslation";

export default function SettingsPage() {
    const { lang, changeLang, translate } = useTranslation();
    const [active, setActive] = useState("Perfil"); // Perfil | Empresa | Integracoes | Aparencia | Notificacoes | Billing | Display
    const [username, setUsername] = useState("agrotech_admin");
    const [telefone, setTelefone] = useState("");
    const [emailSelect, setEmailSelect] = useState(""); // example selected email
    const [nome, setNome] = useState("");
    const [urls, setUrls] = useState(["https://agrotech.com.br"]);
    const [avatarUrl, setAvatarUrl] = useState("");
    const fileRef = useRef(null);

    // Aparencia
    const [font, setFont] = useState("");
    const [theme, setTheme] = useState("dark"); // light | dark

    // Notifications
    const [emailNotifications, setEmailNotifications] = useState(true);

    // Integrações (IoT)
    const [iotEnabled, setIotEnabled] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [iotThreshold, setIotThreshold] = useState(40); // percentagem padrão

    // Edit modes
    const [profileEditing, setProfileEditing] = useState(false);
    const [companyEditing, setCompanyEditing] = useState(false);

    // Empresa specific
    const [companyName, setCompanyName] = useState("");
    const [companyAvatarUrl, setCompanyAvatarUrl] = useState("");

    function handleAvatarChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setAvatarUrl(url);
        // Em app real: fazer upload para servidor e persistir URL
    }

    function handleCompanyAvatarChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setCompanyAvatarUrl(url);
    }

    function addUrl() {
        setUrls((s) => [...s, ""]);
    }

    function updateUrl(index, value) {
        setUrls((s) => s.map((u, i) => (i === index ? value : u)));
    }

    function removeUrl(index) {
        setUrls((s) => s.filter((_, i) => i !== index));
    }

    function saveProfile() {
        // chamar a API para salvar os dados
        setProfileEditing(false);
    }

    function cancelProfileEdit() {
        // reverter para valores salvos - atualmente apenas sai do modo edição
        setProfileEditing(false);
    }

    function saveCompany() {
        // Salvar dados da empresa
        setCompanyEditing(false);
    }

    function cancelCompanyEdit() {
        setCompanyEditing(false);
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-2">Configurações</h1>
            <p className="text-muted-foreground mb-6">
                Gerencie as configurações da sua empresa e personalize o comportamento do sistema.
            </p>

            <div className="flex gap-6">
                {/* Sidebar */}
                <aside className="w-72 h-fit rounded-lg border border-border bg-background p-4">
                    <nav className="flex flex-col gap-1">
                        {[
                            { key: "Perfil", label: "Perfil", icon: User },
                            { key: "Empresa", label: "Empresa", icon: CreditCard },
                            { key: "Integracoes", label: "Integrações", icon: Monitor },
                            { key: "Aparencia", label: "Aparência", icon: ImageIcon },
                            { key: "Notificacoes", label: "Notificações", icon: Bell }
                        ].map((it) => {
                            const Icon = it.icon;
                            const selected = active === it.key;
                            return (
                                <button
                                    key={it.key}
                                    onClick={() => setActive(it.key)}
                                    className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm ${selected
                                        ? "bg-accent text-accent-foreground"
                                        : "hover:bg-muted/50 text-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{it.label}</span>
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
                                <h2 className="text-lg font-semibold mb-4">Perfil</h2>

                                <div className="flex gap-6">


                                    <div className="flex-1 gap-6">

                                        <div className="grid gap-4">

                                            <div className="w-48">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-20 w-20">
                                                        {avatarUrl ? (
                                                            <AvatarImage src={avatarUrl} alt="Avatar" />
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
                                                                <input
                                                                    ref={fileRef}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={handleAvatarChange}
                                                                />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => fileRef.current?.click()}
                                                                >
                                                                    Fazer upload
                                                                </Button>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className={"pb-3"} htmlFor="username">Nome de usuário</Label>
                                                {profileEditing ? (
                                                    <>
                                                        <Input
                                                            id="username"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                        />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Nome público exibido no sistema.
                                                        </p>
                                                    </>

                                                ) : (
                                                    <p className="text-sm text-foreground">{username || "—"}</p>
                                                )}

                                            </div>

                                            <div>
                                                <Label className={"pb-3"} htmlFor="nome">Nome completo</Label>
                                                {profileEditing ? (
                                                    <>
                                                        <Input
                                                            id="nome"
                                                            value={nome}
                                                            onChange={(e) => setNome(e.target.value)}
                                                        />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Digite seu nome completo.
                                                        </p>
                                                    </>

                                                ) : (
                                                    <p className="text-sm text-foreground">{nome || "Nome não informado"}</p>
                                                )}

                                            </div>

                                            <div>
                                                <Label className={"pb-3"} htmlFor="emailSelect">Email</Label>
                                                {profileEditing ? (
                                                    <>
                                                        <Select
                                                            onValueChange={(v) => setEmailSelect(v)}
                                                            value={emailSelect}
                                                        >
                                                            <SelectTrigger id="emailSelect" className="w-full">
                                                                <SelectValue placeholder="Selecione um email" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="admin@agrotech.com">
                                                                    admin@agrotech.com
                                                                </SelectItem>
                                                                <SelectItem value="contact@agrotech.com">
                                                                    contato@agrotech.com
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Gerencie os emails verificados da empresa.
                                                        </p>
                                                    </>

                                                ) : (
                                                    <p className="text-sm text-foreground">{emailSelect || "Email não informado"}</p>
                                                )}

                                            </div>

                                            <div>
                                                <Label className={"pb-3"} htmlFor="telefone">Telefone</Label>
                                                {profileEditing ? (
                                                    <>
                                                        <Input
                                                            id="telefone"
                                                            value={telefone}
                                                            onChange={(e) => setTelefone(e.target.value)}
                                                        />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Telefone de contato.
                                                        </p>
                                                    </>

                                                ) : (
                                                    <p className="text-sm text-foreground">{telefone || "Telefone não informado"}</p>
                                                )}

                                            </div>

                                            <div>
                                                <Label className={"pb-3"}>URLs</Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Adicione links do site da unidade, blog ou perfis sociais.
                                                </p>

                                                <div className="flex flex-col gap-2">
                                                    {profileEditing ? (
                                                        urls.map((u, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <Input
                                                                    value={u}
                                                                    onChange={(e) => updateUrl(i, e.target.value)}
                                                                    className="flex-1"
                                                                />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeUrl(i)}
                                                                >
                                                                    Remover
                                                                </Button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        urls.map((u, i) => (
                                                            <p key={i} className="text-sm text-foreground">{u}</p>
                                                        ))
                                                    )}

                                                    {profileEditing ? (
                                                        <div>
                                                            <Button size="sm" onClick={addUrl} variant="secondary">
                                                                Adicionar URL
                                                            </Button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="pt-3">
                                                {profileEditing ? (
                                                    <div className="flex gap-2">
                                                        <Button onClick={saveProfile}>Salvar</Button>
                                                        <Button variant="outline" onClick={cancelProfileEdit}>Cancelar</Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={() => setProfileEditing(true)}>Editar perfil</Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ---------- Empresa ---------- */}
                        {active === "Empresa" && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Empresa</h2>
                                {/* Conteúdo principal */}
                                <div className="flex gap-6">


                                    <div className="flex-1 gap-6">

                                        <div className="grid gap-4">

                                            {/* Nome da empresa */}
                                            <div className="">
                                                <Label className={"pb-3"}>
                                                    Nome da empresa
                                                </Label>

                                                <div className="w-full max-w-md">
                                                    <div className="flex flex-col w-full items-start gap-2">
                                                        {companyEditing ? (
                                                            <>
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    Nome visível da Matriz ou da Unidade.
                                                                </p>
                                                                <Input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="flex-1" />
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Máximo de 32 caracteres.
                                                                </p>
                                                                {/* <Button size="sm" onClick={() => { }}>Salvar</Button> */}
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-foreground">{companyName || "Nome não informado"}</p>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                            <Separator className="my-4" />

                                            {/* URL da unidade */}
                                            <div>
                                                <Label className={"pb-3"}>URLs</Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Adicione links do site da unidade, blog ou perfis sociais.
                                                </p>

                                                <div className="flex flex-col gap-2">
                                                    {companyEditing ? (
                                                        urls.map((u, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <Input
                                                                    value={u}
                                                                    onChange={(e) => updateUrl(i, e.target.value)}
                                                                    className="flex-1"
                                                                />
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeUrl(i)}
                                                                >
                                                                    Remover
                                                                </Button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        urls.map((u, i) => (
                                                            <p key={i} className="text-sm text-foreground">{u}</p>
                                                        ))
                                                    )}

                                                    {companyEditing ? (
                                                        <div>
                                                            <Button size="sm" onClick={addUrl} variant="secondary">
                                                                Adicionar URL
                                                            </Button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <Separator className="my-4" />

                                            {/* Avatar da empresa */}
                                            <div className="">
                                                <Label className={"pb-3"}>
                                                    Avatar da empresa
                                                </Label>

                                                <div className="flex flex-wrap items-center gap-4">
                                                    <Avatar className="h-16 w-16 cursor-pointer border-2 border-muted hover:border-primary">
                                                        {companyAvatarUrl ? (
                                                            <>
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    Avatar opcional para identificar a Matriz ou a Unidade.
                                                                </p>
                                                                <AvatarImage src={companyAvatarUrl} alt="Team Avatar" />
                                                            </>

                                                        ) : (
                                                            <AvatarFallback />
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        {companyEditing ? (
                                                            <>
                                                                <p className="mb-2 text-sm text-muted-foreground">
                                                                    Recomendado para identificação visual.
                                                                </p>
                                                                <input type="file" className="hidden" onChange={handleCompanyAvatarChange} ref={fileRef} />
                                                                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                                                                    Mudar avatar
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <p className="mb-2 text-sm text-muted-foreground">Recomendado para identificação visual.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />

                                            {/* Identificador da Unidade */}
                                            <div className="">
                                                <Label className={"pb-3"}>ID da Unidade</Label>

                                                <div className="w-full max-w-md">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {companyEditing ? (
                                                            <>
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    Identificador usado em integrações e APIs.
                                                                </p>
                                                                <Input
                                                                    type="text"
                                                                    value={''}
                                                                    readOnly
                                                                    className="flex-grow font-mono text-sm"
                                                                />
                                                                <Button variant="outline" size="icon" aria-label="Copiar ID da Unidade">
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Usado ao integrar outros sistemas com a Matriz.
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-foreground">(id-da-unidade-1234)</p>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                            <Separator className="my-4" />

                                            {/* Ferramentas e transferências (ex.: Transferir Matriz) */}
                                            <div className="">
                                                <Label className={"pb-3"}>
                                                    Transferência
                                                </Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Transferir dados ou responsabilidades entre unidades.
                                                </p>
                                                <div className="flex max-w-md items-center justify-end">
                                                    <p className="mr-4 text-sm text-muted-foreground">
                                                        Saiba mais sobre transferência de unidades
                                                        <a
                                                            href={''}
                                                            className="text-primary underline"
                                                        >
                                                            Documentação
                                                        </a>
                                                    </p>
                                                    <Button size="sm" variant="secondary">
                                                        Transferir
                                                    </Button>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />

                                            {/* Apagar empresa */}
                                            <div>
                                                <Label className={"pb-3"}>
                                                    Deletar empresa
                                                </Label>
                                                <Alert variant="destructive" className="mb-4 max-w-md">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertTitle>Aviso</AlertTitle>
                                                    <AlertDescription>
                                                        <p>
                                                            Excluir permanentemente a empresa (Matriz) e todos os dados. A ação não é reversível — <span className="font-medium underline">proceda com cuidado.</span>
                                                        </p>

                                                    </AlertDescription>
                                                </Alert>
                                                <Button variant="destructive">Deletar empresa</Button>
                                            </div>

                                            <div className="pt-3">
                                                {companyEditing ? (
                                                    <div className="flex gap-2">
                                                        <Button onClick={saveCompany}>Salvar</Button>
                                                        <Button variant="outline" onClick={cancelCompanyEdit}>Cancelar</Button>
                                                    </div>
                                                ) : (
                                                    <Button onClick={() => setCompanyEditing(true)}>Editar informações</Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ---------- INTEGRAÇÕES (IoT) ---------- */}
                        {active === "Integracoes" && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Integrações & IoT</h2>

                                <div className="grid gap-4">
                                    <div>
                                        <Label className={"pb-3"}>Habilitar integração IoT</Label>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Conectar dispositivos de campo (ex.: potenciômetro que simula nível de agrotóxico).
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <Switch id="iot-enabled" checked={iotEnabled} onCheckedChange={(v) => setIotEnabled(!!v)} />
                                            <Label htmlFor="iot-enabled" className="text-sm">Ativar</Label>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className={"pb-3"} htmlFor="deviceId">ID do dispositivo</Label>
                                        <Input id="deviceId" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} />
                                        <p className="text-sm text-muted-foreground mt-1">Identificador do sensor/placa conectado.</p>
                                    </div>

                                    <div>
                                        <Label className={"pb-3"} htmlFor="iotThreshold">Limite de alerta (percent)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input id="iotThreshold" type="number" value={iotThreshold} onChange={(e) => setIotThreshold(Number(e.target.value))} className="w-32" />
                                            <Button size="sm">Salvar</Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">Se o valor lido for maior que esse percentual, o lote será marcado como impróprio automaticamente.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-md font-semibold mb-2">Log de leitura (simulado)</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Aqui exibiremos um preview das leituras recebidas do dispositivo (simulação) e ações tomadas pelo sistema.</p>
                                        <div className="flex gap-2 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
                                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <span>Sem leituras recentes.</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ---------- BILLING ---------- */}
                        {active === "Billing" && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Faturamento</h2>
                                <div className="grid gap-4">
                                    <div>
                                        <Label>Plano</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-md border p-4">
                                                <div className="font-semibold">Starter</div>
                                                <div className="text-sm text-muted-foreground">Grátis</div>
                                            </div>
                                            <div className="rounded-md border p-4 bg-muted/50">
                                                <div className="font-semibold">Corporativo</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Contatar vendas
                                                </div>
                                            </div>
                                            <div className="ml-auto">
                                                <Button>Gerenciar faturamento</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ---------- Aparencia ---------- */}
                        {/* ---------- Aparencia ---------- */}
{active === "Aparencia" && (
  <>
    <h2 className="text-lg font-semibold mb-4">{translate("Aparência")}</h2>

    <div className="grid gap-4">
      <div>
        <Label className="pb-3">{translate("Tamanho da fonte")}</Label>
        <Select onValueChange={(v) => setFont(v)} value={font}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder={translate("Selecionar tamanho")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inter">Inter</SelectItem>
            <SelectItem value="system">System UI</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {translate("Defina o tamanho da fonte de sua preferência.")}
        </p>
      </div>

      <div>
        <Label className="pb-3">{translate("Idioma")}</Label>
        <Select value={lang} onValueChange={(v) => changeLang(v)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder={translate("Selecionar idioma")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">Português (BR)</SelectItem>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="es-ES">Español (ES)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {translate("Defina o idioma da interface.")}
        </p>
      </div>

      <div>
        <Label className="pb-3">{translate("Tema")}</Label>
        <div className="flex items-start gap-6 mt-3">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-lg border p-3 ${
              theme === "light" ? "border-primary" : "border-border"
            }`}
            aria-pressed={theme === "light"}
          >
            <div className="w-32 h-20 bg-white border rounded" />
            <div className="text-sm mt-2 text-center">{translate("Claro")}</div>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`rounded-lg border p-3 ${
              theme === "dark" ? "border-primary" : "border-border"
            }`}
            aria-pressed={theme === "dark"}
          >
            <div className="w-32 h-20 bg-slate-900 border rounded" />
            <div className="text-sm mt-2 text-center">{translate("Escuro")}</div>
          </button>
        </div>
      </div>

      <div className="pt-2">
        <Button>{translate("Salvar preferências")}</Button>
      </div>
    </div>
  </>
)}


                        {/* ---------- NOTIFICATIONS ---------- */}
                        {active === "Notificacoes" && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Notificações</h2>

                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Notificações por email</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receba resumos e alertas por email (ex.: alertas de qualidade de lote).
                                            </p>
                                        </div>
                                        <Switch
                                            checked={emailNotifications}
                                            onCheckedChange={(v) => setEmailNotifications(!!v)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Push móvel</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Configure notificações push em dispositivos de operação.
                                        </p>
                                        <div className="mt-2">
                                            <Button variant="outline">Gerenciar dispositivos</Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ---------- DISPLAY ---------- */}
                        {active === "Display" && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">Exibição</h2>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Ajuste a densidade da interface e opções de exibição.
                                    </p>
                                    <div className="mt-4 grid gap-3">
                                        <div>
                                            <Label>Densidade da interface</Label>
                                            <Select>
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder="Padrão" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="compact">Compacta</SelectItem>
                                                    <SelectItem value="default">Padrão</SelectItem>
                                                    <SelectItem value="comfortable">Confortável</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Mostrar métricas avançadas</Label>
                                            <div className="mt-2">
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
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
