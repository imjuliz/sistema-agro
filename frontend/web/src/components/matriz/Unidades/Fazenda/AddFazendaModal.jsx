"use client";

import React, { useState, useCallback, useContext, useEffect } from "react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sidebar } from '@/components/UsageSelection/SideBar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext'; // ajuste o caminho se necessário
import { API_URL } from '@/lib/api'; // ajuste o caminho se necessário
import { Separator } from '@/components/ui/separator';
import { Plus, Camera, Eye, EyeOff } from 'lucide-react'

export default function AddFazendaWizard({ open, onOpenChange, onCreated }) {
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
  const [areaTotal, setAreaTotal] = useState("");
  const [areaProdutiva, setAreaProdutiva] = useState("");
  const [focoProdutivo, setFocoProdutivo] = useState("");
  const [cultura, setCultura] = useState("");
  const [horarioAbertura, setHorarioAbertura] = useState("");
  const [horarioFechamento, setHorarioFechamento] = useState("");
  const [descricaoCurta, setDescricaoCurta] = useState("");
  const [cepPreenchido, setCepPreenchido] = useState(false);
  const [enderecoNumero, setEnderecoNumero] = useState("");
  const [unidadesMedidaOptions, setUnidadesMedidaOptions] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Novos estados para fornecedores externos
  const [existingFornecedores, setExistingFornecedores] = useState([]);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState(""); // "" para "Criar Novo"
  const [isCreatingNewFornecedor, setIsCreatingNewFornecedor] = useState(false);
  const [newFornecedorData, setNewFornecedorData] = useState({
    nomeEmpresa: "",
    descricaoEmpresa: "",
    cnpjCpf: "",
    email: "",
    telefone: "",
    endereco: "",
  });
  const [newFornecedorErrors, setNewFornecedorErrors] = useState({});

  // Novos estados para gerentes e funcionários
  const [existingGerentes, setExistingGerentes] = useState([]);
  const [selectedGerenteId, setSelectedGerenteId] = useState(""); // "" para "Criar Novo"
  const [isCreatingNewGerente, setIsCreatingNewGerente] = useState(true);
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

  // Step 2 (fornecedores & contratos)
  const [fornecedores, setFornecedores] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [newFornecedorNome, setNewFornecedorNome] = useState("");
  const [newFornecedorDocumento, setNewFornecedorDocumento] = useState("");
  const [newFornecedorContato, setNewFornecedorContato] = useState("");

  // Step 3 (equipe)
  const [teamInvites, setTeamInvites] = useState([]);
  const [newUserNome, setNewUserNome] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("FUNCIONARIO_FAZENDA");

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
    { id: 'fornecedores', title: 'Fornecedores e Contratos' },
    { id: 'equipe', title: 'Convidar equipe' }
  ];

  function resetAll() {
    setNome(''); setEndereco(''); setCep(''); setCidade(''); setEstado(''); setCnpj(''); setEmail(''); setTelefone('');
    setImagemFile(null); setImagemPreview(null); setAreaProdutiva(''); setAreaTotal(''); setCultura(''); setHorarioAbertura(''); setHorarioFechamento(''); setDescricaoCurta('');
    setEnderecoNumero(''); setFornecedores([]); setContracts([]); setTeamInvites([]);
    setFocoProdutivo(''); setCepPreenchido(false); setLatitude(null); setLongitude(null);
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

  function formatArea(value = "") {
    // deixa apenas números e ponto, e primeira ocorrencia de ponto
    let v = value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
    return v;
  }

  function computeContractEndDate(startDateStr, durationKey) {
    if (!startDateStr || !durationKey) return null;
    const start = new Date(startDateStr);
    if (Number.isNaN(start.getTime())) return null;

    const out = new Date(start);
    switch (durationKey) {
      case '6m': out.setMonth(out.getMonth() + 6); break;
      case '1y': out.setFullYear(out.getFullYear() + 1); break;
      case '2y': out.setFullYear(out.getFullYear() + 2); break;
      case '5y': out.setFullYear(out.getFullYear() + 5); break;
      default: return null;
    }
    // return yyyy-mm-dd
    return out.toISOString().slice(0,10);
  }

  // --- Handle upload de imagem ---
  function handleImageUpload(e) {
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

    // Criar preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagemPreview(event.target?.result);
    };
    reader.readAsDataURL(file);
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
      // o controller retorna { sucesso: true, cep, endereco, bairro, cidade, estado, complemento }
      if (!json?.sucesso) {
        setCepError(json?.erro || 'CEP não encontrado');
        setErrors(prev => ({ ...prev, cep: 'CEP inválido ou não encontrado.' }));
        return;
      }

      // extrai os dados diretamente de json (não precisa de json.data)
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
    if (!focoProdutivo.trim()) e.focoProdutivo = "Foco produtivo é obrigatório.";
    // validação do número do endereço (opcional, mas se preenchido validar comprimento)
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

  function validateStep1Fields() {
    // Fornecedores/contratos não são mais obrigatórios
    return {};
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
    if (step === 1) {
      const e = validateStep1Fields();
      if (Object.keys(e).length > 0) {
        setErrors(e);
        setFormError('Corrija antes de continuar.');
        return;
      }
      setStep(2);
      return;
    }
  }

  function handleBack() { if (step > 0) setStep(step - 1); }

  // --- Funções de adição de fornecedor ---
async function addFornecedor() {
  // Não criar fornecedor no backend aqui. Apenas validar e criar um fornecedor LOCAL
  // que será persistido no backend somente durante a criação final da fazenda (handleSubmitAll).
  setFormError("");
  setNewFornecedorErrors({});

  const errors = {};
  if (!newFornecedorData.nomeEmpresa.trim()) errors.nomeEmpresa = "Nome da empresa é obrigatório.";
  if (!newFornecedorData.descricaoEmpresa.trim()) errors.descricaoEmpresa = "Descrição é obrigatória.";
  const cnpjDigits = onlyDigits(newFornecedorData.cnpjCpf || "");
  if (newFornecedorData.cnpjCpf && cnpjDigits.length !== 14) errors.cnpjCpf = "CNPJ inválido.";
  if (!onlyDigits(newFornecedorData.telefone || "")) errors.telefone = "Telefone é obrigatório.";
  if (newFornecedorData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newFornecedorData.email)) errors.email = "Email inválido.";

  if (Object.keys(errors).length > 0) {
    setNewFornecedorErrors(errors);
    return;
  }

  // Criar fornecedor local (temporário). Será criado no backend apenas em handleSubmitAll.
  const tempId = `temp_fornecedor_${Date.now()}`;
  const localFornecedor = {
    id: tempId,
    isNew: true,
    nome: newFornecedorData.nomeEmpresa.trim(),
    nomeEmpresa: newFornecedorData.nomeEmpresa.trim(),
    descricaoEmpresa: newFornecedorData.descricaoEmpresa.trim(),
    cnpjCpf: newFornecedorData.cnpjCpf ? onlyDigits(newFornecedorData.cnpjCpf) : null,
    email: newFornecedorData.email || null,
    telefone: onlyDigits(newFornecedorData.telefone),
    endereco: newFornecedorData.endereco || null
  };

  setFornecedores(prev => ([...prev, localFornecedor]));
  setSelectedFornecedorId(String(tempId));
  setIsCreatingNewFornecedor(false);
  setNewFornecedorData({ nomeEmpresa: '', descricaoEmpresa: '', cnpjCpf: '', email: '', telefone: '', endereco: '' });
  setNewFornecedorErrors({});
}

