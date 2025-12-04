'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

export default function AnimaisPage() {
  const { user, fetchWithAuth } = useAuth();
  usePerfilProtegido('GERENTE_FAZENDA');

  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [newAnimal, setNewAnimal] = useState({
    animal: '',
    raca: '',
    sku: '',
    quantidade: null,
    tipo: '',
    custo: null,
    loteId: null,
  });

  useEffect(() => {
    if (!user?.unidadeId) return;
    fetchAnimais();
  }, [user?.unidadeId]);

  async function fetchAnimais() {
    try {
      setLoading(true);
      const url = `${API_URL}animais`;
      const res = await fetchWithAuth(url);
      if (res.ok) {
        const data = await res.json();
        // backend can return different shapes:
        // 1) { animais: [ ... ] }
        // 2) { animais: { sucesso: true, animais: [ ... ] } }
        // 3) directly an array
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.animais)) {
          list = data.animais;
        } else if (data.animais && Array.isArray(data.animais.animais)) {
          list = data.animais.animais;
        } else {
          console.warn('Unexpected animais response shape:', data);
        }

        const userUnidadeId = Number(user?.unidadeId);
        const animaisDaUnidade = list.filter(a => Number(a.unidadeId) === userUnidadeId);
        setAnimais(animaisDaUnidade);
      } else {
        console.error('Erro ao buscar animais:', res.status);
      }
    } catch (e) {
      console.error('Erro ao buscar animais:', e);
    } finally {
      setLoading(false);
    }
  }

  function filtered() {
    const q = query.trim().toLowerCase();
    return animais.filter(a => {
      if (filterStatus && a.status !== filterStatus) return false;
      if (!q) return true;
      const name = (a.animal || '').toString().toLowerCase();
      const raca = (a.raca || '').toString().toLowerCase();
      const sku = (a.sku || '').toString().toLowerCase();
      return name.includes(q) || raca.includes(q) || sku.includes(q);
    });
  }

  const filteredItems = filtered();
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));
  const paginatedItems = filteredItems.slice((page - 1) * perPage, page * perPage);

  function fmtBRL(value) {
    if (value == null || value === '') return '-';
    try {
      const n = Number(value);
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch { return String(value); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const url = `${API_URL}animais`;
      const payload = {
        animal: newAnimal.animal,
        raca: newAnimal.raca,
        sku: newAnimal.sku,
        quantidade: newAnimal.quantidade ? Number(newAnimal.quantidade) : null,
        tipo: newAnimal.tipo || null,
        custo: newAnimal.custo != null ? Number(newAnimal.custo) : null,
        loteId: newAnimal.loteId ? Number(newAnimal.loteId) : null,
        unidadeId: user?.unidadeId,
      };
      const res = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setNewAnimal({ animal: '', raca: '', sku: '', quantidade: null, tipo: '', custo: null, loteId: null });
        setRegisterOpen(false);
        await fetchAnimais();
      } else {
        console.error('Erro ao registrar animal', res.status);
      }
    } catch (e) {
      console.error('Erro ao registrar animal', e);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Animais</h1>
          <p className="text-sm text-muted-foreground">Lista de animais da fazenda — nome, raça, sku, tipo, quantidade e custo.</p>
        </div>

        <div className="flex gap-2 items-center">
          <Input placeholder="Buscar por nome, raça, sku..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />

          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v === '__NONE__' ? '' : v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__NONE__">Todos</SelectItem>
              <SelectItem value="ATIVO">Ativo</SelectItem>
              <SelectItem value="INATIVO">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isRegisterOpen} onOpenChange={setRegisterOpen}>
            <DialogTrigger asChild>
              <Button>Registrar Animal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar Novo Animal</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleRegister} className="space-y-3 py-2">
                <div>
                  <Label>Nome</Label>
                  <Input value={newAnimal.animal} onChange={(e) => setNewAnimal({ ...newAnimal, animal: e.target.value })} />
                </div>
                <div>
                  <Label>Raça</Label>
                  <Input value={newAnimal.raca} onChange={(e) => setNewAnimal({ ...newAnimal, raca: e.target.value })} />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input value={newAnimal.sku} onChange={(e) => setNewAnimal({ ...newAnimal, sku: e.target.value })} />
                </div>
                <div>
                  <Label>Quantidade</Label>
                  <Input value={newAnimal.quantidade ?? ''} onChange={(e) => setNewAnimal({ ...newAnimal, quantidade: e.target.value })} />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Input value={newAnimal.tipo} onChange={(e) => setNewAnimal({ ...newAnimal, tipo: e.target.value })} />
                </div>
                <div>
                  <Label>Custo (BRL)</Label>
                  <Input value={newAnimal.custo ?? ''} onChange={(e) => setNewAnimal({ ...newAnimal, custo: e.target.value })} />
                </div>
                <div>
                  <Label>Lote ID</Label>
                  <Input value={newAnimal.loteId ?? ''} onChange={(e) => setNewAnimal({ ...newAnimal, loteId: e.target.value })} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setRegisterOpen(false)}>Cancelar</Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Animais da Unidade</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando animais...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Raça</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Custo</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell>
                          <div className={`w-3 h-3 rounded-full ${animal.tipo ? 'bg-emerald-500' : 'bg-neutral-300'}`}></div>
                        </TableCell>
                        <TableCell className="max-w-xs font-medium">{animal.animal ?? '-'}</TableCell>
                        <TableCell>{animal.raca ?? '-'}</TableCell>
                        <TableCell className="font-mono text-sm">{animal.sku ?? '-'}</TableCell>
                        <TableCell>{animal.tipo ?? '-'}</TableCell>
                        <TableCell>{animal.quantidade ?? '-'}</TableCell>
                        <TableCell>{fmtBRL(animal.custo)}</TableCell>
                        <TableCell>{animal.dataEntrada ? new Date(animal.dataEntrada).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => { /* abrir detalhes */ }}>Ver</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <p className="text-muted-foreground">Nenhum animal encontrado.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-4 py-3 border-t dark:border-neutral-800 border-neutral-200">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Linhas por pág.</Label>
                  <Select value={String(perPage)} onValueChange={(val) => { const v = Number(val); setPerPage(v); setPage(1); }}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm">Pág. {page} de {totalPages} | Total: {filteredItems.length}</div>
                  <div className="inline-flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setPage(1)} disabled={page === 1} aria-label="Primeira página">&laquo;</Button>
                    <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Página anterior">&lt;</Button>
                    <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próxima página">&gt;</Button>
                    <Button variant="ghost" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Última página">&raquo;</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
