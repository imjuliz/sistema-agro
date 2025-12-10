"use client"
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { buildImageUrl } from '@/lib/image';
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MessageSquare, Plus, Sliders, Pen, Trash, Eye, EyeOff } from 'lucide-react';
import { useAppearance } from "@/contexts/AppearanceContext"; // Importar useAppearance

// Função para formatar telefone
const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  const cleaned = telefone.replace(/\D/g, '');
  if (cleaned.length === 11) { return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`; }
  else if (cleaned.length === 10) { return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`; }
  return telefone;
};

// Função para formatar telefone enquanto digita
const formatarTelefoneInput = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  return value;
};

export default function FuncionariosFazenda() {
  const { fetchWithAuth, user } = useAuth();
  usePerfilProtegido("GERENTE_LOJA");

  // Estados principais
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  // Estados de filtros temporários (para o popover)
  const [tempTypeFilters, setTempTypeFilters] = useState({ "GERENTE_LOJA": true, "FUNCIONARIO_LOJA": true, });
  const [tempStatusFilters, setTempStatusFilters] = useState({ "Ativo": true, "Inativo": false, });

  // Estados de filtros aplicados (usados para filtrar a lista)
  const [typeFilters, setTypeFilters] = useState({ "GERENTE_LOJA": true, "FUNCIONARIO_LOJA": true, });
  const [statusFilters, setStatusFilters] = useState({ "Ativo": true, "Inativo": false, });

  // Controle do popover para sincronizar filtros temporários quando aberto
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Estados de modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para edição
  const [editingData, setEditingData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    role: 'FUNCIONARIO_LOJA',
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Estados para convidar novo usuário
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ nome: '', email: '', telefone: '', senha: '', role: 'FUNCIONARIO_LOJA' });
  const [inviteSaving, setInviteSaving] = useState(false);
  const [showInvitePassword, setShowInvitePassword] = useState(false);

  // função reutilizável para carregar funcionários
  const loadFuncionarios = async () => {
    if (!user?.unidadeId) return;
    try {
      setLoadingFuncionarios(true);
      const url = `${API_URL}/usuarios/unidade/listar`;
      const res = await fetchWithAuth(url);
      const jsonResponse = await res.json();
      if (!res.ok) {
        console.error("[FuncionariosLoja] HTTP Error:", { status: res.status, data: jsonResponse });
        return;
      }
      if (jsonResponse.sucesso && jsonResponse.usuarios) {
        const filtered = jsonResponse.usuarios.filter(u => u.perfil?.funcao === "GERENTE_LOJA" || u.perfil?.funcao === "FUNCIONARIO_LOJA");
        setFuncionarios(filtered);
      }
    } catch (error) { console.error("[FuncionariosLoja] Erro ao carregar funcionários:", error); }
    finally { setLoadingFuncionarios(false); }
  };

  useEffect(() => { loadFuncionarios(); }, [user?.unidadeId, fetchWithAuth]);

  // Funções de filtro
  // Funções para alterar filtros temporários
  const toggleType = (type) => {
    setTempTypeFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleStatus = (status) => {
    setTempStatusFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Aplicar filtros (chamado ao clicar em "Aplicar")
  const applyFilters = () => {
    setTypeFilters(tempTypeFilters);
    setStatusFilters(tempStatusFilters);
  };

  // Resetar filtros
  const resetFilters = () => {
    const defaults = { "GERENTE_LOJA": true, "FUNCIONARIO_LOJA": true, };
    const defaultStatus = { "Ativo": true, "Inativo": false, };
    setTempTypeFilters(defaults);
    setTempStatusFilters(defaultStatus);
    setTypeFilters(defaults);
    setStatusFilters(defaultStatus);
    setQuery('');
  };

  // Filtrar funcionários
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return funcionarios.filter(f => {
      const matchQuery = q === '' ||
        f.nome.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.telefone?.includes(q);

      const matchType = !!typeFilters[f.perfil?.funcao];

      // Determinar status do funcionário (ativo/inativo)
      const statusLabel = f.status === true || f.status === 'ativo' ? "Ativo" : "Inativo";
      const matchStatus = !!statusFilters[statusLabel];
      return matchQuery && matchType && matchStatus;
    });
  }, [funcionarios, query, typeFilters, statusFilters]);

  // Abrir modal de edição
  const handleEditClick = (user) => {
    if (!isGerenteLoja) {
      toast.error("Você não tem permissão para editar este usuário.");
      return;
    }
    setSelectedUser(user);
    setEditingData({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || '',
      senha: '',
      role: user.perfil?.funcao || 'FUNCIONARIO_LOJA',
    });
    setIsEditModalOpen(true);
  };

  // Salvar edições
  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      setSavingEdit(true);
      const payload = {
        nome: editingData.nome,
        email: editingData.email,
        telefone: editingData.telefone,
        role: editingData.role,
        unidadeId: user?.unidadeId,
      };
      if (editingData.senha && editingData.senha.trim()) {
        payload.senha = editingData.senha.trim();
      }
      const res = await fetchWithAuth(`${API_URL}/usuarios/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await res.json().catch(() => ({}));

      if (res.ok && (response.sucesso !== false)) {
        // Atualizar lista local
        setFuncionarios(prev => prev.map(f =>
          f.id === selectedUser.id
            ? { ...f, ...editingData }
            : f
        ));
        setIsEditModalOpen(false);
        setSelectedUser(null);
        toast.success('Usuário atualizado.');
      } else {
        console.error("Erro na resposta:", res.status, response);
        const mensagemErro = response.erro || response.mensagem || "Erro ao salvar as edições";
        toast.error(mensagemErro);
      }
    } catch (error) {
      console.error("Erro ao salvar edições:", error);
      toast.error("Erro ao salvar as edições");
    }
    finally { setSavingEdit(false); }
  };

  // Abrir modal de deleção
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Deletar funcionário
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetchWithAuth(`${API_URL}/usuarios/${selectedUser.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unidadeId: user?.unidadeId }),
      });

      const response = await res.json().catch(() => ({}));

      if (res.ok && (response.sucesso !== false)) {
        // Remover da lista local
        setFuncionarios(prev => prev.filter(f => f.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        toast.success('Usuário removido.');
      } else {
        console.error("Erro na resposta:", res.status, response);
        const mensagemErro = response.erro || response.mensagem || "Erro ao deletar funcionário";
        toast.error(mensagemErro);
      }
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      toast.error("Erro ao deletar funcionário");
    }
  };

  // Invite modal handlers
  const openInviteModal = () => setIsInviteModalOpen(true);
  const closeInviteModal = () => setIsInviteModalOpen(false);

  const handleInviteChange = (field, value) => { setInviteData(prev => ({ ...prev, [field]: value })); };

  const submitInvite = async () => {
    if (!user || user.perfil?.funcao?.toUpperCase() !== 'GERENTE_LOJA') {
      toast.error('Você não tem permissão para convidar.');
      return;
    }
    setInviteSaving(true);
    try {
      const url = `${API_URL}/usuarios/criar`;
      const payload = {
        nome: inviteData.nome,
        email: inviteData.email,
        telefone: inviteData.telefone,
        senha: inviteData.senha,
        role: inviteData.role,
        unidadeId: user?.unidadeId,
      };
      const res = await fetchWithAuth(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('[FuncionariosLoja] Erro ao convidar:', json);
        toast.error(json?.erro || 'Erro ao convidar usuário.');
        return;
      }
      if (json.sucesso) {
        closeInviteModal();
        setInviteData({ nome: '', email: '', telefone: '', senha: '', role: 'FUNCIONARIO_LOJA' });
        await loadFuncionarios();
        toast.success('Usuário convidado com sucesso.');
      } else {
        toast.error(json?.erro || 'Erro ao convidar usuário.');
      }
    } catch (err) { console.error('[FuncionariosLoja] submitInvite error', err); }
    finally { setInviteSaving(false); }
  };

  // Verificar se é gerente da loja (tolerante a diferentes formatos)
  const _userRoleRaw = user?.perfil?.funcao ?? user?.perfil ?? user?.role ?? '';
  const _userRole = typeof _userRoleRaw === 'string' ? _userRoleRaw.toUpperCase() : '';
  const isGerenteLoja = _userRole === 'GERENTE_LOJA';

  return (
    <div className="min-h-screen px-18 py-10 bg-surface-50">
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header com busca e filtros */}
        <div className="space-y-4">
          <div className="flex flex-row items-start gap-3">
            <div className="relative w-full">
              <Input placeholder="Buscar por nome, email ou telefone" value={query} onChange={e => setQuery(e.target.value)} />
            </div>

            {/* Filtros avançados */}
            <Popover open={popoverOpen} onOpenChange={(v) => {
              // quando abrir o popover, sincroniza os temporários com os filtros aplicados
              if (v) {
                setTempTypeFilters(typeFilters);
                setTempStatusFilters(statusFilters);
              }
              setPopoverOpen(v);
            }}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 px-3">
                  <Sliders className="h-4 w-4" />Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-[320px] p-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Filtros Avançados</h2>
                  <p className="text-sm text-neutral-400">{filtered.length} resultados</p>
                </div>

                <div className="space-y-3">
                  {/* Função */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Função</div>
                    <div className="grid grid-cols-1 gap-1">
                      {["GERENTE_LOJA", "FUNCIONARIO_LOJA"].map(t => (
                        <label key={t} className="flex items-center justify-between px-2 py-1 rounded hover:dark:bg-neutral-900 hover:bg-neutral-100 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Checkbox checked={!!tempTypeFilters[t]} onCheckedChange={(checked) => setTempTypeFilters(prev => ({ ...prev, [t]: !!checked }))} />
                            <div className="capitalize text-sm">{t === "GERENTE_LOJA" ? "Gerente" : "Funcionário"}</div>
                          </div>
                          <div className="text-sm text-neutral-400">
                            {funcionarios.filter(f => f.perfil?.funcao === t).length}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />

                  {/* Status */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <div className="flex flex-col gap-1">
                      {["Ativo", "Inativo"].map(s => (
                        <label key={s} className="flex items-center gap-2 px-2 py-1 rounded hover:dark:bg-neutral-900 hover:bg-neutral-10 cursor-pointer">
                          <Checkbox checked={!!tempStatusFilters[s]} onCheckedChange={(checked) => setTempStatusFilters(prev => ({ ...prev, [s]: !!checked }))} />
                          <p className="text-sm">{s}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />

                  {/* Botões */}
                  <div className="flex items-center justify-between gap-2">
                    <Button size="sm" onClick={() => { applyFilters(); setPage(1); setPopoverOpen(false); }}>Aplicar</Button>
                    <Button size="sm" variant="ghost" onClick={() => { resetFilters(); setPopoverOpen(false); }}>Limpar</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button className='w-fit' size="sm" onClick={openInviteModal} disabled={!isGerenteLoja}><Plus className="w-4 h-4" />Convidar</Button>
          </div>
        </div>

        {/* Lista de funcionários */}
        {loadingFuncionarios ? (
          <h1 className="text-center py-8 text-muted-foreground">Carregando funcionários...</h1>
        ) : filtered.length === 0 ? (
          <h1 className="text-center py-8 text-muted-foreground">Nenhum funcionário encontrado</h1>
        ) : (
          filtered.map((func) => (
            <Card key={func.id} className="p-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="size-12">
                      <AvatarImage src={buildImageUrl(func.avatar)} alt={func.nome} />
                      <AvatarFallback>{func.nome.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-lg">{func.nome}</h3>
                        <Badge variant={func.perfil?.funcao === "GERENTE_LOJA" ? "default" : "secondary"}>
                          {func.perfil?.funcao === "GERENTE_LOJA" ? "Gerente" : "Funcionário"}
                        </Badge>
                        <Badge variant={func.status ? "outline" : "destructive"}>
                          {func.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2 text-sm">{func.perfil?.descricao}</p>
                    </div>
                  </div>

                  {/* Botões de ação (apenas para Gerente) */}
                  {isGerenteLoja && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(func)}>
                        <Pen className="size-4 mr-2" /><h2>Editar</h2>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(func)}>
                        <Trash className="size-4 mr-2" /><h2>Demitir</h2>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Contatos */}
                <div className="flex flex-wrap gap-6 mb-4">
                  <div>
                    <h1 className="text-sm font-medium text-muted-foreground mb-2">Contatos</h1>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="size-4 text-muted-foreground" />
                        <span>{func.email}</span>
                      </div>
                      {func.telefone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-4 text-muted-foreground" />
                          <span>{formatarTelefone(func.telefone)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isGerenteLoja && (
                    <div>
                      <h2 className="text-sm font-medium text-muted-foreground mb-2">Ações Rápidas</h2>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="size-4 mr-2" />Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="size-4 mr-2" /> Ligar
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="size-4 mr-2" /> Mensagem
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">Nome</Label>
              <Input id="nome" value={editingData.nome} onChange={e => setEditingData({ ...editingData, nome: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" value={editingData.email} onChange={e => setEditingData({ ...editingData, email: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefone" className="text-right">Telefone</Label>
              <Input id="telefone" value={editingData.telefone} onChange={e => setEditingData({ ...editingData, telefone: formatarTelefoneInput(e.target.value) })} className="col-span-3" placeholder="(XX) XXXXX-XXXX" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="senha" className="text-right">Senha (opcional)</Label>
              <div className="col-span-3 relative">
                <Input id="senha" type={showEditPassword ? "text" : "password"} value={editingData.senha} onChange={e => setEditingData({ ...editingData, senha: e.target.value })} />
                <button type="button" onClick={() => setShowEditPassword(!showEditPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Função</Label>
              <Select value={editingData.role} onValueChange={(v) => setEditingData(prev => ({ ...prev, role: v }))} className="col-span-3">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GERENTE_LOJA">Gerente</SelectItem>
                  <SelectItem value="FUNCIONARIO_LOJA">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={savingEdit}>{savingEdit ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de deleção */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Demissão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h2 className="text-sm text-muted-foreground">
              Tem certeza que deseja demitir <strong>{selectedUser?.nome}</strong>? Esta ação não pode ser desfeita.
            </h2>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Demitir </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Convidar */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Convidar Usuário</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-nome" className="text-right">Nome</Label>
              <Input id="invite-nome" value={inviteData.nome} onChange={e => handleInviteChange('nome', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-email" className="text-right">Email</Label>
              <Input id="invite-email" type="email" value={inviteData.email} onChange={e => handleInviteChange('email', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-telefone" className="text-right">Telefone</Label>
              <Input id="invite-telefone" value={inviteData.telefone} onChange={e => handleInviteChange('telefone', formatarTelefoneInput(e.target.value))} className="col-span-3" placeholder="(XX) XXXXX-XXXX" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-senha" className="text-right">Senha</Label>
              <div className="col-span-3 relative">
                <Input id="invite-senha" type={showInvitePassword ? "text" : "password"} value={inviteData.senha} onChange={e => handleInviteChange('senha', e.target.value)} />
                <button type="button" onClick={() => setShowInvitePassword(!showInvitePassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showInvitePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-role" className="text-right">Função</Label>
              <Select value={inviteData.role} onValueChange={(v) => handleInviteChange('role', v)} className="col-span-3">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GERENTE_LOJA">Gerente</SelectItem>
                  <SelectItem value="FUNCIONARIO_LOJA">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancelar</Button>
            <Button onClick={submitInvite} disabled={inviteSaving}>{inviteSaving ? 'Enviando...' : 'Convidar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}