function addContract() {
  setErrors(prev => {
    const copy = { ...prev };
    delete copy.contracts;
    return copy;
  });
  setFormError("");

  // Seleção inválida: sem seleção
  if (!selectedFornecedorId || selectedFornecedorId === "new") {
    setErrors(prev => ({ ...prev, contracts: 'Selecione um fornecedor existente para criar contrato.' }));
    setFormError('Selecione um fornecedor existente.');
    return;
  }

  const fornecedorId = String(selectedFornecedorId);

  // verificar duplicata por fornecedorId
  const alreadyHas = contracts.some(c => String(c.fornecedorId) === fornecedorId);
  if (alreadyHas) {
    setFormError('Já existe um contrato para este fornecedor.');
    return;
  }

  // preparar cópias
  const fornecedoresCopy = [...fornecedores];
  let fornecedorIndex = fornecedoresCopy.findIndex(f => String(f.id) === fornecedorId);

  if (fornecedorIndex === -1) {
    const ext = existingFornecedores.find(f => String(f.id) === fornecedorId);
    if (!ext) {
      setErrors(prev => ({ ...prev, contracts: 'Fornecedor inválido.' }));
      setFormError('Fornecedor inválido.');
      return;
    }
    const fornecedorObj = {
      id: ext.id,
      nome: ext.nomeEmpresa || ext.nome,
      nomeEmpresa: ext.nomeEmpresa || ext.nome,
      documento: ext.cnpjCpf || null,
      contato: ext.telefone || ext.contato || null,
      email: ext.email || null
    };
    fornecedoresCopy.push(fornecedorObj);
    fornecedorIndex = fornecedoresCopy.length - 1;
  }

  const novoContrato = {
    fornecedorIndex,
    fornecedorId,
    nomeContrato: `Contrato com ${fornecedoresCopy[fornecedorIndex].nomeEmpresa || fornecedoresCopy[fornecedorIndex].nome}`,
    descricao: '',
    itens: [],
    dataInicio: new Date().toISOString().slice(0,10),
    dataEnvio: new Date().toISOString().slice(0,10),
    dataFim: null,
    frequenciaEntregas: null,
    diaPagamento: '',
    formaPagamento: null,
    status: 'ATIVO',
    duration: ''
  };

  setFornecedores(fornecedoresCopy);
  setContracts(prev => ([...prev, novoContrato]));
  setSelectedFornecedorId(fornecedorId);
}

  // --- Funções de adição de equipe ---
  async function addTeamInvite(type) {
    setErrors({});
    setFormError("");
    setNewGerenteErrors({});
    setNewFuncionarioErrors({});

    if (type === "gerente") {
      // Sempre criar novo gerente (isCreatingNewGerente sempre é true no passo 2)
      const errors = {};
      if (!newGerenteData.nome || !newGerenteData.nome.trim()) errors.nome = "Nome é obrigatório.";
      if (!newGerenteData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newGerenteData.email)) errors.email = "Email inválido.";
      if (!newGerenteData.telefone || !onlyDigits(newGerenteData.telefone)) errors.telefone = "Telefone é obrigatório.";
      if (!newGerenteData.senha || !newGerenteData.senha.trim()) errors.senha = "Senha é obrigatória.";
      if (!newGerenteData.confirmaSenha || !newGerenteData.confirmaSenha.trim()) errors.confirmaSenha = "Confirmação de senha é obrigatória.";
      if (newGerenteData.senha && newGerenteData.confirmaSenha && newGerenteData.senha !== newGerenteData.confirmaSenha) {
        errors.confirmaSenha = "As senhas não correspondem.";
      }

      // Validar se email já existe em teamInvites ou em gerentes existentes
      const emailJaExiste = teamInvites.some(u => u.email.toLowerCase() === newGerenteData.email.toLowerCase()) ||
                           existingGerentes.some(g => g.email && g.email.toLowerCase() === newGerenteData.email.toLowerCase());
      if (emailJaExiste) {
        errors.email = "Este email já está cadastrado.";
      }

      // Validar se telefone já existe em teamInvites ou em gerentes existentes
      const telefoneDigitos = onlyDigits(newGerenteData.telefone);
      const telefoneJaExiste = teamInvites.some(u => onlyDigits(u.telefone) === telefoneDigitos) ||
                              existingGerentes.some(g => g.telefone && onlyDigits(g.telefone) === telefoneDigitos);
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
          role: "GERENTE_FAZENDA",
          isNew: true,
          _raw: { ...newGerenteData }
        }
      ]);

      setIsCreatingNewGerente(false);
      setSelectedGerenteId(tempId);
      setNewGerenteData({ nome: "", email: "", telefone: "", senha: "", confirmaSenha: "" });
      setNewGerenteErrors({});
      setFormError('✅ Gerente adicionado com sucesso!');

    } else if (type === "funcionario") {
      // funcionário novo — mantemos criação local (isNew true)
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
        role: "FUNCIONARIO_FAZENDA",
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
    const hasManager = teamInvites.some(u => u.role === 'GERENTE_FAZENDA');
    if (!hasManager) e.teamInvites = "É obrigatório informar um GERENTE_FAZENDA.";
    return e;
  }

  // Novo useEffect para buscar fornecedores externos
  useEffect(() => {
    if (open && accessToken) { // Garante que só busca quando o modal está aberto e o usuário autenticado
      async function fetchExistingFornecedores() {
        try {
          const res = await fetchWithAuth(`${API_URL}fornecedores/externos`, { method: "GET" });
          if (res.ok) {
            const { fornecedores } = await res.json();
            setExistingFornecedores(fornecedores);
          } else {
            console.error("Falha ao carregar fornecedores externos:", res.status);
          }
        } catch (err) {
          console.error("Erro ao buscar fornecedores externos:", err);
        }
      }
      fetchExistingFornecedores();
    } else {
      // Resetar estados quando o modal é fechado ou não está aberto
      setExistingFornecedores([]);
      setSelectedFornecedorId("");
      setIsCreatingNewFornecedor(false);
      setNewFornecedorData({
        nomeEmpresa: "",
        descricaoEmpresa: "",
        cnpjCpf: "",
        email: "",
        telefone: "",
        endereco: "",
      });
      setNewFornecedorErrors({});
    }
  }, [open, accessToken, fetchWithAuth]); // Dependências do useEffect

  // opções vindas do backend (frequência e forma de pagamento)
  const [frequenciaOptions, setFrequenciaOptions] = useState([]);
  const [formaPagamentoOptions, setFormaPagamentoOptions] = useState([]);

  useEffect(() => {
    if (!(open && accessToken)) {
      setFrequenciaOptions([]);
      setFormaPagamentoOptions([]);
      return;
    }

    async function fetchContratoMeta() {
      try {
        const base = String(API_URL || '').replace(/\/$/, '');
        const res = await fetchWithAuth(`${base}/meta/contratos`, { method: 'GET' });
        if (!res.ok) return console.warn('Falha ao carregar metadados de contratos:', res.status);
        const json = await res.json();
        if (!json?.sucesso) return console.warn('Meta contratos retornou erro:', json);
        setFrequenciaOptions(json.frequencias || []);
        setFormaPagamentoOptions(json.formasPagamento || []);
      } catch (err) {
        console.error('Erro buscando metadados de contratos:', err);
      }
    }

    fetchContratoMeta();
  }, [open, accessToken, fetchWithAuth]);

  // Novo useEffect para buscar gerentes disponíveis
  useEffect(() => {
    if (!(open && step === 2 && accessToken)) {
      if (!open) {
        setExistingGerentes([]);
        setSelectedGerenteId("");
        setIsCreatingNewGerente(false);
        setNewGerenteData({ nome: "", email: "", telefone: "", senha: "" });
        setNewGerenteErrors({});
      }
      return;
    }

    async function fetchExistingGerentes() {
      try {
        // monta base sem barra final para evitar // na URL
        const base = String(API_URL || '').replace(/\/$/, '');
        const url = `${base}/usuarios/gerentes-disponiveis`;

        const res = await fetchWithAuth(url, { method: "GET" });
        if (res.ok) {
          const json = await res.json();
          // o controller retorna { sucesso: true, gerentes }
          setExistingGerentes(json.gerentes || []);
        } else {
          console.error("Falha ao carregar gerentes disponíveis:", res.status);
        }
      } catch (err) {
        console.error("Erro ao buscar gerentes disponíveis:", err);
      }
    }

    fetchExistingGerentes();
  }, [open, step, accessToken, fetchWithAuth, API_URL]);

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
      // build payload without sending `null` for optional fields (Zod expects omitted fields instead)
      
      // Determinar status da fazenda: ATIVA apenas se tiver AMBOS os tipos de contrato
      // 1. Contrato como consumidora (recebe de fornecedor externo)
      // 2. Contrato como fornecedora (envia para lojas via fornecedorUnidadeId)
      const temContratoComoConsumidora = contracts?.some(c => c.fornecedorExternoId);
      const temContratoComoFornecedora = contracts?.some(c => c.fornecedorUnidadeId);
      const fazeindaStatus = (temContratoComoConsumidora && temContratoComoFornecedora) ? 'ATIVA' : 'INATIVA';
      
      const payload = {
        nome: nome.trim(),
        endereco: enderecoCompleto,
        cep: onlyDigits(cep).trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        tipo: 'FAZENDA',
        status: fazeindaStatus
      };

      if (cnpj && onlyDigits(cnpj).trim()) payload.cnpj = onlyDigits(cnpj).trim();
      if (email && email.trim()) payload.email = email.trim();
      if (telefone && onlyDigits(telefone).trim()) payload.telefone = onlyDigits(telefone).trim();
      if (imagemPreview) payload.imagemBase64 = imagemPreview;
      if (areaTotal !== '' && !Number.isNaN(Number(areaTotal))) payload.areaTotal = Number(areaTotal);
      if (areaProdutiva !== '' && !Number.isNaN(Number(areaProdutiva))) payload.areaProdutiva = Number(areaProdutiva);
      if (latitude !== null && latitude !== undefined) payload.latitude = latitude;
      if (longitude !== null && longitude !== undefined) payload.longitude = longitude;
      if (cultura) payload.cultura = cultura;
      if (horarioAbertura) payload.horarioAbertura = horarioAbertura;
      if (horarioFechamento) payload.horarioFechamento = horarioFechamento;
      if (descricaoCurta) payload.descricaoCurta = descricaoCurta;
      if (focoProdutivo && focoProdutivo.trim()) payload.focoProdutivo = focoProdutivo.trim();

    setLoading(true);

    try {
      // criar unidade primeiro
      const base = String(API_URL || '').replace(/\/$/, '');
      console.log('🔧 Criando unidade com payload:', payload);
      console.log('🔧 URL:', `${base}/unidades`, 'Token:', !!accessToken);
      const r = await fetchWithAuth(`${base}/unidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('🔧 Resposta da unidade - Status:', r.status, 'OK:', r.ok);
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        console.error('❌ Erro ao criar unidade - Status:', r.status, 'Body:', body);
        throw new Error(body?.erro || `Erro criando unidade: ${r.status}`);
      }
      const unidade = await r.json();
      console.log('✅ Unidade criada com sucesso:', unidade);

      // 1) Criar fornecedores que estão com isNew === true
      const tempToRealFornecedor = {}; // tempId -> realId
      const createdFornecedores = [];
      for (const f of fornecedores) {
        if (f.isNew) {
          // envia cnpj (apenas dígitos) e telefone apenas dígitos
          const body = {
            nomeEmpresa: f.nomeEmpresa,
            descricaoEmpresa: f.descricaoEmpresa,
            cnpjCpf: f.cnpjCpf, // já guardamos apenas dígitos
            email: f.email,
            telefone: f.telefone,
            endereco: f.endereco || null
          };
          const resp = await fetchWithAuth(`${base}/fornecedores/externos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          if (!resp.ok) {
            const errBody = await resp.json().catch(() => ({}));
            // exibe erro específico se backend retornar field
            if (errBody.field) {
              // mapear para input correspondente no frontend
              setNewFornecedorErrors({ [errBody.field]: `esse ${errBody.field} ja foi cadastrado no sistema` });
              throw new Error(errBody.erro || 'Erro criando fornecedor.');
            }
            throw new Error(errBody.erro || `Erro ao criar fornecedor (${resp.status})`);
          }
          const json = await resp.json();
          const real = json.fornecedor || json; // adapta se a API retornar {fornecedor}
          tempToRealFornecedor[f.id] = real.id;
          createdFornecedores.push(real);
        } else {
          // fornecedor existente — mantemos como está
          createdFornecedores.push(f);
        }
      }

      // 2) Criar contratos, garantindo referenciar fornecedor realId quando necessário
      const createdContracts = [];
      for (const c of contracts) {
        // c.fornecedorIndex aponta para fornecedores array; pegue o fornecedor correspondente
        const fornecedor = fornecedores[c.fornecedorIndex];
        const fornecedorExternoId = fornecedor ? (fornecedor.isNew ? tempToRealFornecedor[fornecedor.id] : fornecedor.id) : null;

        const contractPayload = {
          fornecedorExternoId: fornecedorExternoId || null,
          dataInicio: c.dataInicio || new Date().toISOString().slice(0,10),
          dataFim: c.dataFim || null,
          dataEnvio: c.dataEnvio || c.dataInicio || new Date().toISOString().slice(0,10),
          status: c.status || 'ATIVO',
          frequenciaEntregas: c.frequenciaEntregas || null,
          diaPagamento: c.diaPagamento || '',
          formaPagamento: c.formaPagamento || null,
          valorTotal: c.valorTotal || null,
          itens: (c.itens || []).map(item => ({
            nome: item.nome,
            quantidade: item.quantidade,
            unidadeMedida: item.unidadeMedida,
            precoUnitario: item.precoUnitario,
            raca: item.raca,
            pesoUnidade: item.pesoUnidade,
          }))
        };

        const rc = await fetchWithAuth(`${base}/criarContratoExterno/${unidade.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contractPayload)
        });

        if (!rc.ok) {
          const body = await rc.json().catch(() => ({}));
          console.warn('Erro criando contrato no backend, pulando:', body?.erro || rc.status);
          createdContracts.push(contractPayload);
          continue;
        }
        const cc = await rc.json();
        createdContracts.push(cc);
      }

      // 3) Criar usuários novos (teamInvites isNew === true) e associar unidade
      const createdUsers = [];
      for (const u of teamInvites) {
        if (u.isNew) {
          const createBody = {
            nome: u._raw.nome,
            email: u._raw.email,
            senha: u._raw.senha,
            telefone: onlyDigits(u._raw.telefone),
            role: u.role,
            unidadeId: unidade.unidade?.id || unidade.id // Enviar o ID da unidade recém-criada
          };
          const resp = await fetchWithAuth(`${base}/usuarios/criar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createBody)
          });

          if (!resp.ok) {
            const errBody = await resp.json().catch(() => ({}));
            if (errBody.field) {
              // mostra erro inline no input correto (email/telefone)
              const msg = `esse ${errBody.field} ja foi cadastrado no sistema`;
              if (errBody.field === 'email') setNewGerenteErrors(prev => ({ ...prev, email: msg }));
              if (errBody.field === 'telefone') setNewGerenteErrors(prev => ({ ...prev, telefone: msg }));
              throw new Error(errBody.erro || 'Erro criando usuário.');
            }
            throw new Error(errBody.erro || `Erro criando usuário (${resp.status})`);
          }

          const json = await resp.json();
          createdUsers.push(json.usuario || json);
        } else {
          try {
            const updateResp = await fetchWithAuth(`${base}/usuarios/${u.backendId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ unidadeId: unidade.unidade?.id || unidade.id })
            });
            if (!updateResp.ok) {console.warn(`Falha ao associar usuário ${u.nome}:`, updateResp.status);}
          }
          catch (err) {console.warn(`Erro associando usuário ${u.nome}:`, err);}
        }
      }

  if (typeof onCreated === 'function') onCreated({ unidade, fornecedores: createdFornecedores, contratos: createdContracts, usuarios: createdUsers });
  toast.success('Fazenda criada com sucesso!');
      resetAll();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Erro durante criação da fazenda. Veja console.');
    }
    finally {setLoading(false);}
  }

const [newItems, setNewItems] = useState({});

  // Helper para garantir que newItems[contractIndex] sempre existe
  const getNewItem = (contractIndex) => {
    return newItems[contractIndex] || {};
  };

  // Unidades de medida (opções vindas do backend)
  useEffect(() => {
    if (!(open && accessToken)) {
      setUnidadesMedidaOptions([]);
      return;
    }
    async function fetchUnidadesMedida() {
      try {
        const base = String(API_URL || '').replace(/\/$/, '');
        const res = await fetchWithAuth(`${base}/unidades/unidades-medida/opcoes`, { method: 'GET' });
        if (!res.ok) return console.warn('Falha ao carregar unidades de medida:', res.status);
        const json = await res.json();
        if (!json?.sucesso) return console.warn('unidades medida retornou erro:', json);
        setUnidadesMedidaOptions(json.opcoes || []);
      } catch (err) {
        console.error('Erro buscando unidades de medida:', err);
      }
    }
    fetchUnidadesMedida();
  }, [open, accessToken, fetchWithAuth]);

function updateNewItem(contractIndex, field, value) {
  setNewItems(prev => ({
    ...prev,
    [contractIndex]: {
      ...(prev[contractIndex] || {}),
      [field]: value
    }
  }));
}

  function addItemToContract(contractIndex) {
    const item = newItems[contractIndex];
    
    // Validar que temos um nome de item
    if (!item || !item.nome || !item.nome.trim()) {
      setFormError('Nome do item é obrigatório.');
      return;
    }

    // Verificar se o item já existe NA LISTA ATUAL DE CONTRACTS (state atual)
    const nomeItemNorm = item.nome.trim().toLowerCase();
    const itensAtuais = contracts[contractIndex]?.itens || [];
    
    const jaExiste = itensAtuais.some(i => 
      (i.nome || '').trim().toLowerCase() === nomeItemNorm
    );

    if (jaExiste) {
      setFormError('Este item já foi adicionado ao contrato.');
      return;
    }

    // Se passou nas validações, adicionar o item
    setContracts(prev => {
      const copy = [...prev];
      
      // Garantir que itens existe
      if (!copy[contractIndex].itens) {
        copy[contractIndex].itens = [];
      }

      copy[contractIndex].itens.push({
        nome: item.nome.trim(),
        quantidade: item.quantidade ? Number(item.quantidade) : undefined,
        unidadeMedida: item.unidadeMedida || undefined,
        precoUnitario: item.precoUnitario ? Number(item.precoUnitario) : undefined,
        pesoUnidade: item.pesoUnidade ? Number(item.pesoUnidade) : undefined,
        raca: item.raca || undefined
      });
      
      return copy;
    });

    // Limpar o formulário do novo item
    setNewItems(prev => ({
      ...prev,
      [contractIndex]: {}
    }));
    
    setFormError('');
  }function removeItem(contractIndex, itemIndex) {
  setContracts(prev => {
    const copy = [...prev];
    copy[contractIndex].itens = copy[contractIndex].itens.filter((_, idx) => idx !== itemIndex);
    return copy;
  });
}

function updateContractField(contractIndex, field, value) {
  setContracts(prev => {
    const copy = [...prev];
    copy[contractIndex][field] = value;
    return copy;
  });
}

  // --- JSX render ---
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAll(); onOpenChange(v); }} className={cn("z-[1000]")} >
      <DialogContent className={cn(
        "w-3/4 h-[90vh] max-w-none m-0 p-0 rounded-lg z-[1000]"
      )}>
        <DialogHeader className="sr-only">
          <DialogTitle>Criar Nova Fazenda</DialogTitle>
          <DialogDescription>Preencha as informações para criar uma nova fazenda.</DialogDescription>
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
              <h2 className="text-2xl font-semibold">Criar Nova Fazenda</h2>
              <div className="flex gap-2" />
            </header>
            {/* mensagem de erro geral do step */}
            {formError && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
                {formError}
              </div>
            )}

            {/* Steps content */}
            {step === 0 && (
              <section className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input id="nome" value={nome} onChange={(e) => { setNome(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.nome; return c; }); }} placeholder="Nome da fazenda" aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "error-nome" : undefined} className={cn(errors.nome && "border-red-500 ring-1 ring-red-500")}/>
                    {errors.nome && <p id="error-nome" className="text-sm text-red-600 mt-1">{errors.nome}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input id="cnpj" value={cnpj} onChange={(e) => { setCnpj(formatCNPJ(e.target.value)); setErrors(prev => { const c = { ...prev }; delete c.cnpj; return c; }); }} placeholder="00.000.000/0000-00" aria-invalid={!!errors.cnpj} aria-describedby={errors.cnpj ? "error-cnpj" : undefined} className={cn(errors.cnpj && "border-red-500 ring-1 ring-red-500")}/>
                    {errors.cnpj && <p id="error-cnpj" className="text-sm text-red-600 mt-1">{errors.cnpj}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="focoProdutivo">Foco Produtivo *</Label>
                    <Input
                      id="focoProdutivo"
                      value={focoProdutivo}
                      onChange={(e) => { setFocoProdutivo(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.focoProdutivo; return c; }); }}
                      placeholder="Ex: Gado Leiteiro"
                      aria-invalid={!!errors.focoProdutivo}
                      aria-describedby={errors.focoProdutivo ? "error-focoProdutivo" : undefined}
                      className={cn(errors.focoProdutivo && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.focoProdutivo && <p id="error-focoProdutivo" className="text-sm text-red-600 mt-1">{errors.focoProdutivo}</p>}
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
                        // se completar 8 dígitos automaticamente busca
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
                    <Textarea id="endereco" value={endereco} onChange={(e) => { setEndereco(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.endereco; return c; }); }} className={cn("min-h-[80px]", errors.endereco && "border-red-500 ring-1 ring-red-500")} aria-invalid={!!errors.endereco} aria-describedby={errors.endereco ? "error-endereco" : undefined}/>
                    {errors.endereco && <p id="error-endereco" className="text-sm text-red-600 mt-1">{errors.endereco}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enderecoNumero">Número</Label>
                    <Input id="enderecoNumero" value={enderecoNumero} onChange={(e) => { const cleaned = e.target.value.replace(/\D/g, ''); setEnderecoNumero(cleaned); setErrors(prev => { const c = { ...prev }; delete c.enderecoNumero; return c; }); }} placeholder="Nº" />
                    {errors.enderecoNumero && <p id="error-enderecoNumero" className="text-sm text-red-600 mt-1">{errors.enderecoNumero}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input id="telefone" value={telefone} onChange={(e) => { setTelefone(formatTelefone(e.target.value)); setErrors(prev => { const c = { ...prev }; delete c.telefone; return c; }); }} placeholder="(00) 90000-0000" aria-invalid={!!errors.telefone} aria-describedby={errors.telefone ? "error-telefone" : undefined} className={cn(errors.telefone && "border-red-500 ring-1 ring-red-500")}/>
                    {errors.telefone && <p id="error-telefone" className="text-sm text-red-600 mt-1">{errors.telefone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.email; return c; }); }} aria-invalid={!!errors.email} aria-describedby={errors.email ? "error-email" : undefined} className={cn(errors.email && "border-red-500 ring-1 ring-red-500")}/>
                    {errors.email && <p id="error-email" className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Foto da Fazenda</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imagemInput"
                      />
                      <label htmlFor="imagemInput" className="cursor-pointer">
                        <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition">
                          {imagemPreview ? (
                            <img src={imagemPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      </label>
                      {imagemFile && (
                        <p className="text-xs text-gray-600 mt-2 text-center">{imagemFile.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaTotal">Área Total (ha)</Label>
                    <Input id="areaTotal" value={areaTotal} onChange={(e) => { setAreaTotal(formatArea(e.target.value)); }} placeholder="Ex: 123.45"/>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaProdutiva">Área Produtiva (ha)</Label>
                    <Input id="areaProdutiva" value={areaProdutiva} onChange={(e) => { setAreaProdutiva(formatArea(e.target.value))}} placeholder="Ex: 100.00"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                <h3 className="text-lg font-semibold">Fornecedores</h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-row gap-2">
                    {/* Campo de seleção/criação de fornecedor */}
                    <div className="space-y-2">
                      <Label htmlFor="select-fornecedor">Fornecedor *</Label>
                      <Select value={selectedFornecedorId} onValueChange={(value) => {
                          setSelectedFornecedorId(value);
                          // setIsCreatingNewFornecedor(value === "new");
                          setNewFornecedorErrors({}); // Limpar erros ao mudar de seleção
                        }}>
                        <SelectTrigger id="select-fornecedor">
                          <SelectValue placeholder="Selecionar ou criar novo fornecedor" />
                        </SelectTrigger>
                        <SelectContent className="z-[1001]">
                          {/* <SelectItem value="new">Criar Novo Fornecedor</SelectItem> */}
                          {existingFornecedores.map((f) => (
                            <SelectItem key={f.id} value={String(f.id)}>
                              {f.nomeEmpresa} {f.cnpjCpf ? `(${f.cnpjCpf})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    </div>
                    <div className="flex items-end gap-6">
                      <Button onClick={addContract}><Plus /></Button>
                      <Button variant="outline" onClick={addFornecedor}>Criar fornecedor</Button>
                    </div>
                  </div>
                  {isCreatingNewFornecedor && (
                    <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                      <h4 className="font-semibold">Dados do Novo Fornecedor</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="novo-nomeEmpresa">Nome da Empresa *</Label>
                          <Input
                            id="novo-nomeEmpresa"
                            value={newFornecedorData.nomeEmpresa}
                            onChange={(e) => setNewFornecedorData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                            className={cn(newFornecedorErrors.nomeEmpresa && "border-red-500 ring-1 ring-red-500")}
                          />
                          {newFornecedorErrors.nomeEmpresa && <p className="text-sm text-red-600 mt-1">{newFornecedorErrors.nomeEmpresa}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="novo-cnpjCpf">CNPJ</Label>
                          <Input
                            id="novo-cnpjCpf"
                            value={newFornecedorData.cnpjCpf}
                            onChange={(e) => setNewFornecedorData(prev => ({ ...prev, cnpjCpf: onlyDigits(e.target.value) }))}
                            className={cn(newFornecedorErrors.cnpjCpf && "border-red-500 ring-1 ring-red-500")}
                          />
                          {newFornecedorErrors.cnpjCpf && <p className="text-sm text-red-600 mt-1">{newFornecedorErrors.cnpjCpf}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="novo-descricaoEmpresa">Descrição da Empresa *</Label>
                        <Textarea
                          id="novo-descricaoEmpresa"
                          value={newFornecedorData.descricaoEmpresa}
                          onChange={(e) => setNewFornecedorData(prev => ({ ...prev, descricaoEmpresa: e.target.value }))}
                          className={cn("min-h-[80px]", newFornecedorErrors.descricaoEmpresa && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newFornecedorErrors.descricaoEmpresa && <p className="text-sm text-red-600 mt-1">{newFornecedorErrors.descricaoEmpresa}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="novo-email">Email *</Label>
                          <Input
                            id="novo-email"
                            type="email"
                            value={newFornecedorData.email}
                            onChange={(e) => setNewFornecedorData(prev => ({ ...prev, email: e.target.value }))}
                            className={cn(newFornecedorErrors.email && "border-red-500 ring-1 ring-red-500")}
                          />
                          {newFornecedorErrors.email && <p className="text-sm text-red-600 mt-1">{newFornecedorErrors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="novo-telefone">Telefone *</Label>
                          <Input
                            id="novo-telefone"
                            value={newFornecedorData.telefone}
                            onChange={(e) => setNewFornecedorData(prev => ({ ...prev, telefone: formatTelefone(e.target.value) }))}
                            className={cn(newFornecedorErrors.telefone && "border-red-500 ring-1 ring-red-500")}
                          />
                          {newFornecedorErrors.telefone && <p className="text-sm text-red-600 mt-1">{newFornecedorErrors.telefone}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="novo-endereco">Endereço</Label>
                        <Textarea
                          id="novo-endereco"
                          value={newFornecedorData.endereco}
                          onChange={(e) => setNewFornecedorData(prev => ({ ...prev, endereco: e.target.value }))}
                          className={cn("min-h-[80px]", newFornecedorErrors.endereco && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newFornecedorErrors.endereco && <p className="text-sm text-red-600 mt-1">{newFornecedorErrors.endereco}</p>}
                      </div>
                    </div>
                  )}
                </div>



                {errors.contracts && <p className="text-sm text-red-600">{errors.contracts}</p>}

                <div>
                  <h4 className="font-medium">Lista de fornecedores</h4>
                  <ul className="mt-2 space-y-2">
                    {fornecedores.map((f, i) => (
                      <li key={i} className="p-2 border rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">{f.nome}</div>
                            <div className="text-sm text-muted-foreground">{f.documento || '-'} • {f.contato || '-'}</div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Button variant="ghost" onClick={() => setFornecedores(prev => prev.filter((_, idx) => idx !== i))}>Remover</Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

               <div>
  <h4 className="font-medium">Contratos</h4>

  <ul className="mt-2 space-y-4">
    {contracts.map((c, i) => (
      <li key={i} className="p-3 border rounded-lg space-y-4 bg-muted/30">

        {/* CABEÇALHO DO CONTRATO */}
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold text-lg">{c.nomeContrato}</div>
            <div className="text-sm text-muted-foreground">
              Fornecedor: {fornecedores[c.fornecedorIndex]?.nomeEmpresa || '—'}
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() =>
              setContracts(prev => prev.filter((_, idx) => idx !== i))
            }
          >
            Remover
          </Button>
        </div>

        {/* CAMPOS OBRIGATÓRIOS DO SCHEMA */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm">Data de Início</label>
            <Input
              type="date"
              value={c.dataInicio || ""}
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="text-sm">Data de Envio</label>
            <Input
              type="date"
              value={c.dataEnvio || ""}
              onChange={(e) =>
                updateContractField(i, "dataEnvio", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm">Duração do Contrato</label>
            <Select
              value={c.duration || ""}
              onValueChange={(v) => {
                updateContractField(i, 'duration', v);
                const start = c.dataInicio || new Date().toISOString().slice(0,10);
                const end = computeContractEndDate(start, v);
                updateContractField(i, 'dataFim', end);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
                <SelectContent className="z-[1001]">
                <SelectItem value="__SELECIONE__">Selecione</SelectItem>
                <SelectItem value="6m">6 meses</SelectItem>
                <SelectItem value="1y">1 ano</SelectItem>
                <SelectItem value="2y">2 anos</SelectItem>
                <SelectItem value="5y">5 anos</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-2">
              <label className="text-sm">Data de Fim</label>
              <Input className="w-full " type="date" value={c.dataFim || ""} disabled readOnly />
            </div>
          </div>

          <div>
            <label className="text-sm">Frequência de Entregas</label>
            <Select
              value={c.frequenciaEntregas || ""}
              onValueChange={(v) => updateContractField(i, 'frequenciaEntregas', v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="z-[1001]">
                <SelectItem value="__SELECIONE__">Selecione</SelectItem>
                {frequenciaOptions.length > 0 ? (
                  frequenciaOptions.map(opt => (
                    <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="SEMANALMENTE">Semanalmente</SelectItem>
                    <SelectItem value="QUINZENAL">Quinzenal</SelectItem>
                    <SelectItem value="MENSALMENTE">Mensalmente</SelectItem>
                    <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                    <SelectItem value="SEMESTRAL">Semestral</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm">Dia do Pagamento</label>
            <Input
              className="w-full"
              type="number"
              min={1}
              max={31}
              placeholder="1 a 31"
              value={c.diaPagamento || ""}
              onChange={(e) => {
                const val = e.target.value;
                const cleaned = val.replace(/\D/g, '');
                const num = cleaned ? parseInt(cleaned, 10) : '';
                if (num === '' || (num >= 1 && num <= 31)) {
                  updateContractField(i, "diaPagamento", String(num));
                }
              }}
            />
          </div>

          <div>
            <label className="text-sm">Forma de Pagamento</label>
            <Select
              value={c.formaPagamento || ""}
              onValueChange={(v) => updateContractField(i, 'formaPagamento', v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="z-[1001] ">
                <SelectItem value="__SELECIONE__">Selecione</SelectItem>
                {formaPagamentoOptions.length > 0 ? (
                  formaPagamentoOptions.map(opt => (
                    <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="CARTAO">Cartão</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* -------- ITENS DO CONTRATO ---------- */}
        <div className="pt-3 border-t">
          <h5 className="font-medium mb-2">Itens do Contrato</h5>

          {/* LISTA DE ITENS EXISTENTES */}
          <ul className="space-y-2">
            {c.itens?.map((item, idx) => (
              <li
                key={idx}
                className="border rounded p-2 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{item.nome}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.quantidade} {item.unidadeMedida} —
                    R$ {item.precoUnitario}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => removeItem(i, idx)}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>

          {/* FORM PARA NOVO ITEM */}
          <div className="grid grid-cols-3 gap-3 mt-3 p-3 rounded border">
            <Input
              placeholder="Nome do item"
              value={getNewItem(i).nome || ""}
              onChange={(e) => updateNewItem(i, "nome", e.target.value)}
            />

            <Input
              placeholder="Qtd"
              value={getNewItem(i).quantidade || ""}
              onChange={(e) => updateNewItem(i, "quantidade", e.target.value.replace(/\D/g, ''))}
            />

            <Select
              value={getNewItem(i).unidadeMedida || ""}
              onValueChange={(v) => updateNewItem(i, "unidadeMedida", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unid" />
              </SelectTrigger>
              <SelectContent className="z-[1002]">
                {unidadesMedidaOptions && unidadesMedidaOptions.length > 0 ? (
                  unidadesMedidaOptions.map((opcao) => (
                    <SelectItem key={opcao.valor || opcao.label} value={opcao.valor}>
                      {opcao.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="UNIDADE">UNIDADE</SelectItem>
                    <SelectItem value="LITRO">LITRO</SelectItem>
                    <SelectItem value="TONELADA">TONELADA</SelectItem>
                    <SelectItem value="METRO">METRO</SelectItem>
                    <SelectItem value="METRO_QUADRADO">METRO²</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            <Input
              placeholder="Preço Unitário"
              value={getNewItem(i).precoUnitario || ""}
              onChange={(e) => updateNewItem(i, "precoUnitario", e.target.value.replace(/[^\d.,]/g, '').replace(/,/g, '.'))}
            />

            <Input
              placeholder="Peso por unidade"
              value={getNewItem(i).pesoUnidade || ""}
              onChange={(e) => updateNewItem(i, "pesoUnidade", e.target.value.replace(/[^\d.,]/g, '').replace(/,/g, '.'))}
            />

            <Input
              placeholder="Raça (opcional)"
              value={getNewItem(i).raca || ""}
              onChange={(e) => updateNewItem(i, "raca", e.target.value)}
            />

            <Button
              className="col-span-3"
              onClick={() => addItemToContract(i)}
            >
              Adicionar Item
            </Button>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>


                {/* <div className="flex items-center justify-between pt-4"> */}
                {/* <Button variant="outline" onClick={handleBack}>Voltar</Button> */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack}>Voltar</Button>
                  {/* <Button variant="ghost" onClick={() => { resetAll(); onOpenChange(false); }}>Cancelar</Button> */}
                  <Button onClick={handleNext}>Próximo</Button>
                </div>
                {/* </div> */}
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6">
                <h3 className="text-lg font-semibold">Convidar equipe</h3>
                <div className="space-y-4">
                  <h4 className="font-semibold">Gerente *</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Será criado um novo gerente para esta fazenda. Preencha os dados abaixo.</p>
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
                  <p className="text-sm text-muted-foreground">Funcionários não podem ser associados a múltiplas fazendas. Apenas crie novos.</p>
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
                          <div className="font-semibold">{u.nome} — {u.role === "GERENTE_FAZENDA" ? "Gerente" : "Funcionário"}</div>
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
                  <Button onClick={handleSubmitAll} disabled={loading}>{loading ? 'Criando...' : 'Concluir e Criar Fazenda'}</Button>
                </div>
              </section>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}
