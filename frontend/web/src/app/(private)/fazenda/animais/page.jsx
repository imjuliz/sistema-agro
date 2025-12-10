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
  const [loadingLotes, setLoadingLotes] = useState(false);
  const [query, setQuery] = useState('');
  const [filterEspecie, setFilterEspecie] = useState('');
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lotes, setLotes] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    especie: '',
    raca: '',
    sku: '',
    sexo: '',
    dataNasc: '',
    peso: '',
    custo: '',
    loteId: '',
    formaAquisicao: '',
  });

  const especiesAnimal = [
    'BOVINO', 'BUBALINO', 'CAPRINO', 'OVINO', 'SUINO', 'EQUINO', 'MUAR',
    'AVE', 'GALINHA', 'PERU', 'PATO', 'GANSO', 'CODORNA',
    'COELHO', 'PEIXE','ABELHA', 'OUTRO'
  ];

  const sexosAnimal = ['MACHO', 'FEMEA'];

  const formasAquisicao = ['COMPRA', 'TRANSFERENCIA', 'DOACAO', 'NATURAL', 'OUTRO'];

  useEffect(() => {
    if (!user?.unidadeId) return;
    fetchAnimais();
    fetchLotes();
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

  async function fetchLotes() {
    try {
      setLoadingLotes(true);
      const url = `${API_URL}loteAnimalia/${user?.unidadeId}`;
      const res = await fetchWithAuth(url);
      if (res.ok) {
        const data = await res.json();
        // Filtra apenas lotes com tipoProduto === 'ANIMALIA'
        let lotesData = [];
        if (Array.isArray(data)) {
          lotesData = data;
        } else if (data.lotes && Array.isArray(data.lotes)) {
          lotesData = data.lotes;
        }
        const lotesFiltrados = lotesData.filter(l => l.tipoProduto === 'ANIMALIA');
        setLotes(lotesFiltrados);
      } else {
        console.error('Erro ao buscar lotes:', res.status);
        setLotes([]);
      }
    } catch (e) {
      console.error('Erro ao buscar lotes:', e);
      setLotes([]);
    } finally {
      setLoadingLotes(false);
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
      const url = `${API_URL}animais/completo`;
      const payload = {
        especie: newAnimal.especie,
        raca: newAnimal.raca,
        sku: newAnimal.sku,
        sexo: newAnimal.sexo || null,
        dataNasc: newAnimal.dataNasc || null,
        peso: newAnimal.peso ? String(newAnimal.peso) : null,
        custo: newAnimal.custo ? Number(newAnimal.custo) : null,
        loteId: newAnimal.loteId ? Number(newAnimal.loteId) : null,
        formaAquisicao: newAnimal.formaAquisicao || null,
        unidadeId: user?.unidadeId,
      };
      const res = await fetchWithAuth(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setNewAnimal({
          especie: '',
          raca: '',
          sku: '',
          sexo: '',
          dataNasc: '',
          peso: '',
          custo: '',
          loteId: '',
          formaAquisicao: '',
        });
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

              <form onSubmit={handleRegister} className="space-y-3 py-2 max-h-[600px] overflow-y-auto">
                {/* Espécie */}
                <div>
                  <Label><Transl>Espécie</Transl> *</Label>
                  <Select value={newAnimal.especie} onValueChange={(v) => setNewAnimal({ ...newAnimal, especie: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma espécie" />
                    </SelectTrigger>
                    <SelectContent>
                      {especiesAnimal.map((especie) => (
                        <SelectItem key={especie} value={especie}>{especie}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Raça */}
                <div>
                  <Label><Transl>Raça</Transl> *</Label>
                  <Input 
                    placeholder="Ex: Holandês, Angus, etc." 
                    value={newAnimal.raca} 
                    onChange={(e) => setNewAnimal({ ...newAnimal, raca: e.target.value })} 
                  />
                </div>

                {/* SKU */}
                <div>
                  <Label><Transl>SKU</Transl> *</Label>
                  <Input 
                    placeholder="Código único" 
                    value={newAnimal.sku} 
                    onChange={(e) => setNewAnimal({ ...newAnimal, sku: e.target.value })} 
                  />
                </div>

                {/* Sexo */}
                <div>
                  <Label><Transl>Sexo</Transl></Label>
                  <Select value={newAnimal.sexo} onValueChange={(v) => setNewAnimal({ ...newAnimal, sexo: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexosAnimal.map((sexo) => (
                        <SelectItem key={sexo} value={sexo}>{sexo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data de Nascimento */}
                <div>
                  <Label><Transl>Data de Nascimento</Transl></Label>
                  <Input 
                    type="date"
                    value={newAnimal.dataNasc} 
                    onChange={(e) => setNewAnimal({ ...newAnimal, dataNasc: e.target.value })} 
                  />
                </div>

                {/* Peso */}
                <div>
                  <Label><Transl>Peso (kg)</Transl></Label>
                  <Input 
                    type="number"
                    step="0.01"
                    placeholder="Ex: 250.50" 
                    value={newAnimal.peso} 
                    onChange={(e) => setNewAnimal({ ...newAnimal, peso: e.target.value })} 
                  />
                </div>

                {/* Custo */}
                <div>
                  <Label><Transl>Custo (BRL)</Transl></Label>
                  <Input 
                    type="number"
                    step="0.01"
                    placeholder="Ex: 1500.00" 
                    value={newAnimal.custo} 
                    onChange={(e) => setNewAnimal({ ...newAnimal, custo: e.target.value })} 
                  />
                </div>

                {/* Forma de Aquisição */}
                <div>
                  <Label><Transl>Forma de Aquisição</Transl></Label>
                  <Select value={newAnimal.formaAquisicao} onValueChange={(v) => setNewAnimal({ ...newAnimal, formaAquisicao: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma" />
                    </SelectTrigger>
                    <SelectContent>
                      {formasAquisicao.map((forma) => (
                        <SelectItem key={forma} value={forma}>{forma}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Lote */}
                <div>
                  <Label><Transl>Lote Animalia</Transl></Label>
                  {loadingLotes ? (
                    <div className="text-sm text-muted-foreground py-2">
                      <Transl>Carregando lotes...</Transl>
                    </div>
                  ) : (
                    <Select value={newAnimal.loteId} onValueChange={(v) => setNewAnimal({ ...newAnimal, loteId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um lote (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {lotes.length > 0 ? (
                          lotes.map((lote) => (
                            <SelectItem key={lote.id} value={String(lote.id)}>
                              {lote.nome} (ID: {lote.id})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">Nenhum lote disponível</div>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="ghost" onClick={() => setRegisterOpen(false)}><Transl>Cancelar</Transl></Button>
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
