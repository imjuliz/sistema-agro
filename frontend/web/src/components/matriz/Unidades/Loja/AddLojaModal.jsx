"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sidebar } from '@/components/UsageSelection/SideBar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';
import { Separator } from '@/components/ui/separator';
import { Plus, Camera, Eye, EyeOff } from 'lucide-react'

export default function AddLojaWizard({ open, onOpenChange, onCreated }) {
  const { accessToken, fetchWithAuth } = useAuth();

  const [step, setStep] = useState(0);

  // Step 1 (principais)
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [horarioAbertura, setHorarioAbertura] = useState("");
  const [horarioFechamento, setHorarioFechamento] = useState("");
  const [descricaoCurta, setDescricaoCurta] = useState("");
  const [cepPreenchido, setCepPreenchido] = useState(false);
  const [enderecoNumero, setEnderecoNumero] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Novos estados para gerentes e funcionários
  const [newGerenteData, setNewGerenteData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmaSenha: "",
  });
  const [newGerenteErrors, setNewGerenteErrors] = useState({});
  const [showGerenteSenha, setShowGerenteSenha] = useState(false);
  const [showGerenteConfirmaSenha, setShowGerenteConfirmaSenha] = useState(false);

  const [newFuncionarioData, setNewFuncionarioData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmaSenha: "",
  });
  const [newFuncionarioErrors, setNewFuncionarioErrors] = useState({});
  const [showFuncionarioSenha, setShowFuncionarioSenha] = useState(false);
  const [showFuncionarioConfirmaSenha, setShowFuncionarioConfirmaSenha] = useState(false);

  // Step 2 (equipe)
  const [teamInvites, setTeamInvites] = useState([]);
  const [newUserNome, setNewUserNome] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("FUNCIONARIO_LOJA");

  const [loading, setLoading] = useState(false);

  // errors object: chave => mensagem
  const [errors, setErrors] = useState({});
  // mensagem de erro geral por step (ex: "adicione pelo menos um contrato")
  const [formError, setFormError] = useState("");

  // CEP specific
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  const steps = [
    { id: 'principais', title: 'Informações principais' },
    { id: 'equipe', title: 'Convidar equipe' }
  ];

  function resetAll() {
    setNome(''); setEndereco(''); setCep(''); setCidade(''); setEstado(''); setCnpj(''); setEmail(''); setTelefone('');
    setImagemFile(null); setImagemPreview(null); setHorarioAbertura(''); setHorarioFechamento(''); setDescricaoCurta('');
    setEnderecoNumero(''); setTeamInvites([]);
    setCepPreenchido(false); setLatitude(null); setLongitude(null);
    setStep(0);
    setErrors({});
    setFormError('');
    setCepError('');
  }

  // --- Helpers: mascaras e filtros ---
  function onlyDigits(value = "") {
    return value.replace(/\D/g, "");
  }

  function formatCNPJ(value = "") {
    const d = onlyDigits(value).slice(0, 14);
    // 00.000.000/0000-00
    return d
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function formatCEP(value = "") {
    const d = onlyDigits(value).slice(0, 8);
    return d.replace(/^(\d{5})(\d)/, "$1-$2");
  }

  function formatTelefone(value = "") {
    const d = onlyDigits(value).slice(0, 11); // 10 or 11 digits
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  // --- Função para comprimir imagem ---
  function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionar se necessário
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para base64 com qualidade reduzida
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Handle upload de imagem ---
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo e tamanho
    if (!file.type.startsWith('image/')) {
      alert('Selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Imagem deve ter no máximo 5MB');
      return;
    }

    setImagemFile(file);

    // Comprimir imagem antes de criar preview
    try {
      const compressedBase64 = await compressImage(file);
      setImagemPreview(compressedBase64);
    } catch (err) {
      console.error('Erro ao comprimir imagem:', err);
      // Fallback: usar imagem original se compressão falhar
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagemPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // --- CEP lookup using fetchWithAuth ---
  async function fetchCepAndFill(rawCep) {
    const digits = onlyDigits(rawCep);
    setCepError("");
    if (digits.length !== 8) return;
    try {
      setCepLoading(true);
      const res = await fetchWithAuth(`${API_URL}unidades/cep?cep=${digits}`, { method: 'GET' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setCepError(body?.erro || `Erro buscando CEP (${res.status})`);
        setErrors(prev => ({ ...prev, cep: 'CEP inválido ou não encontrado.' }));
        return;
      }
      const json = await res.json();
      if (!json?.sucesso) {
        setCepError(json?.erro || 'CEP não encontrado');
        setErrors(prev => ({ ...prev, cep: 'CEP inválido ou não encontrado.' }));
        return;
      }

      // extrai os dados diretamente de json
      const { endereco: logradouro, complemento, bairro, cidade: localidade, estado: uf, latitude: lat, longitude: lng } = json;
      const enderecoMontado = [logradouro, bairro, complemento].filter(Boolean).join(", ");
      if (enderecoMontado) setEndereco(enderecoMontado);
      if (localidade) setCidade(localidade);
      if (uf) setEstado(uf);
      // Capturar coordenadas se disponíveis
      if (lat !== null && lat !== undefined) setLatitude(lat);
      if (lng !== null && lng !== undefined) setLongitude(lng);
      // atualiza cep formatado
      setCep(json.cep || formatCEP(digits));
      // marca CEP como preenchido para desabilitar campos
      setCepPreenchido(true);
      // limpa erros
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.cep; delete copy.endereco; delete copy.cidade; delete copy.estado;
        return copy;
      });
    } catch (err) {
      console.warn("Erro lookup CEP:", err);
      setCepError(typeof err === "string" ? err : err?.message || "Erro ao buscar CEP");
      setErrors(prev => ({ ...prev, cep: 'CEP inválido ou não encontrado.' }));
    } finally {
      setCepLoading(false);
    }
  }

  // --- validações por passo ---
  function validateStep0Fields() {
    const e = {};
    if (!nome.trim()) e.nome = "Nome é obrigatório.";
    if (!telefone.trim()) e.telefone = "Telefone é obrigatório.";
    if (!cep.trim()) e.cep = "CEP é obrigatório.";
    if (!endereco.trim()) e.endereco = "Endereço é obrigatório.";
    if (!cidade.trim()) e.cidade = "Cidade é obrigatória.";
    if (!estado.trim()) e.estado = "Estado é obrigatório.";
    if (!email.trim()) e.email = "Email é obrigatório.";
    if (!cnpj.trim()) e.cnpj = "CNPJ é obrigatório.";
    // validação do número do endereço (obrigatório)
    if (!enderecoNumero || !enderecoNumero.trim()) e.enderecoNumero = "Número do endereço é obrigatório.";
    if (enderecoNumero && enderecoNumero.trim().length > 20) e.enderecoNumero = "Número do endereço inválido.";
    // validação simples de e-mail (se preenchido)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email inválido.";
    // cnpj val: se preenchido, verificar se tem 14 dígitos
    const cnpjDigits = onlyDigits(cnpj);
    if (cnpj && cnpjDigits.length !== 14) e.cnpj = "CNPJ inválido (deve conter 14 dígitos).";
    // cep deve ter 8 dígitos
    const cepDigits = onlyDigits(cep);
    if (cep && cepDigits.length !== 8) e.cep = "CEP inválido (8 dígitos).";
    return e;
  }

  // --- Handlers de navegação com validação inline ---
  async function handleNext() {
    setErrors({});
    setFormError("");
    if (step === 0) {
      const e = validateStep0Fields();
      if (Object.keys(e).length > 0) {
        setErrors(e);
        setFormError('Corrija os campos marcados antes de continuar.');
        return;
      }
      setStep(1);
      return;
    }
  }

  function handleBack() { if (step > 0) setStep(step - 1); }

  // --- Funções de adição de equipe ---
  async function addTeamInvite(type) {
    setErrors({});
    setFormError("");
    setNewGerenteErrors({});
    setNewFuncionarioErrors({});

    if (type === "gerente") {
      const errors = {};
      if (!newGerenteData.nome || !newGerenteData.nome.trim()) errors.nome = "Nome é obrigatório.";
      if (!newGerenteData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newGerenteData.email)) errors.email = "Email inválido.";
      if (!newGerenteData.telefone || !onlyDigits(newGerenteData.telefone)) errors.telefone = "Telefone é obrigatório.";
      if (!newGerenteData.senha || !newGerenteData.senha.trim()) errors.senha = "Senha é obrigatória.";
      if (!newGerenteData.confirmaSenha || !newGerenteData.confirmaSenha.trim()) errors.confirmaSenha = "Confirmação de senha é obrigatória.";
      if (newGerenteData.senha && newGerenteData.confirmaSenha && newGerenteData.senha !== newGerenteData.confirmaSenha) {
        errors.confirmaSenha = "As senhas não correspondem.";
      }

      // Validar se email já existe em teamInvites
      const emailJaExiste = teamInvites.some(u => u.email.toLowerCase() === newGerenteData.email.toLowerCase());
      if (emailJaExiste) {
        errors.email = "Este email já está cadastrado.";
      }

      // Validar se telefone já existe em teamInvites
      const telefoneDigitos = onlyDigits(newGerenteData.telefone);
      const telefoneJaExiste = teamInvites.some(u => onlyDigits(u.telefone) === telefoneDigitos);
      if (telefoneJaExiste) {
        errors.telefone = "Este telefone já está cadastrado.";
      }

      if (Object.keys(errors).length > 0) {
        setNewGerenteErrors(errors);
        return;
      }

      const tempId = `temp_user_${Date.now()}`;
      setTeamInvites(prev => [
        ...prev,
        {
          id: tempId,
          nome: newGerenteData.nome.trim(),
          email: newGerenteData.email.trim(),
          telefone: onlyDigits(newGerenteData.telefone),
          role: "GERENTE_LOJA",
          isNew: true,
          _raw: { ...newGerenteData }
        }
      ]);

      setNewGerenteData({ nome: "", email: "", telefone: "", senha: "", confirmaSenha: "" });
      setNewGerenteErrors({});
      setFormError('✅ Gerente adicionado com sucesso!');

    } else if (type === "funcionario") {
      const errors = {};
      if (!newFuncionarioData.nome || !newFuncionarioData.nome.trim()) errors.nome = "Nome é obrigatório.";
      if (!newFuncionarioData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newFuncionarioData.email)) errors.email = "Email inválido.";
      if (!newFuncionarioData.telefone || !onlyDigits(newFuncionarioData.telefone)) errors.telefone = "Telefone é obrigatório.";
      if (!newFuncionarioData.senha || !newFuncionarioData.senha.trim()) errors.senha = "Senha é obrigatória.";
      if (!newFuncionarioData.confirmaSenha || !newFuncionarioData.confirmaSenha.trim()) errors.confirmaSenha = "Confirmação de senha é obrigatória.";
      if (newFuncionarioData.senha && newFuncionarioData.confirmaSenha && newFuncionarioData.senha !== newFuncionarioData.confirmaSenha) {
        errors.confirmaSenha = "As senhas não correspondem.";
      }

      // Validar se email já existe em teamInvites
      const emailJaExiste = teamInvites.some(u => u.email.toLowerCase() === newFuncionarioData.email.toLowerCase());
      if (emailJaExiste) {
        errors.email = "Este email já está cadastrado.";
      }

      // Validar se telefone já existe em teamInvites
      const telefoneDigitos = onlyDigits(newFuncionarioData.telefone);
      const telefoneJaExiste = teamInvites.some(u => onlyDigits(u.telefone) === telefoneDigitos);
      if (telefoneJaExiste) {
        errors.telefone = "Este telefone já está cadastrado.";
      }

      if (Object.keys(errors).length > 0) {
        setNewFuncionarioErrors(errors);
        return;
      }

      const tempId = `temp_user_${Date.now()}`;
      setTeamInvites(prev => [...prev, {
        id: tempId,
        nome: newFuncionarioData.nome.trim(),
        email: newFuncionarioData.email.trim(),
        telefone: onlyDigits(newFuncionarioData.telefone),
        role: "FUNCIONARIO_LOJA",
        isNew: true,
        _raw: { ...newFuncionarioData }
      }]);

      setNewFuncionarioData({ nome: "", email: "", telefone: "", senha: "", confirmaSenha: "" });
      setNewFuncionarioErrors({});
    }
  }

  // --- Validações por passo (ajustado para gerentes) ---
  function validateStep2Fields() {
    const e = {};
    const hasManager = teamInvites.some(u => u.role === 'GERENTE_LOJA');
    if (!hasManager) e.teamInvites = "É obrigatório informar um GERENTE_LOJA.";
    return e;
  }

  async function handleSubmitAll() {
    setErrors({});
    setFormError("");

    // valida step2 (ex: obrigatoriedade de gerente)
    const e = validateStep2Fields && validateStep2Fields();
    if (e && Object.keys(e).length > 0) {
      setErrors(e);
      setFormError('Corrija os erros antes de enviar.');
      return;
    }

    // monta payload unidade
    const enderecoCompleto = endereco.trim() + (enderecoNumero && enderecoNumero.trim() ? `, nº ${enderecoNumero.trim()}` : '');
    
    // Se não temos latitude/longitude mas temos endereço completo, buscar coordenadas
    if ((latitude === null || longitude === null) && enderecoCompleto && cidade && estado) {
      try {
        const enderecoParaGeocode = `${enderecoCompleto}, ${cidade}, ${estado}, Brasil`;
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoParaGeocode)}&limit=1`;
        const geoResponse = await fetch(nominatimUrl, {
          headers: { 'User-Agent': 'SistemaAgro/1.0 (node.js)' }
        });
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData && geoData.length > 0) {
            setLatitude(parseFloat(geoData[0].lat));
            setLongitude(parseFloat(geoData[0].lon));
          }
        }
      } catch (geoErr) {
        console.warn("[handleSubmitAll] Erro ao buscar coordenadas:", geoErr.message);
      }
    }

    // Truncar campos para respeitar limites do banco
    const payload = {
      nome: nome.trim().substring(0, 100),
      endereco: enderecoCompleto.substring(0, 500),
      cep: onlyDigits(cep).trim().substring(0, 20),
      cidade: cidade.trim().substring(0, 100),
      estado: estado.trim().substring(0, 100),
      tipo: 'LOJA',
      status: 'ATIVA'
    };

    if (cnpj && onlyDigits(cnpj).trim()) payload.cnpj = onlyDigits(cnpj).trim().substring(0, 20);
    if (email && email.trim()) payload.email = email.trim().substring(0, 255);
    if (telefone && onlyDigits(telefone).trim()) payload.telefone = onlyDigits(telefone).trim().substring(0, 20);
    // Adicionar imagem apenas se não for muito grande
    if (imagemPreview) {
      if (imagemPreview.length <= 1000) {
        payload.imagemBase64 = imagemPreview;
      } else {
        console.warn('Imagem muito grande para salvar no banco, removendo do payload.');
      }
    }
    if (latitude !== null && latitude !== undefined) payload.latitude = latitude;
    if (longitude !== null && longitude !== undefined) payload.longitude = longitude;
    if (horarioAbertura) payload.horarioAbertura = horarioAbertura;
    if (horarioFechamento) payload.horarioFechamento = horarioFechamento;
    if (descricaoCurta) payload.descricaoCurta = descricaoCurta;

    setLoading(true);

    try {
      // criar unidade primeiro
      const base = String(API_URL || '').replace(/\/$/, '');
      const r = await fetchWithAuth(`${base}/unidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body?.erro || `Erro criando unidade: ${r.status}`);
      }
      const unidade = await r.json();

      // Criar usuários novos (teamInvites isNew === true) e associar unidade
      const createdUsers = [];
      for (const u of teamInvites) {
        if (u.isNew) {
          const createBody = {
            nome: u._raw.nome,
            email: u._raw.email,
            senha: u._raw.senha,
            telefone: onlyDigits(u._raw.telefone),
            role: u.role,
            unidadeId: unidade.unidade?.id || unidade.id
          };
          const resp = await fetchWithAuth(`${base}/usuarios/criar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createBody)
          });

          if (!resp.ok) {
            const errBody = await resp.json().catch(() => ({}));
            if (errBody.field) {
              const msg = `esse ${errBody.field} ja foi cadastrado no sistema`;
              if (errBody.field === 'email') setNewGerenteErrors(prev => ({ ...prev, email: msg }));
              if (errBody.field === 'telefone') setNewGerenteErrors(prev => ({ ...prev, telefone: msg }));
              throw new Error(errBody.erro || 'Erro criando usuário.');
            }
            throw new Error(errBody.erro || `Erro criando usuário (${resp.status})`);
          }

          const json = await resp.json();
          createdUsers.push(json.usuario || json);
        }
      }

      if (typeof onCreated === 'function') onCreated({ unidade, usuarios: createdUsers });
      toast.success('Loja criada com sucesso!');
      resetAll();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Erro durante criação da loja. Veja console.');
    }
    finally { setLoading(false); }
  }

  // --- JSX render ---
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAll(); onOpenChange(v); }} className={cn("z-[1000]")} >
      <DialogContent className={cn(
        "w-3/4 h-[90vh] max-w-none m-0 p-0 rounded-lg z-[1000]"
      )}>
        <DialogHeader className="sr-only">
          <DialogTitle>Criar Nova Loja</DialogTitle>
          <DialogDescription>Preencha as informações para criar uma nova loja.</DialogDescription>
        </DialogHeader>

        <div className="flex h-full overflow-hidden">

          {/* Sidebar fixa */}
          <div className="hidden lg:block w-72 border-r">
            <Sidebar
              steps={steps.map((s, i) => ({
                ...s,
                completed: i < step,
                current: i === step
              }))}
            />
          </div>

          <main className="flex-1 p-8 overflow-y-auto">
            <header className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Criar Nova Loja</h2>
              <div className="flex gap-2" />
            </header>

            {/* Steps content */}
            {step === 0 && (
              <section className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input id="nome" value={nome} onChange={(e) => { setNome(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.nome; return c; }); }} placeholder="Nome da loja" aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "error-nome" : undefined} className={cn(errors.nome && "border-red-500 ring-1 ring-red-500")} />
                    {errors.nome && <p id="error-nome" className="text-sm text-red-600 mt-1">{errors.nome}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input id="cnpj" value={cnpj} onChange={(e) => { setCnpj(formatCNPJ(e.target.value)); setErrors(prev => { const c = { ...prev }; delete c.cnpj; return c; }); }} placeholder="00.000.000/0000-00" aria-invalid={!!errors.cnpj} aria-describedby={errors.cnpj ? "error-cnpj" : undefined} className={cn(errors.cnpj && "border-red-500 ring-1 ring-red-500")} />
                    {errors.cnpj && <p id="error-cnpj" className="text-sm text-red-600 mt-1">{errors.cnpj}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" value={cep}
                      onChange={(e) => {
                        const v = formatCEP(e.target.value);
                        setCep(v);
                        setErrors(prev => { const c = { ...prev }; delete c.cep; return c; });
                        const digits = onlyDigits(v);
                        if (digits.length === 8) fetchCepAndFill(digits);
                      }}
                      onBlur={() => {
                        const digits = onlyDigits(cep);
                        if (digits.length === 8) fetchCepAndFill(digits);
                      }}
                      placeholder="00000-000"
                      aria-invalid={!!errors.cep}
                      aria-describedby={errors.cep ? "error-cep" : undefined}
                      className={cn(errors.cep && "border-red-500 ring-1 ring-red-500")}
                    />
                    {cepLoading ? (
                      <p className="text-sm text-muted-foreground">Buscando endereço pelo CEP...</p>
                    ) : cepError ? (
                      <p className="text-sm text-red-600">{cepError}</p>
                    ) : errors.cep ? (
                      <p id="error-cep" className="text-sm text-red-600 mt-1">{errors.cep}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input id="cidade" value={cidade} onChange={(e) => { setCidade(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.cidade; return c; }); }}
                      disabled={cepPreenchido}
                      aria-invalid={!!errors.cidade}
                      aria-describedby={errors.cidade ? "error-cidade" : undefined}
                      className={cn(errors.cidade && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.cidade && <p id="error-cidade" className="text-sm text-red-600 mt-1">{errors.cidade}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Input id="estado" value={estado} onChange={(e) => { setEstado(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.estado; return c; }); }}
                      disabled={cepPreenchido}
                      aria-invalid={!!errors.estado}
                      aria-describedby={errors.estado ? "error-estado" : undefined}
                      className={cn(errors.estado && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.estado && <p id="error-estado" className="text-sm text-red-600 mt-1">{errors.estado}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="endereco">Endereço *</Label>
                    <Textarea id="endereco" value={endereco} onChange={(e) => { setEndereco(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.endereco; return c; }); }} className={cn("min-h-[80px]", errors.endereco && "border-red-500 ring-1 ring-red-500")} aria-invalid={!!errors.endereco} aria-describedby={errors.endereco ? "error-endereco" : undefined} />
                    {errors.endereco && <p id="error-endereco" className="text-sm text-red-600 mt-1">{errors.endereco}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enderecoNumero">Número *</Label>
                    <Input id="enderecoNumero" value={enderecoNumero} onChange={(e) => { const cleaned = e.target.value.replace(/\D/g, ''); setEnderecoNumero(cleaned); setErrors(prev => { const c = { ...prev }; delete c.enderecoNumero; return c; }); }} placeholder="Nº" className={cn(errors.enderecoNumero && "border-red-500 ring-1 ring-red-500")} />
                    {errors.enderecoNumero && <p id="error-enderecoNumero" className="text-sm text-red-600 mt-1">{errors.enderecoNumero}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" value={telefone} onChange={(e) => { setTelefone(formatTelefone(e.target.value)); setErrors(prev => { const c = { ...prev }; delete c.telefone; return c; }); }} placeholder="(00) 90000-0000" aria-invalid={!!errors.telefone} aria-describedby={errors.telefone ? "error-telefone" : undefined} className={cn(errors.telefone && "border-red-500 ring-1 ring-red-500")} />
                    {errors.telefone && <p id="error-telefone" className="text-sm text-red-600 mt-1">{errors.telefone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.email; return c; }); }} aria-invalid={!!errors.email} aria-describedby={errors.email ? "error-email" : undefined} className={cn(errors.email && "border-red-500 ring-1 ring-red-500")} />
                    {errors.email && <p id="error-email" className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Foto da Loja</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imagemInput"
                      />
                      <label htmlFor="imagemInput" className="cursor-pointer">
                        <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                          {imagemPreview ? (
                            <img src={imagemPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horarioAbertura">Horário Abertura</Label>
                    <Input id="horarioAbertura" type="time" value={horarioAbertura} onChange={(e) => setHorarioAbertura(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horarioFechamento">Horário Fechamento</Label>
                    <Input id="horarioFechamento" type="time" value={horarioFechamento} onChange={(e) => setHorarioFechamento(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricaoCurta">Descrição Curta</Label>
                  <Textarea id="descricaoCurta" value={descricaoCurta} onChange={(e) => setDescricaoCurta(e.target.value)} className="min-h-[80px]" />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div />
                  <div className="flex gap-2">
                    <Button onClick={handleNext}>Próximo</Button>
                  </div>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="space-y-6">
                <h3 className="text-lg font-semibold">Convidar equipe</h3>
                <div className="space-y-4">
                  <h4 className="font-semibold">Gerente *</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Será criado um novo gerente para esta loja. Preencha os dados abaixo.</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                    <h4 className="font-semibold">Dados do Novo Gerente</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="novo-gerente-nome">Nome *</Label>
                        <Input
                          id="novo-gerente-nome"
                          value={newGerenteData.nome || ""}
                          onChange={(e) => setNewGerenteData(prev => ({ ...prev, nome: e.target.value }))}
                          className={cn(newGerenteErrors.nome && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newGerenteErrors.nome && <p className="text-sm text-red-600 mt-1">{newGerenteErrors.nome}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="novo-gerente-email">Email *</Label>
                        <Input
                          id="novo-gerente-email"
                          type="email"
                          value={newGerenteData.email || ""}
                          onChange={(e) => setNewGerenteData(prev => ({ ...prev, email: e.target.value }))}
                          className={cn(newGerenteErrors.email && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newGerenteErrors.email && <p className="text-sm text-red-600 mt-1">{newGerenteErrors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="novo-gerente-telefone">Telefone *</Label>
                        <Input
                          id="novo-gerente-telefone"
                          value={newGerenteData.telefone || ""}
                          onChange={(e) => setNewGerenteData(prev => ({ ...prev, telefone: formatTelefone(e.target.value) }))}
                          className={cn(newGerenteErrors.telefone && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newGerenteErrors.telefone && <p className="text-sm text-red-600 mt-1">{newGerenteErrors.telefone}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="novo-gerente-senha">Senha *</Label>
                        <div className="relative">
                          <Input
                            id="novo-gerente-senha"
                            type={showGerenteSenha ? "text" : "password"}
                            value={newGerenteData.senha || ""}
                            onChange={(e) => setNewGerenteData(prev => ({ ...prev, senha: e.target.value }))}
                            className={cn(newGerenteErrors.senha && "border-red-500 ring-1 ring-red-500", "pr-10")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowGerenteSenha(!showGerenteSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showGerenteSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {newGerenteErrors.senha && <p className="text-sm text-red-600 mt-1">{newGerenteErrors.senha}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="novo-gerente-confirma-senha">Confirmar Senha *</Label>
                        <div className="relative">
                          <Input
                            id="novo-gerente-confirma-senha"
                            type={showGerenteConfirmaSenha ? "text" : "password"}
                            value={newGerenteData.confirmaSenha || ""}
                            onChange={(e) => setNewGerenteData(prev => ({ ...prev, confirmaSenha: e.target.value }))}
                            className={cn(newGerenteErrors.confirmaSenha && "border-red-500 ring-1 ring-red-500", "pr-10")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowGerenteConfirmaSenha(!showGerenteConfirmaSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showGerenteConfirmaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {newGerenteErrors.confirmaSenha && <p className="text-sm text-red-600 mt-1">{newGerenteErrors.confirmaSenha}</p>}
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => addTeamInvite("gerente")} disabled={loading}>Adicionar Gerente</Button>

                  <Separator />

                  <h4 className="font-semibold">Funcionários (Opcional)</h4>
                  <p className="text-sm text-muted-foreground">Funcionários não podem ser associados a múltiplas lojas. Apenas crie novos.</p>
                  <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                    <h4 className="font-semibold">Dados do Novo Funcionário</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="novo-funcionario-nome">Nome *</Label>
                        <Input
                          id="novo-funcionario-nome"
                          value={newFuncionarioData.nome || ""}
                          onChange={(e) => setNewFuncionarioData(prev => ({ ...prev, nome: e.target.value }))}
                          className={cn(newFuncionarioErrors.nome && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newFuncionarioErrors.nome && <p className="text-sm text-red-600 mt-1">{newFuncionarioErrors.nome}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="novo-funcionario-email">Email *</Label>
                        <Input
                          id="novo-funcionario-email"
                          type="email"
                          value={newFuncionarioData.email || ""}
                          onChange={(e) => setNewFuncionarioData(prev => ({ ...prev, email: e.target.value }))}
                          className={cn(newFuncionarioErrors.email && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newFuncionarioErrors.email && <p className="text-sm text-red-600 mt-1">{newFuncionarioErrors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="novo-funcionario-telefone">Telefone *</Label>
                        <Input
                          id="novo-funcionario-telefone"
                          value={newFuncionarioData.telefone || ""}
                          onChange={(e) => setNewFuncionarioData(prev => ({ ...prev, telefone: formatTelefone(e.target.value) }))}
                          className={cn(newFuncionarioErrors.telefone && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newFuncionarioErrors.telefone && <p className="text-sm text-red-600 mt-1">{newFuncionarioErrors.telefone}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="novo-funcionario-senha">Senha *</Label>
                        <div className="relative">
                          <Input
                            id="novo-funcionario-senha"
                            type={showFuncionarioSenha ? "text" : "password"}
                            value={newFuncionarioData.senha || ""}
                            onChange={(e) => setNewFuncionarioData(prev => ({ ...prev, senha: e.target.value }))}
                            className={cn(newFuncionarioErrors.senha && "border-red-500 ring-1 ring-red-500", "pr-10")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowFuncionarioSenha(!showFuncionarioSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showFuncionarioSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {newFuncionarioErrors.senha && <p className="text-sm text-red-600 mt-1">{newFuncionarioErrors.senha}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="novo-funcionario-confirma-senha">Confirmar Senha *</Label>
                        <div className="relative">
                          <Input
                            id="novo-funcionario-confirma-senha"
                            type={showFuncionarioConfirmaSenha ? "text" : "password"}
                            value={newFuncionarioData.confirmaSenha || ""}
                            onChange={(e) => setNewFuncionarioData(prev => ({ ...prev, confirmaSenha: e.target.value }))}
                            className={cn(newFuncionarioErrors.confirmaSenha && "border-red-500 ring-1 ring-red-500", "pr-10")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowFuncionarioConfirmaSenha(!showFuncionarioConfirmaSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showFuncionarioConfirmaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {newFuncionarioErrors.confirmaSenha && <p className="text-sm text-red-600 mt-1">{newFuncionarioErrors.confirmaSenha}</p>}
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => addTeamInvite("funcionario")} disabled={loading} className="mt-2">Adicionar Funcionário</Button>
                </div>

                {errors.teamInvites && <p className="text-sm text-red-600 mt-4">{errors.teamInvites}</p>}

                <div>
                  <h4 className="font-medium">Equipe a convidar</h4>
                  <ul className="mt-2 space-y-2">
                    {teamInvites.map((u, i) => (
                      <li key={i} className="p-2 border rounded flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{u.nome} — {u.role === "GERENTE_LOJA" ? "Gerente" : "Funcionário"}</div>
                          <div className="text-sm text-muted-foreground">{u.email}</div>
                        </div>
                        <div>
                          <Button variant="ghost" onClick={() => setTeamInvites(prev => prev.filter((_, idx) => idx !== i))}>Remover</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack}>Voltar</Button>
                  <Button onClick={handleSubmitAll} disabled={loading}>{loading ? 'Criando...' : 'Concluir e Criar Loja'}</Button>
                </div>
              </section>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}















