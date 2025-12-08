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
import { Transl } from '@/components/TextoTraduzido/TextoTraduzido';

export default function AnimaisPage() {
  const { user, fetchWithAuth } = useAuth();
  usePerfilProtegido('GERENTE_FAZENDA');

  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filterEspecie, setFilterEspecie] = useState('');
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

  const especiesAnimal = [
    'BOVINO', 'BUBALINO', 'CAPRINO', 'OVINO', 'SUINO', 'EQUINO', 'MUAR',
    'AVE', 'GALINHA', 'PERU', 'PATO', 'MARRECO', 'GANSO', 'CODORNA',
    'COELHO', 'PEIXE', 'CAMARAO', 'ABELHA', 'OUTRO'
  ];

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
      if (filterEspecie && a.especie !== filterEspecie) return false;
      if (!q) return true;
      const name = (a.animal || '').toString().toLowerCase();
      const raca = (a.raca || '').toString().toLowerCase();
      const sku = (a.sku || '').toString().toLowerCase();
      const especie = (a.especie || '').toString().toLowerCase();
      return name.includes(q) || raca.includes(q) || sku.includes(q) || especie.includes(q);
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
          <Transl className="text-2xl font-semibold">Animais</Transl>
          <Transl className="text-sm text-muted-foreground">Lista de animais da fazenda — ID, espécie, raça, sexo, SKU, peso e lote.</Transl>
        </div>

        <div className="flex gap-2 items-center">
          <Input placeholder="Buscar por nome, raça, sku..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />

          <Select value={filterEspecie} onValueChange={(v) => setFilterEspecie(v === '__NONE__' ? '' : v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por Espécie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__NONE__">Todas as Espécies</SelectItem>
              {especiesAnimal.map((especie) => (
                <SelectItem key={especie} value={especie}>{especie}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isRegisterOpen} onOpenChange={setRegisterOpen}>
            <DialogTrigger asChild>
              <Button><Transl>Registrar Animal</Transl></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle><Transl>Registrar Novo Animal</Transl></DialogTitle>
              </DialogHeader>

              <form onSubmit={handleRegister} className="space-y-3 py-2">
                <div>
                  <Label><Transl>Nome</Transl></Label>
                  <Input value={newAnimal.animal} onChange={(e) => setNewAnimal({ ...newAnimal, animal: e.target.value })} />
                </div>
                <div>
                  <Label><Transl>Raça</Transl></Label>
                  <Input value={newAnimal.raca} onChange={(e) => setNewAnimal({ ...newAnimal, raca: e.target.value })} />
                </div>
                <div>
                  <Label><Transl>SKU</Transl></Label>
                  <Input value={newAnimal.sku} onChange={(e) => setNewAnimal({ ...newAnimal, sku: e.target.value })} />
                </div>
                <div>
                  <Label><Transl>Quantidade</Transl></Label>
                  <Input value={newAnimal.quantidade ?? ''} onChange={(e) => setNewAnimal({ ...newAnimal, quantidade: e.target.value })} />
                </div>
                <div>
                  <Label><Transl>Tipo</Transl></Label>
                  <Input value={newAnimal.tipo} onChange={(e) => setNewAnimal({ ...newAnimal, tipo: e.target.value })} />
                </div>
                <div>
                  <Label><Transl>Custo (BRL)</Transl></Label>
                  <Input value={newAnimal.custo ?? ''} onChange={(e) => setNewAnimal({ ...newAnimal, custo: e.target.value })} />
                </div>
                <div>
                  <Label><Transl>Lote ID</Transl></Label>
                  <Input value={newAnimal.loteId ?? ''} onChange={(e) => setNewAnimal({ ...newAnimal, loteId: e.target.value })} />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" onClick={() => setRegisterOpen(false)}>Cancelar</Button>
                  <Button type="submit"><Transl>Salvar</Transl></Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><Transl>Animais da Unidade</Transl></CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Transl className="text-muted-foreground">Carregando animais...</Transl>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Transl>ID</Transl></TableHead>
                    <TableHead><Transl>Espécie</Transl></TableHead>
                    <TableHead><Transl>Raça</Transl></TableHead>
                    <TableHead><Transl>Sexo</Transl></TableHead>
                    <TableHead><Transl>SKU</Transl></TableHead>
                    <TableHead><Transl>Peso</Transl></TableHead>
                    <TableHead><Transl>Lote ID</Transl></TableHead>
                    <TableHead><Transl>Ações</Transl></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-mono text-sm">{animal.id ?? '-'}</TableCell>
                        <TableCell>{animal.especie ?? '-'}</TableCell>
                        <TableCell>{animal.raca ?? '-'}</TableCell>
                        <TableCell>{animal.sexo ?? '-'}</TableCell>
                        <TableCell className="font-mono text-sm">{animal.sku ?? '-'}</TableCell>
                        <TableCell>{animal.peso ?? '-'}</TableCell>
                        <TableCell className="font-mono text-sm">{animal.loteId ?? '-'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => { /* abrir detalhes */ }}>Ver</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Transl className="text-muted-foreground">Nenhum animal encontrado.</Transl>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-4 py-3 border-t dark:border-neutral-800 border-neutral-200">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium"><Transl>Linhas por pág.</Transl></Label>
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
                  <div className="text-sm"><Transl>Pág. {page} de {totalPages} | Total: {filteredItems.length}</Transl></div>
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
