"use client"
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon, AlertTriangle, Phone, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';
import { usePerfilProtegido } from "@/hooks/usePerfilProtegido";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@/components/ui/use-toast';
import { API_URL } from '@/lib/api';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Matriz() {
    usePerfilProtegido("GERENTE_MATRIZ");

    const { user, loading, initialized, fetchWithAuth } = useAuth();
    const { toast } = useToast();
    const [profileEditing, setProfileEditing] = useState(false);
    const [companyEditing, setCompanyEditing] = useState(false);

    // Estados permanentes (salvos no servidor)
    const [companyName, setCompanyName] = useState("");
    const [companyAvatarUrl, setCompanyAvatarUrl] = useState("");
    const [urls, setUrls] = useState(["https://agrotech.com.br"]);
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [endereco, setEndereco] = useState("");
    const [descricaoCurta, setDescricaoCurta] = useState("");
    const [unidadeId, setUnidadeId] = useState(null);
    const [cep, setCep] = useState("");

    // Estados temporários (apenas durante edição)
    const [editCompanyName, setEditCompanyName] = useState("");
    const [editCompanyAvatarUrl, setEditCompanyAvatarUrl] = useState("");
    const [editTelefone, setEditTelefone] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editCnpj, setEditCnpj] = useState("");
    const [editCidade, setEditCidade] = useState("");
    const [editEstado, setEditEstado] = useState("");
    const [editEndereco, setEditEndereco] = useState("");
    const [editDescricaoCurta, setEditDescricaoCurta] = useState("");
    const [editCep, setEditCep] = useState("");
    const [loadingUnidade, setLoadingUnidade] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const fileInputRef = useRef(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); 
    const [isConfirmTypingOpen, setIsConfirmTypingOpen] = useState(false); 
    const [confirmInput, setConfirmInput] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // Lista de estados brasileiros
    const estadosBrasil = [
        { sigla: "AC", nome: "Acre" },{ sigla: "AL", nome: "Alagoas" },
        { sigla: "AP", nome: "Amapá" },{ sigla: "AM", nome: "Amazonas" },
        { sigla: "BA", nome: "Bahia" },{ sigla: "CE", nome: "Ceará" },
        { sigla: "DF", nome: "Distrito Federal" },{ sigla: "ES", nome: "Espírito Santo" },
        { sigla: "GO", nome: "Goiás" },{ sigla: "MA", nome: "Maranhão" },
        { sigla: "MT", nome: "Mato Grosso" },{ sigla: "MS", nome: "Mato Grosso do Sul" },
        { sigla: "MG", nome: "Minas Gerais" },{ sigla: "PA", nome: "Pará" },
        { sigla: "PB", nome: "Paraíba" },{ sigla: "PR", nome: "Paraná" },
        { sigla: "PE", nome: "Pernambuco" },{ sigla: "PI", nome: "Piauí" },
        { sigla: "RJ", nome: "Rio de Janeiro" },{ sigla: "RN", nome: "Rio Grande do Norte" },
        { sigla: "RS", nome: "Rio Grande do Sul" },{ sigla: "RO", nome: "Rondônia" },
        { sigla: "RR", nome: "Roraima" },{ sigla: "SC", nome: "Santa Catarina" },
        { sigla: "SP", nome: "São Paulo" },{ sigla: "SE", nome: "Sergipe" },
        { sigla: "TO", nome: "Tocantins" }
    ];

    function addUrl() { setUrls((s) => [...s, ""]); }
    function updateUrl(index, value) { setUrls((s) => s.map((u, i) => (i === index ? value : u))); }
    function removeUrl(index) { setUrls((s) => s.filter((_, i) => i !== index)); }
    function saveProfile() { setProfileEditing(false); }
    function cancelProfileEdit() { setProfileEditing(false); }

    function startEditing() {
        // Copia estados permanentes para estados temporários
        setEditCompanyName(companyName);
        setEditCompanyAvatarUrl(companyAvatarUrl);
        setEditTelefone(formatPhone(telefone));
        setEditEmail(email);
        setEditCnpj(cnpj);
        setEditCidade(cidade);
        setEditEstado(estado);
        setEditEndereco(endereco);
        setEditDescricaoCurta(descricaoCurta);
        setEditCep(cep);
        setCompanyEditing(true);
    }

    function cancelCompanyEdit() {setCompanyEditing(false);}

    const isGerenteMatriz = Array.isArray(user?.roles) && user.roles.some(r => String(r).toUpperCase() === 'GERENTE_MATRIZ');

    useEffect(() => {
        async function loadMatriz() {
            try {
                setLoadingUnidade(true);
                console.log('📥 API_URL:', API_URL);
                // prefer user unidade if available
                if (user?.unidadeId) {
                    const res = await fetchWithAuth(`${API_URL}unidades/${user.unidadeId}`);
                    if (res.ok) {
                        const data = await res.json().catch(() => ({}));
                        const unidade = data.unidade ?? data;
                        if (unidade) {
                            setUnidadeId(unidade.id);
                            setCompanyName(unidade.nome || "");
                            // Construir URL completa da foto
                            const fotoUrl = unidade.imagemUrl ? buildImageUrl(unidade.imagemUrl) : "";
                            console.log('📸 imagemUrl do servidor:', unidade.imagemUrl);
                            console.log('📸 fotoUrl construída:', fotoUrl);
                            setCompanyAvatarUrl(fotoUrl);
                            setTelefone(unidade.telefone || "");
                            setEmail(unidade.email || "");
                            setCnpj(formatCNPJ(unidade.cnpj || ""));
                            setEndereco(unidade.endereco || "");
                            setCidade(unidade.cidade || "");
                            setEstado(unidade.estado || "");
                            setDescricaoCurta(unidade.descricaoCurta || "");
                            setCep(formatCEP(unidade.cep || ""));
                        }
                    }
                } else {
                    const res = await fetchWithAuth(`${API_URL}unidades/matrizes`);
                    if (res.ok) {
                        const data = await res.json().catch(() => ({}));
                        const unidades = data.unidades || [];
                        if (Array.isArray(unidades) && unidades.length > 0) {
                            const unidade = unidades[0];
                            setUnidadeId(unidade.id);
                            setCompanyName(unidade.nome || "");
                            // Construir URL completa da foto
                            const fotoUrl = unidade.imagemUrl ? buildImageUrl(unidade.imagemUrl) : "";
                            console.log('📸 imagemUrl do servidor:', unidade.imagemUrl);
                            console.log('📸 fotoUrl construída:', fotoUrl);
                            setCompanyAvatarUrl(fotoUrl);
                            setTelefone(unidade.telefone || "");
                            setEmail(unidade.email || "");
                            setCnpj(formatCNPJ(unidade.cnpj || ""));
                            setEndereco(unidade.endereco || "");
                            setCidade(unidade.cidade || "");
                            setEstado(unidade.estado || "");
                            setDescricaoCurta(unidade.descricaoCurta || "");
                            setCep(formatCEP(unidade.cep || ""));
                        }
                    }
                }
            } catch (err) {console.error('Erro ao carregar matriz:', err);}
            finally {setLoadingUnidade(false);}
        }

        if (fetchWithAuth && initialized) loadMatriz();
    }, [fetchWithAuth, user, initialized]);

    async function saveCompany() {
        if (!unidadeId) return;
        const payload = {
            nome: editCompanyName,
            imagemUrl: editCompanyAvatarUrl,
            telefone: onlyDigits(editTelefone),
            email: editEmail,
            cnpj: onlyDigits(editCnpj),
            endereco: editEndereco,
            cidade: editCidade,
            estado: editEstado,
            cep: onlyDigits(editCep),
            descricaoCurta: editDescricaoCurta,
        };

        try {
            const res = await fetchWithAuth(`${API_URL}unidades/${unidadeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('Erro ao salvar unidade:', err);
                try { toast({ title: 'Erro', description: err?.erro || 'Falha ao salvar unidade.', variant: 'destructive' }); } catch (e) {}
                return;
            }

            const result = await res.json().catch(() => ({}));
            const unidade = result.unidade ?? null;
            if (unidade) {
                // Atualiza os estados permanentes com os dados retornados do servidor
                setCompanyName(unidade.nome || editCompanyName);
                setCompanyAvatarUrl(buildImageUrl(unidade.imagemUrl) || editCompanyAvatarUrl);
                setTelefone(formatPhone(unidade.telefone || editTelefone));
                setEmail(unidade.email || editEmail);
                setCnpj(formatCNPJ(unidade.cnpj || editCnpj));
                setEndereco(unidade.endereco || editEndereco);
                setCidade(unidade.cidade || editCidade);
                setEstado(unidade.estado || editEstado);
                setCep(formatCEP(unidade.cep || editCep));
                setDescricaoCurta(unidade.descricaoCurta || editDescricaoCurta);
            }

            setCompanyEditing(false);
            try { toast({ title: 'Sucesso', description: result.mensagem || 'Unidade atualizada.' }); } catch (e) {}
        } catch (err) {
            console.error('Erro ao salvar unidade:', err);
            try { toast({ title: 'Erro', description: 'Erro ao salvar unidade.', variant: 'destructive' }); } catch (e) {}
        }
    }

    // helpers: strip digits and formatting
    function onlyDigits(value) {return String(value || '').replace(/\D/g, '');}

    function formatCEP(value) {
        const d = onlyDigits(value).slice(0, 8);
        if (!d) return '';
        if (d.length <= 5) return d;
        return d.slice(0, 5) + '-' + d.slice(5);
    }

    function formatPhone(value) {
        const d = onlyDigits(value).slice(0, 11);
        if (!d) return '';
        if (d.length <= 2) return `(${d}`;
        if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
        if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        // 11 digits
        return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }

    function formatCNPJ(value) {
        const d = onlyDigits(value).slice(0, 14);
        if (!d) return '';
        // 00.000.000/0000-00
        const part1 = d.slice(0, 2);
        const part2 = d.slice(2, 5);
        const part3 = d.slice(5, 8);
        const part4 = d.slice(8, 12);
        const part5 = d.slice(12, 14);
        let out = part1;
        if (part2) out += '.' + part2;
        if (part3) out += '.' + part3;
        if (part4) out += '/' + part4;
        if (part5) out += '-' + part5;
        return out;
    }

    // Constrói URL pública para imagens retornadas pela API.
    // Recebe o valor salvo em `imagemUrl` (ex: "uploads/file.svg" ou "file.svg")
    // e retorna a URL completa usando `API_URL` (que já contém "/api/").
    function buildImageUrl(imagemUrl) {
        if (!imagemUrl) return "";
        // remove barras iniciais e qualquer prefixo 'uploads/' caso já exista,
        // em seguida sempre requisita por `/api/uploads/<filename>`
        const cleaned = String(imagemUrl).replace(/^\/+/, "").replace(/^uploads\/*/, "");
        return `${API_URL}uploads/${cleaned}`;
    }

    function getInitials(name) {
        if (!name || typeof name !== 'string') return '';
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return '';
        const first = parts[0];
        if (parts.length === 1) {return first.slice(0, 2).toUpperCase();}
        const second = parts[1];
        return (String(first[0] || '') + String(second[0] || '')).toUpperCase();
    }

    // CEP, CNPJ and phone state handlers to maintain formatted display
    function handleCnpjChange(e) {
        const value = e.target.value;
        // permite apenas dígitos e limita a 14 caracteres
        const digits = value.replace(/\D/g, '').slice(0, 14);
        setEditCnpj(formatCNPJ(digits));
    }

    function handlePhoneChange(e) {
        const value = e.target.value;
        // permite apenas dígitos e limita a 11 caracteres
        const digits = value.replace(/\D/g, '').slice(0, 11);
        setEditTelefone(formatPhone(digits));
    }

    async function handleCepChange(e) {
        const value = e.target.value;
        const digits = value.replace(/\D/g, '').slice(0, 8);
        setEditCep(formatCEP(digits));

        // se atingiu 8 dígitos, buscar automaticamente na API de CEP
        if (digits.length === 8) {
            setLoadingCep(true);
            try {
                const res = await fetchWithAuth(`${API_URL}unidades/cep?cep=${digits}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.sucesso && data.data) {
                        // ViaCEP retorna logradouro, bairro, localidade (cidade), uf (estado)
                        // Preenche apenas os estados TEMPORÁRIOS
                        setEditEndereco(data.data.logradouro || data.data.bairro || "");
                        setEditCidade(data.data.localidade || "");
                        setEditEstado(data.data.uf || "");
                    }
                }
            } catch (err) {console.error('Erro ao buscar CEP:', err);}
            finally {setLoadingCep(false);}
        }
    }

    async function handleFotoUnidadeChange(e) {
        const file = e.target.files?.[0];
        if (!file || !unidadeId) return;

        setUploadingFoto(true);
        try {
            const formData = new FormData();
            formData.append('foto', file);

            const url = `${API_URL}unidades/${unidadeId}/foto`;
            console.log('📸 Upload para:', url);
            console.log('📦 Arquivo:', file.name);

            const res = await fetchWithAuth(url, {method: 'POST',body: formData,});

            console.log('📡 Status resposta:', res.status);

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('❌ Erro ao fazer upload de foto:', err);
                return;
            }

            const result = await res.json().catch(() => ({}));
            console.log('✅ Resultado:', result);
            
            if (result.sucesso && result.unidade?.imagemUrl) {
                // Construir URL completa da foto
                const fotoUrl = buildImageUrl(result.unidade.imagemUrl);
                // Atualiza a foto PERMANENTEMENTE no estado
                setCompanyAvatarUrl(fotoUrl);
                setEditCompanyAvatarUrl(fotoUrl);
            }
        } catch (err) {console.error('❌ Erro ao fazer upload de foto:', err);}
        finally {
            setUploadingFoto(false);
            // Limpa o input
            if (fileInputRef.current) {fileInputRef.current.value = '';}
        }
    }

    async function handleRemoverFotoUnidade() {
        if (!unidadeId) return;

        setUploadingFoto(true);
        try {
            const res = await fetchWithAuth(`${API_URL}unidades/${unidadeId}/foto`, {method: 'DELETE',});

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('Erro ao remover foto:', err);
                return;
            }

            const result = await res.json().catch(() => ({}));
            if (result.sucesso) {
                // Remove a foto PERMANENTEMENTE do estado
                setCompanyAvatarUrl('');
                setEditCompanyAvatarUrl('');
            }
        } catch (err) {console.error('Erro ao remover foto:', err);}
        finally {setUploadingFoto(false);}
    }

    // Deleção em duas etapas
    function handleDeleteClick() {
        // abre o primeiro modal de confirmação
        setDeleteError('');
        setIsDeleteConfirmOpen(true);
    }

    function handleCancelDelete() {
        setIsDeleteConfirmOpen(false);
        setIsConfirmTypingOpen(false);
        setConfirmInput('');
        setDeleteError('');
    }

    function handleConfirmFirst() {
        // Fecha o modal simples e abre o modal de digitar a palavra
        setIsDeleteConfirmOpen(false);
        setConfirmInput('');
        setDeleteError('');
        setIsConfirmTypingOpen(true);
    }

    async function handleFinalDelete() {
        setDeleteError('');
        if (confirmInput !== 'Excluir') {
            setDeleteError("A palavra não confere. A exclusão foi cancelada.");
            return;
        }
        if (!unidadeId) {
            setDeleteError('ID da unidade não encontrado.');
            return;
        }

        try {
            setDeleting(true);
            const res = await fetchWithAuth(`${API_URL}unidades/${unidadeId}`, { method: 'DELETE' });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || !json.sucesso) {
                setDeleteError(json.erro || 'Não foi possível excluir a matriz.');
                setIsConfirmTypingOpen(false);
                return;
            }

            // sucesso: redirecionar ou limpar estado
            // aqui redirecionamos para a raiz do app
            window.location.href = '/';
        } catch (err) {
            console.error('Erro ao excluir unidade:', err);
            setDeleteError('Erro ao excluir a matriz.');
        }
        finally {setDeleting(false);}
    }

     const { lang, changeLang } = useTranslation();
        const languageOptions = [
            { value: 'pt-BR', label: 'Português (BR)' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' }
        ];
        const isPreferencesDirty = localTheme !== globalTheme || localSelectedFontSize !== globalSelectedFontSize || localLang !== lang;
        useEffect(() => {
            setLocalTheme(globalTheme);
            setLocalSelectedFontSize(globalSelectedFontSize);
            setLocalLang(lang);
        }, [globalTheme, globalSelectedFontSize, lang]);
    return (
        <>
            <main className="min-h-screen px-18 py-10 bg-surface-50">
                <h2 className="text-lg font-semibold mb-4"><Transl>Empresa</Transl></h2>
                {/* Conteúdo principal */}
                <div className="flex gap-6">
                    <div className="flex-1 gap-6">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-8">
                                {/* Nome da empresa */}
                                <div className="flex flex-row justify-between pr-8 gap-4">
                                    {/* Avatar */}
                                    <div className="flex flex-col">
                                        <Label className={"pb-3 font-bold"}><Transl>Avatar da empresa</Transl></Label>
                                        <div className="w-full max-w-md">
                                            <div className="flex flex-col w-full items-start gap-2">
                                                <Avatar className="h-16 w-16 cursor-pointer border-2 border-muted">
                                                    {companyAvatarUrl ? (
                                                        <AvatarImage src={companyAvatarUrl} alt="Avatar" />
                                                    ) : (<AvatarFallback>{getInitials(companyName)}</AvatarFallback>)}
                                                </Avatar>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoUnidadeChange} className="hidden"/>
                                                {companyEditing && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingFoto}>
                                                            <ImageIcon className="w-4 h-4 mr-1" />
                                                            {uploadingFoto ? <Transl>Upload...</Transl> : <Transl>Upload</Transl>}
                                                        </Button>
                                                        {companyAvatarUrl && (
                                                            <Button size="sm" variant="destructive" onClick={handleRemoverFotoUnidade} disabled={uploadingFoto}>
                                                                <Transl>Remover</Transl>
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                                {companyEditing && (<p className="text-xs text-muted-foreground mt-1"><Transl>Clique para enviar uma nova imagem</Transl></p>)}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Nome */}
                                    <div className="flex flex-col">
                                        <Label className={"pb-3 font-bold"}><Transl>Nome</Transl></Label>
                                        <div className="w-full max-w-md">
                                            <div className="flex flex-col w-full items-start gap-2">
                                                {companyEditing ? (
                                                    <>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            <Transl>Nome visível da Matriz ou da Unidade.</Transl>
                                                        </p>
                                                        <Input type="text" value={editCompanyName} onChange={(e) => setEditCompanyName(e.target.value)} className="w-full" />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            <Transl>Máximo de 100 caracteres.</Transl>
                                                        </p>
                                                    </>
                                                ) : (<p className="text-sm text-foreground">{companyName || "Nome não informado"}</p>)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CNPJ */}
                                    <div className="flex flex-col">
                                        <Label className={"pb-3 font-bold"}><Transl>CNPJ</Transl></Label>
                                        <div className="w-full max-w-md">
                                            <div className="flex flex-col w-full items-start gap-2">
                                                {companyEditing ? (
                                                    <>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            <Transl>Formato: 00.000.000/0000-00</Transl>
                                                        </p>
                                                        <Input type="text" value={editCnpj} onChange={handleCnpjChange} className="w-full" />
                                                    </>
                                                ) : (<p className="text-sm text-foreground">{cnpj || 'CNPJ não informado'}</p>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <Label className={"pb-3 font-bold"}><Transl>Descrição</Transl></Label>
                                    <div className="w-full max-w-md">
                                        <div className="flex flex-col w-full items-start gap-2">
                                            {companyEditing ? (
                                                <><Input placeholder="Descrição curta / departamento" value={editDescricaoCurta} onChange={e => setEditDescricaoCurta(e.target.value)} className="w-full" /></>
                                            ) : (<><p className="text-sm text-foreground">{descricaoCurta || 'Sem descrição'}</p></>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />
                            {/* Contatos da empresa */}
                            <div className="">
                                <Label className={"pb-3 font-bold"}><Transl>Contatos</Transl></Label>
                                <div className="flex flex-wrap items-start gap-4">
                                    <div className="flex-1">
                                        {companyEditing ? (
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    <Input placeholder="Telefone" value={editTelefone} onChange={handlePhoneChange} />
                                                    <Input placeholder="E-mail" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <p className="text-sm text-foreground">{telefone ? formatPhone(telefone) : 'Telefone não informado'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    {email ? (
                                                        <a className="text-sm text-foreground hover:underline" href={`mailto:${email}`}>{email}</a>
                                                    ) : (<p className="text-sm text-foreground">E-mail não informado</p>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />

                            {/* Endereço da Unidade */}
                            <div className="">
                                <Label className={"pb-3 font-bold"}><Transl>Endereço</Transl></Label>
                                <div className="w-full">
                                    <div className="flex flex-col items-start gap-2">
                                        {companyEditing ? (
                                            <>
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full">
                                                    <div>
                                                        <Label className="pb-2 font-medium"><Transl>Endereço</Transl></Label>
                                                        <Input placeholder="Endereço" value={editEndereco} onChange={e => setEditEndereco(e.target.value)} disabled={loadingCep}/>
                                                    </div>
                                                    <div>
                                                        <Label className="pb-2 font-medium"><Transl>CEP</Transl></Label>
                                                        <Input placeholder="CEP" value={editCep} onChange={handleCepChange} disabled={loadingCep}/>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full">
                                                    <div>
                                                        <Label className="pb-2 font-medium"><Transl>Cidade</Transl></Label>
                                                        <Input placeholder="Cidade"value={editCidade} onChange={e => setEditCidade(e.target.value)} disabled={loadingCep}/>
                                                    </div>
                                                    <div>
                                                        <Label className="pb-2 font-medium"><Transl>Estado</Transl></Label>
                                                        <Select value={editEstado} onValueChange={setEditEstado} disabled={loadingCep}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione o Estado" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {estadosBrasil.map((est) => (
                                                                    <SelectItem key={est.sigla} value={est.sigla}>
                                                                        {est.nome} ({est.sigla})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <><p className="text-sm text-foreground">{endereco || 'Endereço não informado'}, {cep || 'CEP'}, {cidade || 'Cidade'} - {estado || 'Estado'}</p></>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />

                            {/* Apagar empresa (apenas em modo de edição) */}
                            {companyEditing && (
                                <div>
                                <Label className={"pb-3 font-bold"}><Transl>Deletar empresa</Transl></Label>
                                <Alert variant="destructive" className="mb-4 max-w-md">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle><Transl>Aviso</Transl></AlertTitle>
                                    <AlertDescription>
                                        <p><Transl>Excluir permanentemente a empresa (Matriz) e todos os dados. A ação não é reversível — </Transl><span className="font-medium underline"><Transl>proceda com cuidado.</Transl></span></p>
                                    </AlertDescription>
                                </Alert>
                                <Button variant="destructive" onClick={handleDeleteClick}><Transl>Deletar empresa</Transl></Button>

                                {/* Primeiro modal: confirmação simples */}
                                <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen} className="w-80">
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle><Transl>Você tem certeza que deseja excluir a matriz?</Transl></DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-2">
                                            <Transl className="text-sm text-muted-foreground">Esta ação é irreversível. Todos os dados relacionados serão removidos.</Transl>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}><Transl>Cancelar</Transl></Button>
                                            <Button variant="destructive" onClick={handleConfirmFirst} className="ml-2"><Transl>Sim</Transl></Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Segundo modal: digite 'Excluir' para confirmar */}
                                <Dialog open={isConfirmTypingOpen} onOpenChange={setIsConfirmTypingOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle><Transl>Você está prestes a excluir a matriz</Transl></DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-2 space-y-2">
                                            <Transl className="text-sm text-muted-foreground">Para continuar, digite <strong>Excluir</strong> no campo abaixo e confirme.</Transl>
                                            <Input value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} placeholder="Digite Excluir" />
                                            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={handleCancelDelete}><Transl>Cancelar</Transl></Button>
                                            <Button variant="destructive" onClick={handleFinalDelete} disabled={deleting} className="ml-2"><Transl>Excluir</Transl></Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                </div>
                            )}

                            <div className="pt-3">
                                {companyEditing ? (
                                    <div className="flex gap-2">
                                        <Button onClick={saveCompany}><Transl>Salvar</Transl></Button>
                                        <Button variant="outline" onClick={cancelCompanyEdit}><Transl>Cancelar</Transl></Button>
                                    </div>
                                ) : (<Button onClick={startEditing}><Transl>Editar informações</Transl></Button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}