"use client";

import React, { useState, useCallback, useContext, useEffect } from "react";
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

/**
 * AddFazendaWizard (com fetchWithAuth usando AuthContext e API_URL)
 *
 * Regras:
 * - fetchWithAuth usa accessToken, doRefresh, setAccessToken, setUser do AuthContext.
 * - Se `input` for relativo, prefixa com API_URL.
 */

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
  const [imagemUrl, setImagemUrl] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [areaProdutiva, setAreaProdutiva] = useState("");
  const [cultura, setCultura] = useState("");
  const [horarioAbertura, setHorarioAbertura] = useState("");
  const [horarioFechamento, setHorarioFechamento] = useState("");
  const [descricaoCurta, setDescricaoCurta] = useState("");

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
  const [isCreatingNewGerente, setIsCreatingNewGerente] = useState(false);
  const [newGerenteData, setNewGerenteData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });
  const [newGerenteErrors, setNewGerenteErrors] = useState({});

  const [newFuncionarioData, setNewFuncionarioData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });
  const [newFuncionarioErrors, setNewFuncionarioErrors] = useState({});

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
    setImagemUrl(''); setAreaProdutiva(''); setAreaTotal(''); setCultura(''); setHorarioAbertura(''); setHorarioFechamento(''); setDescricaoCurta('');
    setFornecedores([]); setContracts([]); setTeamInvites([]);
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
      // o seu controller retorna { sucesso: true, cep, data: {...} } como implementado anteriormente
      if (!json?.sucesso) {
        setCepError(json?.erro || 'CEP não encontrado');
        setErrors(prev => ({ ...prev, cep: 'CEP inválido ou não encontrado.' }));
        return;
      }

      const data = json.data || json;
      // normaliza e preenche campos
      const { logradouro, complemento, bairro, localidade, uf } = data;
      const enderecoMontado = [logradouro, bairro, complemento].filter(Boolean).join(", ");
      if (enderecoMontado) setEndereco(enderecoMontado);
      if (localidade) setCidade(localidade);
      if (uf) setEstado(uf);
      // atualiza cep formatado
      setCep(json.cep || formatCEP(digits));
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
    const e = {};
    if (contracts.length === 0) e.contracts = "É necessário ao menos 1 contrato para a fazenda.";
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
  async function addFornecedor() { // Modificado para async
    setErrors(prev => { // Limpa erros gerais de contrato
      const copy = { ...prev };
      delete copy.contracts;
      return copy;
    });
    setFormError("");

    if (isCreatingNewFornecedor) {
      // Validar dados do novo fornecedor
      const errors = {};
      if (!newFornecedorData.nomeEmpresa.trim()) errors.nomeEmpresa = "Nome da empresa é obrigatório.";
      if (!newFornecedorData.descricaoEmpresa.trim()) errors.descricaoEmpresa = "Descrição da empresa é obrigatória.";
      if (!newFornecedorData.telefone.trim()) errors.telefone = "Telefone é obrigatório.";
      if (newFornecedorData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newFornecedorData.email)) errors.email = "Email inválido.";
      if (newFornecedorData.cnpjCpf && onlyDigits(newFornecedorData.cnpjCpf).length !== 14 && onlyDigits(newFornecedorData.cnpjCpf).length !== 11) errors.cnpjCpf = "CNPJ/CPF inválido (11 ou 14 dígitos).";

      if (Object.keys(errors).length > 0) {
        setNewFornecedorErrors(errors);
        return;
      }

      setNewFornecedorErrors({}); // Limpa erros se a validação passar
      setLoading(true); // Ativar loading enquanto cria o fornecedor
      try {
        const r = await fetchWithAuth(`${API_URL}fornecedores/externos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newFornecedorData,
            telefone: onlyDigits(newFornecedorData.telefone), // Envia apenas dígitos
            cnpjCpf: newFornecedorData.cnpjCpf ? onlyDigits(newFornecedorData.cnpjCpf) : null,
          }),
        });

        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body?.erro || `Erro criando fornecedor (${r.status})`);
        }
        const { fornecedor: createdFornecedor } = await r.json();
        setFornecedores(prev => [...prev, {
          id: createdFornecedor.id,
          nome: createdFornecedor.nomeEmpresa,
          documento: createdFornecedor.cnpjCpf,
          contato: createdFornecedor.telefone,
          // outros campos se necessário
        }]);

        // Resetar campos de novo fornecedor e modo
        setIsCreatingNewFornecedor(false);
        setSelectedFornecedorId(String(createdFornecedor.id)); // Seleciona o recém-criado
        setNewFornecedorData({
          nomeEmpresa: "",
          descricaoEmpresa: "",
          cnpjCpf: "",
          email: "",
          telefone: "",
          endereco: "",
        });
        // Refetch de fornecedores existentes para incluir o novo na lista
        // fetchExistingFornecedores(); // Seria ideal chamar aqui, mas o useEffect já fará no próximo open/close

      } catch (err) {
        console.error("Erro ao criar novo fornecedor:", err);
        setFormError(err.message || "Erro ao criar novo fornecedor.");
      } finally {
        setLoading(false);
      }
    } else {
      // Adicionar fornecedor existente
      if (!selectedFornecedorId) {
        setFormError("Selecione um fornecedor ou crie um novo.");
        return;
      }
      const existing = existingFornecedores.find(f => String(f.id) === selectedFornecedorId);
      if (existing) {
        // Verificar se já foi adicionado para evitar duplicatas visuais
        if (!fornecedores.some(f => f.id === existing.id)) {
          setFornecedores(prev => [...prev, {
            id: existing.id,
            nome: existing.nomeEmpresa,
            documento: existing.cnpjCpf,
            contato: existing.telefone,
          }]);
        }
      } else {
        setFormError("Fornecedor selecionado não encontrado.");
      }
    }
  }

  function addContract() {
    setErrors(prev => { // Limpa erros gerais de contrato
      const copy = { ...prev };
      delete copy.contracts;
      return copy;
    });
    setFormError("");

    if (fornecedores.length === 0) {
      setErrors(prev => ({ ...prev, contracts: 'Adicione ao menos um fornecedor antes de criar contrato.' }));
      setFormError('Adicione um fornecedor antes de criar contratos.');
      return;
    }
    const fornecedorIndex = fornecedores.length - 1; // Pega o último fornecedor adicionado
    const nomeContrato = `Contrato com ${fornecedores[fornecedorIndex].nome}`;
    setContracts(prev => [...prev, { fornecedorIndex, nomeContrato, descricao: '' }]);
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.contracts;
      return copy;
    });
    setFormError('');
  }

  // --- Funções de adição de equipe ---
  async function addTeamInvite(type) { // 'gerente' ou 'funcionario'
    setErrors({});
    setFormError("");
    setNewGerenteErrors({});
    setNewFuncionarioErrors({});

    if (type === "gerente") {
      if (isCreatingNewGerente) {
        // Validar dados do novo gerente
        const errors = {};
        if (!newGerenteData.nome.trim()) errors.nome = "Nome é obrigatório.";
        if (!newGerenteData.email.trim()) errors.email = "Email é obrigatório.";
        if (newGerenteData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newGerenteData.email)) errors.email = "Email inválido.";
        if (!newGerenteData.telefone.trim()) errors.telefone = "Telefone é obrigatório.";
        if (!newGerenteData.senha.trim()) errors.senha = "Senha é obrigatória.";

        if (Object.keys(errors).length > 0) {
          setNewGerenteErrors(errors);
          return;
        }

        setLoading(true);
        try {
          const r = await fetchWithAuth(`${API_URL}usuarios/criar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...newGerenteData,
              telefone: onlyDigits(newGerenteData.telefone),
              role: "GERENTE_FAZENDA",
              unidadeId: null, // Será associado depois na criação da fazenda
            }),
          });

          if (!r.ok) {
            const body = await r.json().catch(() => ({}));
            throw new Error(body?.erro || `Erro criando gerente (${r.status})`);
          }
          const { usuario: createdGerente } = await r.json();

          setTeamInvites(prev => [...prev, {
            id: createdGerente.id,
            nome: createdGerente.nome,
            email: createdGerente.email,
            role: "GERENTE_FAZENDA",
            isNew: true, // Indica que este é um usuário novo
            backendId: createdGerente.id, // ID retornado pelo backend
          }]);

          // Resetar campos de novo gerente e modo
          setIsCreatingNewGerente(false);
          setSelectedGerenteId(String(createdGerente.id));
          setNewGerenteData({ nome: "", email: "", telefone: "", senha: "" });
          // Atualizar lista de gerentes existentes (opcional, para refletir o recém-criado)
          setExistingGerentes(prev => [...prev, createdGerente]);

        } catch (err) {
          console.error("Erro ao criar novo gerente:", err);
          setFormError(err.message || "Erro ao criar novo gerente.");
        } finally {
          setLoading(false);
        }
      } else {
        // Adicionar gerente existente
        if (!selectedGerenteId) {
          setFormError("Selecione um gerente ou crie um novo.");
          return;
        }
        const existing = existingGerentes.find(g => String(g.id) === selectedGerenteId);
        if (existing) {
          // Verificar se já foi adicionado
          if (!teamInvites.some(u => u.id === existing.id && u.role === "GERENTE_FAZENDA")) {
            setTeamInvites(prev => [...prev, {
              id: existing.id,
              nome: existing.nome,
              email: existing.email,
              role: "GERENTE_FAZENDA",
              isNew: false, // Indica que este é um usuário existente
              backendId: existing.id,
            }]);
          } else {
            setFormError("Este gerente já foi adicionado.");
          }
        } else {
          setFormError("Gerente selecionado não encontrado.");
        }
      }
    } else if (type === "funcionario") {
      // Validar dados do novo funcionário
      const errors = {};
      if (!newFuncionarioData.nome.trim()) errors.nome = "Nome é obrigatório.";
      if (!newFuncionarioData.email.trim()) errors.email = "Email é obrigatório.";
      if (newFuncionarioData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newFuncionarioData.email)) errors.email = "Email inválido.";
      if (!newFuncionarioData.telefone.trim()) errors.telefone = "Telefone é obrigatório.";
      if (!newFuncionarioData.senha.trim()) errors.senha = "Senha é obrigatória.";

      if (Object.keys(errors).length > 0) {
        setNewFuncionarioErrors(errors);
        return;
      }

      setLoading(true);
      try {
        const r = await fetchWithAuth(`${API_URL}usuarios/criar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newFuncionarioData,
            telefone: onlyDigits(newFuncionarioData.telefone),
            role: "FUNCIONARIO_FAZENDA",
            unidadeId: null, // Será associado depois na criação da fazenda
          }),
        });

        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body?.erro || `Erro criando funcionário (${r.status})`);
        }
        const { usuario: createdFuncionario } = await r.json();

        setTeamInvites(prev => [...prev, {
          id: createdFuncionario.id,
          nome: createdFuncionario.nome,
          email: createdFuncionario.email,
          role: "FUNCIONARIO_FAZENDA",
          isNew: true,
          backendId: createdFuncionario.id,
        }]);

        // Resetar campos de novo funcionário
        setNewFuncionarioData({ nome: "", email: "", telefone: "", senha: "" });

      } catch (err) {
        console.error("Erro ao criar novo funcionário:", err);
        setFormError(err.message || "Erro ao criar novo funcionário.");
      } finally {
        setLoading(false);
      }
    }
  }

  // --- Validações por passo (ajustado para gerentes) ---
  function validateStep2Fields() {
    const e = {};
    const hasManager = teamInvites.some(u => u.role === 'GERENTE_FAZENDA');
    if (!hasManager) e.teamInvites = "É obrigatório informar um GERENTE_FAZENDA.";
    return e;
  }

  // --- Submit (usa fetchWithAuth ao invés de fetch) ---
  async function handleSubmitAll() {
    setErrors({});
    setFormError('');
    // valida step2
    const e = validateStep2Fields();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setFormError('Corrija os erros antes de enviar.');
      return;
    }

    const payload = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      cep: onlyDigits(cep).trim(),
      cidade: cidade.trim(),
      estado: estado.trim(),
      cnpj: onlyDigits(cnpj).trim() || null,
      email: email.trim() || null,
      telefone: onlyDigits(telefone).trim(),
      tipo: 'FAZENDA',
      imagemUrl: imagemUrl || null,
      areaTotal: areaTotal !== '' ? Number(areaTotal) : null,
      areaProdutiva: areaProdutiva !== '' ? Number(areaProdutiva) : null,
      cultura: cultura || null,
      horarioAbertura: horarioAbertura || null,
      horarioFechamento: horarioFechamento || null,
      descricaoCurta: descricaoCurta || null
    };

    setLoading(true);
    try {
      const r = await fetchWithAuth(`${API_URL}unidades`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error(`Erro criando unidade: ${r.status}`);
      const unidade = await r.json();

      // criar fornecedores
      const createdFornecedores = [];
      for (const f of fornecedores) { // 'fornecedores' aqui são os que foram adicionados via frontend (newFornecedorData ou existing)
        // Se for um fornecedor recém-criado, o backend já o criou. Se for existente, nada a fazer aqui.
        // O `fornecedores` do estado frontend já contém os dados necessários.
        // Esta parte pode precisar de refinamento dependendo de como o backend espera que os fornecedores sejam "associados" à unidade.
        // Por enquanto, presumo que o `fornecedores` da fazenda são apenas para exibir no frontend, e a associação é via `contrato`.
        createdFornecedores.push(f); // Apenas adiciona os fornecedores (existente ou novo) para o array de retorno.
      }

      // criar contratos
      const createdContracts = [];
      for (const c of contracts) {
        const fornecedor = createdFornecedores.find(f => f.id === c.fornecedorId) || fornecedores[c.fornecedorIndex]; // Usar o ID do fornecedor
        const contractPayload = {
          nome: c.nomeContrato,
          descricao: c.descricao || null,
          unidadeId: unidade.id,
          fornecedorId: fornecedor?.id || null, // Se for fornecedor interno
          fornecedorExternoId: fornecedor?.id || null, // Se for fornecedor externo
          // ... outros campos de contrato ...
        };
        try {
          const rc = await fetchWithAuth(`${API_URL}contratos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contractPayload)
          });
          if (!rc.ok) { console.warn('Erro criando contrato no backend, pulando'); createdContracts.push(contractPayload); continue; }
          const cc = await rc.json();
          createdContracts.push(cc);
        } catch (err) {
          console.warn('Erro criando contrato:', err);
          createdContracts.push(contractPayload);
        }
      }

      // Associar usuários da equipe à nova unidade (incluindo gerentes e funcionários)
      const finalUsers = [];
      for (const u of teamInvites) {
        try {
          // Endpoint para atualizar o unidadeId de um usuário
          const updateUrl = `${API_URL}usuarios/${u.backendId}`;
          const updateBody = { unidadeId: unidade.id }; // Associa à unidade recém-criada

          const resUpdateUser = await fetchWithAuth(updateUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateBody),
          });

          if (!resUpdateUser.ok) {
            const body = await resUpdateUser.json().catch(() => ({}));
            console.warn(`Erro ao associar usuário ${u.nome} (ID: ${u.backendId}) à unidade ${unidade.id}:`, body?.erro || resUpdateUser.status);
            finalUsers.push({ ...u, erroAssociacao: true });
          } else {
            const updatedUser = await resUpdateUser.json();
            finalUsers.push({ ...u, ...updatedUser.usuario }); // Mescla os dados atualizados
          }
        } catch (err) {
          console.warn(`Erro crítico ao associar usuário ${u.nome} à unidade:`, err);
          finalUsers.push({ ...u, erroAssociacao: true });
        }
      }

      if (typeof onCreated === 'function') onCreated({ unidade, fornecedores: createdFornecedores, contratos: createdContracts, usuarios: finalUsers });

      // mensagem de sucesso (pode trocar por um toast)
      alert('Fazenda criada com sucesso!');
      resetAll();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setFormError('Erro durante criação da fazenda. Veja console.');
    } finally {
      setLoading(false);
    }
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

  // Novo useEffect para buscar gerentes disponíveis
  useEffect(() => {
    if (open && step === 2 && accessToken) { // Garante que só busca quando o modal está aberto, no passo 3 e o usuário autenticado
      async function fetchExistingGerentes() {
        try {
          const res = await fetchWithAuth(`${API_URL}usuarios/gerentes-disponiveis`, { method: "GET" });
          if (res.ok) {
            const { gerentes } = await res.json();
            setExistingGerentes(gerentes);
          } else {
            console.error("Falha ao carregar gerentes disponíveis:", res.status);
          }
        } catch (err) {
          console.error("Erro ao buscar gerentes disponíveis:", err);
        }
      }
      fetchExistingGerentes();
    } else if (!open) { // Resetar estados quando o modal é fechado
      setExistingGerentes([]);
      setSelectedGerenteId("");
      setIsCreatingNewGerente(false);
      setNewGerenteData({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
      });
      setNewGerenteErrors({});
      setNewFuncionarioData({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
      });
      setNewFuncionarioErrors({});
    }
  }, [open, step, accessToken, fetchWithAuth]); // Dependências do useEffect

  // --- JSX render ---
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAll(); onOpenChange(v); }} className={cn("z-[1000]")}>
      <DialogContent className={cn("w-3/4 h-9/10 max-w-none m-0 p-0 rounded-lg z-[1000]")}>
        <DialogHeader className="sr-only">
          <DialogTitle>Criar Nova Fazenda</DialogTitle>
          <DialogDescription>Preencha as informações para criar uma nova fazenda.</DialogDescription>
        </DialogHeader>
        <div className="flex min-h-full overflow-hidden">
          <div className="hidden lg:block w-72 border-r">
            <Sidebar steps={steps.map((s, i) => ({ ...s, completed: i < step, current: i === step }))} />
          </div>

          <main className="flex-1 p-8 self-center overflow-auto">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => { setNome(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.nome; return c; }); }}
                      placeholder="Nome da fazenda"
                      aria-invalid={!!errors.nome}
                      aria-describedby={errors.nome ? "error-nome" : undefined}
                      className={cn(errors.nome && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.nome && <p id="error-nome" className="text-sm text-red-600 mt-1">{errors.nome}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={cnpj}
                      onChange={(e) => { setCnpj(formatCNPJ(e.target.value)); setErrors(prev => { const c = { ...prev }; delete c.cnpj; return c; }); }}
                      placeholder="00.000.000/0000-00"
                      aria-invalid={!!errors.cnpj}
                      aria-describedby={errors.cnpj ? "error-cnpj" : undefined}
                      className={cn(errors.cnpj && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.cnpj && <p id="error-cnpj" className="text-sm text-red-600 mt-1">{errors.cnpj}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Textarea
                    id="endereco"
                    value={endereco}
                    onChange={(e) => { setEndereco(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.endereco; return c; }); }}
                    className={cn("min-h-[80px]", errors.endereco && "border-red-500 ring-1 ring-red-500")}
                    aria-invalid={!!errors.endereco}
                    aria-describedby={errors.endereco ? "error-endereco" : undefined}
                  />
                  {errors.endereco && <p id="error-endereco" className="text-sm text-red-600 mt-1">{errors.endereco}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={cep}
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
                      aria-invalid={!!errors.cidade}
                      aria-describedby={errors.cidade ? "error-cidade" : undefined}
                      className={cn(errors.cidade && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.cidade && <p id="error-cidade" className="text-sm text-red-600 mt-1">{errors.cidade}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Input id="estado" value={estado} onChange={(e) => { setEstado(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.estado; return c; }); }}
                      aria-invalid={!!errors.estado}
                      aria-describedby={errors.estado ? "error-estado" : undefined}
                      className={cn(errors.estado && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.estado && <p id="error-estado" className="text-sm text-red-600 mt-1">{errors.estado}</p>}
                  </div>


                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={telefone}
                      onChange={(e) => { setTelefone(formatTelefone(e.target.value)); setErrors(prev => { const c = { ...prev }; delete c.telefone; return c; }); }}
                      placeholder="(00) 90000-0000"
                      aria-invalid={!!errors.telefone}
                      aria-describedby={errors.telefone ? "error-telefone" : undefined}
                      className={cn(errors.telefone && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.telefone && <p id="error-telefone" className="text-sm text-red-600 mt-1">{errors.telefone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => { const c = { ...prev }; delete c.email; return c; }); }}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "error-email" : undefined}
                      className={cn(errors.email && "border-red-500 ring-1 ring-red-500")}
                    />
                    {errors.email && <p id="error-email" className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imagemUrl">URL da Imagem</Label>
                    <Input id="imagemUrl" value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaTotal">Área Total (ha)</Label>
                    <Input
                      id="areaTotal"
                      value={areaTotal}
                      onChange={(e) => { setAreaTotal(formatArea(e.target.value)); }}
                      placeholder="Ex: 123.45"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaProdutiva">Área Produtiva (ha)</Label>
                    <Input
                      id="areaProdutiva"
                      value={areaProdutiva}
                      onChange={(e) => { setAreaProdutiva(formatArea(e.target.value)); }}
                      placeholder="Ex: 100.00"
                    />
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
                    {/* <Button variant="outline" onClick={() => { resetAll(); onOpenChange(false); }}>Cancelar</Button> */}
                    <Button onClick={handleNext}>Próximo</Button>
                  </div>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="space-y-6">
                <h3 className="text-lg font-semibold">Fornecedores</h3>

                <div className="grid grid-cols-1 gap-4">
                  {/* Campo de seleção/criação de fornecedor */}
                  <div className="space-y-2">
                    <Label htmlFor="select-fornecedor">Fornecedor *</Label>
                    <Select
                      value={selectedFornecedorId}
                      onValueChange={(value) => {
                        setSelectedFornecedorId(value);
                        setIsCreatingNewFornecedor(value === "new");
                        setNewFornecedorErrors({}); // Limpar erros ao mudar de seleção
                      }}
                    >
                      <SelectTrigger id="select-fornecedor">
                        <SelectValue placeholder="Selecionar ou criar novo fornecedor" />
                      </SelectTrigger>
                      <SelectContent className="z-[1001]">
                        <SelectItem value="new">Criar Novo Fornecedor</SelectItem>
                        {existingFornecedores.map((f) => (
                          <SelectItem key={f.id} value={String(f.id)}>
                            {f.nomeEmpresa} {f.cnpjCpf ? `(${f.cnpjCpf})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          <Label htmlFor="novo-cnpjCpf">CNPJ/CPF</Label>
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
                          <Label htmlFor="novo-email">Email</Label>
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

                <div className="flex gap-2">
                  <Button onClick={addFornecedor}>Adicionar fornecedor</Button>
                  <Button variant="outline" onClick={addContract}>Criar contrato com último fornecedor</Button>
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
                  <ul className="mt-2 space-y-2">
                    {contracts.map((c, i) => (
                      <li key={i} className="p-2 border rounded flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{c.nomeContrato}</div>
                          <div className="text-sm text-muted-foreground">Fornecedor: {fornecedores[c.fornecedorIndex]?.nome || '—'}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => setContracts(prev => prev.filter((_, idx) => idx !== i))}>Remover</Button>
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
                  <h4 className="font-semibold">Gerente (obrigatório)</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="select-gerente">Gerente *</Label>
                      <Select
                        value={selectedGerenteId}
                        onValueChange={(value) => {
                          setSelectedGerenteId(value);
                          setIsCreatingNewGerente(value === "new");
                          setNewGerenteErrors({});
                        }}
                      >
                        <SelectTrigger id="select-gerente">
                          <SelectValue placeholder="Selecionar ou criar novo gerente" />
                        </SelectTrigger>
                        <SelectContent className="z-[1001]">
                          <SelectItem value="new">Criar Novo Gerente</SelectItem>
                          {existingGerentes.map((g) => (
                            <SelectItem key={g.id} value={String(g.id)}>
                              {g.nome} ({g.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isCreatingNewGerente && (
                    <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                      <h4 className="font-semibold">Dados do Novo Gerente</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="novo-gerente-nome">Nome *</Label>
                          <Input
                            id="novo-gerente-nome"
                            value={newGerenteData.nome}
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
                            value={newGerenteData.email}
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
                            value={newGerenteData.telefone}
                            onChange={(e) => setNewGerenteData(prev => ({ ...prev, telefone: formatTelefone(e.target.value) }))}
                            className={cn(newGerenteErrors.telefone && "border-red-500 ring-1 ring-red-500")}
                          />
                          {newGerenteErrors.telefone && <p className="text-sm text-red-600 mt-1">{newGerenteErrors.telefone}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="novo-gerente-senha">Senha *</Label>
                          <Input
                            id="novo-gerente-senha"
                            type="password"
                            value={newGerenteData.senha}
                            onChange={(e) => setNewGerenteData(prev => ({ ...prev, senha: e.target.value }))}
                            className={cn(newGerenteErrors.senha && "border-red-500 ring-1 ring-red-500")}
                          />
                          {newGerenteErrors.senha && <p className="text-sm text-red-600 mt-1">{newGerenteErrors.senha}</p>}
                        </div>
                      </div>
                    </div>
                  )}

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
                          value={newFuncionarioData.nome}
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
                          value={newFuncionarioData.email}
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
                          value={newFuncionarioData.telefone}
                          onChange={(e) => setNewFuncionarioData(prev => ({ ...prev, telefone: formatTelefone(e.target.value) }))}
                          className={cn(newFuncionarioErrors.telefone && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newFuncionarioErrors.telefone && <p className="text-sm text-red-600 mt-1">{newFuncionarioErrors.telefone}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="novo-funcionario-senha">Senha *</Label>
                        <Input
                          id="novo-funcionario-senha"
                          type="password"
                          value={newFuncionarioData.senha}
                          onChange={(e) => setNewFuncionarioData(prev => ({ ...prev, senha: e.target.value }))}
                          className={cn(newFuncionarioErrors.senha && "border-red-500 ring-1 ring-red-500")}
                        />
                        {newFuncionarioErrors.senha && <p className="text-sm text-red-600 mt-1">{newFuncionarioErrors.senha}</p>}
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
                      <li key={u.email} className="p-2 border rounded flex justify-between items-center">
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
