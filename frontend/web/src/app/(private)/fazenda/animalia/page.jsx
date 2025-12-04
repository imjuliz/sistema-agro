"use client"
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';
import { usePerfilProtegido } from '@/hooks/usePerfilProtegido';

// shadcn/ui components (project already uses these paths elsewhere)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// icons
import { Plus, Eye, Trash, Filter, Download, Loader2 } from 'lucide-react';

function sampleAnimals() {
  const today = new Date();
  return [
    { id: 'A-001', tag: 'A-001', name: 'Bela', breed: 'Nelore', sex: 'F', qty: 1, lote: 'Lote 1', entryDate: new Date(today.getFullYear(), today.getMonth()-1, 5).toISOString(), status: 'Ativo', weight: 350, notes: '', activities: [], movements: [] },
    { id: 'A-002', tag: 'A-002', name: 'Mimo', breed: 'Simental', sex: 'M', qty: 1, lote: 'Lote 2', entryDate: new Date(today.getFullYear(), today.getMonth()-2, 12).toISOString(), status: 'Quarentena', weight: 420, notes: '', activities: [], movements: [] },
    { id: 'A-003', tag: 'A-003', name: 'Flor', breed: 'Angus', sex: 'F', qty: 3, lote: 'Lote 1', entryDate: new Date(today.getFullYear(), today.getMonth()-3, 20).toISOString(), status: 'Venda', weight: 300, notes: '', activities: [], movements: [] },
  ];
}

export default function Animais() {
  usePerfilProtegido('GERENTE_FAZENDA');
  const { fetchWithAuth } = useAuth();

  // data
  const [animals, setAnimals] = useState(() => sampleAnimals());
  const [loading, setLoading] = useState(false);

  // UI state: filters
  const [search, setSearch] = useState('');
  const [filterLote, setFilterLote] = useState('');
  const [filterBreed, setFilterBreed] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSex, setFilterSex] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // selection / bulk actions
  const [selected, setSelected] = useState(new Set());

  // pagination & sorting
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState('entryDate');
  const [sortDir, setSortDir] = useState('desc');

  // modal / drawer
  const [openAdd, setOpenAdd] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeAnimal, setActiveAnimal] = useState(null);

  // form state for add
  const [form, setForm] = useState({ name: '', breed: '', sex: 'F', qty: 1, weight: '', entryDate: '', lote: '', notes: '', photos: [] });
  const [saving, setSaving] = useState(false);

  // derived lists for selects
  const lotes = useMemo(() => Array.from(new Set(animals.map(a => a.lote).filter(Boolean))), [animals]);
  const breeds = useMemo(() => Array.from(new Set(animals.map(a => a.breed).filter(Boolean))), [animals]);

  // Filtered & sorted list
  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    let list = animals.filter(a => {
      if (filterLote && filterLote !== 'ALL' && a.lote !== filterLote) return false;
      if (filterBreed && filterBreed !== 'ALL' && a.breed !== filterBreed) return false;
      if (filterStatus && filterStatus !== 'ALL' && a.status !== filterStatus) return false;
      if (filterSex && filterSex !== 'ALL' && a.sex !== filterSex) return false;
      if (filterDateFrom) {
        const d = new Date(a.entryDate);
        if (d < new Date(filterDateFrom)) return false;
      }
      if (filterDateTo) {
        const d = new Date(a.entryDate);
        if (d > new Date(filterDateTo)) return false;
      }
      if (!q) return true;
      return [a.tag, a.name, a.breed, a.id].some(f => String(f || '').toLowerCase().includes(q));
    });

    list.sort((x, y) => {
      const a = x[sortKey];
      const b = y[sortKey];
      if (!a && !b) return 0;
      if (!a) return sortDir === 'asc' ? -1 : 1;
      if (!b) return sortDir === 'asc' ? 1 : -1;
      if (a < b) return sortDir === 'asc' ? -1 : 1;
      if (a > b) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [animals, search, filterLote, filterBreed, filterStatus, filterSex, filterDateFrom, filterDateTo, sortKey, sortDir]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageList = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [search, filterLote, filterBreed, filterStatus, filterSex, filterDateFrom, filterDateTo]);

  // handlers
  const toggleSelect = (id) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  const toggleSelectAll = () => {
    if (selected.size === pageList.length) return setSelected(new Set());
    setSelected(new Set(pageList.map(p => p.id)));
  };

  const clearFilters = () => {
    setFilterLote(''); setFilterBreed(''); setFilterStatus(''); setFilterSex(''); setFilterDateFrom(null); setFilterDateTo(null); setSearch('');
  };

  const doAdd = async () => {
    // basic validation
    if (!form.breed || !form.entryDate || !form.lote || !form.qty) return alert('Preencha os campos obrigatórios (Raça, Data de entrada, Lote, Quantidade)');
    setSaving(true);
    try {
      // In a real app you would call backend. Here we mimic and add locally.
      const newAnimal = { id: `A-${String(Math.floor(Math.random() * 10000)).padStart(3,'0')}`, tag: form.tag ?? form.name ?? `A-${Date.now()}`, name: form.name, breed: form.breed, sex: form.sex, qty: Number(form.qty), weight: Number(form.weight || 0), lote: form.lote, entryDate: new Date(form.entryDate).toISOString(), status: 'Ativo', notes: form.notes, activities: [], movements: [] };
      setAnimals(prev => [newAnimal, ...prev]);
      setOpenAdd(false);
      setForm({ name: '', breed: '', sex: 'F', qty: 1, weight: '', entryDate: '', lote: '', notes: '', photos: [] });
    } catch (err) {
      console.error('add error', err);
      alert('Erro ao adicionar animal');
    } finally { setSaving(false); }
  };

  const openDetails = (animal) => { setActiveAnimal(animal); setOpenDrawer(true); };

  const bulkDelete = () => {
    if (!selected.size) return;
    if (!confirm(`Excluir ${selected.size} animal(is)?`)) return;
    setAnimals(prev => prev.filter(a => !selected.has(a.id)));
    setSelected(new Set());
  };

  const exportCSV = () => {
    const toExport = animals.filter(a => selected.size ? selected.has(a.id) : true);
    const csv = ['id,tag,name,breed,sex,qty,lote,entryDate,status'].concat(toExport.map(a => `${a.id},${a.tag || ''},${a.name || ''},${a.breed || ''},${a.sex || ''},${a.qty},${a.lote || ''},${a.entryDate},${a.status}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'animais.csv'; a.click(); URL.revokeObjectURL(url);
  };

  // responsive simple check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize(); window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
       
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => { setOpenAdd(true); }}><Plus className="mr-2 h-4 w-4" />Adicionar Animal</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border p-4 rounded mb-6">
        <div className="grid md:grid-cols-6 gap-3">
          <div className="md:col-span-2"><Input placeholder="Buscar por nome, tag ou raça" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div>
            <Select onValueChange={(v) => setFilterLote(v)} value={filterLote}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Lote" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {lotes.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select onValueChange={(v) => setFilterBreed(v)} value={filterBreed}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Raça" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                {breeds.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Quarentena">Quarentena</SelectItem>
                <SelectItem value="Venda">Venda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterSex} onValueChange={(v) => setFilterSex(v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Sexo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2">
            <label className="text-sm">Periodo entrada:</label>
            <Input type="date" value={filterDateFrom || ''} onChange={(e) => setFilterDateFrom(e.target.value || null)} />
            <Input type="date" value={filterDateTo || ''} onChange={(e) => setFilterDateTo(e.target.value || null)} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" onClick={clearFilters}><Filter className="mr-2 h-4 w-4" />Limpar filtros</Button>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="text-sm">{selected.size} selecionado(s)</div>
          <Button onClick={() => { /* transfer to lote placeholder */ alert('Transferir — implementar'); }}>Transferir para lote</Button>
          <Button onClick={() => { /* marcar p/ venda */ alert('Marcar para venda — implementar'); }}>Marcar para venda</Button>
          <Button variant="destructive" onClick={bulkDelete}><Trash className="mr-2 h-4 w-4" />Excluir</Button>
          <Button onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Exportar CSV</Button>
        </div>
      )}

      {/* Table / List */}
      <div className="bg-card border rounded">
        {loading ? (
          <div className="p-6"><Skeleton className="h-6 w-1/3 mb-4" /><Skeleton className="h-8" /></div>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Checkbox checked={selected.size === pageList.length && pageList.length>0} onCheckedChange={toggleSelectAll} /></TableHead>
                  <TableHead>ID/Tag</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Qtde</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageList.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="p-6 text-center">Nenhum animal encontrado</TableCell></TableRow>
                ) : (
                  pageList.map(a => (
                    <TableRow key={a.id}>
                      <TableCell><Checkbox checked={selected.has(a.id)} onCheckedChange={() => toggleSelect(a.id)} /></TableCell>
                      <TableCell>{a.tag}</TableCell>
                      <TableCell>{a.name}</TableCell>
                      <TableCell>{a.breed}</TableCell>
                      <TableCell>{a.sex}</TableCell>
                      <TableCell>{a.qty}</TableCell>
                      <TableCell>{a.lote}</TableCell>
                      <TableCell>{new Date(a.entryDate).toLocaleDateString()}</TableCell>
                      <TableCell><Badge variant={a.status === 'Ativo' ? 'secondary' : a.status === 'Venda' ? 'destructive' : 'warning'}>{a.status}</Badge></TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openDetails(a)}><Eye className="mr-2 h-4 w-4" />Ver detalhes</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* pagination */}
            <div className="flex items-center justify-between p-3">
              <div className="text-sm text-muted-foreground">{total} resultado(s)</div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Anterior</Button>
                <div>Pagina {page} / {pages}</div>
                <Button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}>Próximo</Button>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Animal Dialog */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Animal</DialogTitle>
                <DialogDescription>Preencha os dados do animal. Campos com * são obrigatórios.</DialogDescription>
              </DialogHeader>

              <form onSubmit={(e) => { e.preventDefault(); doAdd(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome (opcional)</Label>
                    <Input id="name" placeholder="Nome" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Raça *</Label>
                    <Select id="breed" value={form.breed} onValueChange={(v) => setForm(f => ({ ...f, breed: v }))}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Raça" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nelore">Nelore</SelectItem>
                        <SelectItem value="Simental">Simental</SelectItem>
                        <SelectItem value="Angus">Angus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sex">Sexo *</Label>
                    <Select id="sex" value={form.sex} onValueChange={(v) => setForm(f => ({ ...f, sex: v }))}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Sexo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="F">F</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qty">Quantidade *</Label>
                    <Input id="qty" type="number" value={form.qty} onChange={(e) => setForm(f => ({ ...f, qty: e.target.value }))} placeholder="Quantidade" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso estimado (kg)</Label>
                    <Input id="weight" type="number" value={form.weight} onChange={(e) => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="Peso estimado (kg)" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entryDate">Data de entrada *</Label>
                    <Input id="entryDate" type="date" value={form.entryDate} onChange={(e) => setForm(f => ({ ...f, entryDate: e.target.value }))} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lote">Lote *</Label>
                    <Select id="lote" value={form.lote} onValueChange={(v) => setForm(f => ({ ...f, lote: v }))}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Lote" /></SelectTrigger>
                      <SelectContent>
                        {lotes.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        <SelectItem value="Lote 1">Lote 1</SelectItem>
                        <SelectItem value="Lote 2">Lote 2</SelectItem>
                        <SelectItem value="Lote 3">Lote 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea id="notes" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Observações" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="photos">Fotos</Label>
                    <Input id="photos" type="file" multiple onChange={(e) => setForm(f => ({ ...f, photos: Array.from(e.target.files || []) }))} />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenAdd(false)}>Fechar</Button>
                  <Button type="submit" disabled={saving}>{saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
      </Dialog>

      {/* Details Drawer */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>Detalhes do Animal</DrawerTitle>
              <DrawerDescription>Visualize informações, atividades e movimentações do animal.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              {!activeAnimal ? null : (
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground">ID: {activeAnimal.id}</div>
                    <h2 className="text-xl font-semibold">{activeAnimal.name} — {activeAnimal.tag}</h2>
                    <div className="text-sm">Raça: {activeAnimal.breed} • Sexo: {activeAnimal.sex} • Lote: {activeAnimal.lote}</div>
                  </div>
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                      <TabsTrigger value="atividades">Atividades</TabsTrigger>
                      <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <div className="space-y-2">
                        <div>ID: {activeAnimal.id}</div>
                        <div>Nome: {activeAnimal.name}</div>
                        <div>Raça: {activeAnimal.breed}</div>
                        <div>Sexo: {activeAnimal.sex}</div>
                        <div>Quantidade: {activeAnimal.qty}</div>
                        <div>Peso estimado: {activeAnimal.weight} kg</div>
                        <div>Data entrada: {new Date(activeAnimal.entryDate).toLocaleDateString()}</div>
                        <div>Status: <Badge>{activeAnimal.status}</Badge></div>
                        <div>Observações: {activeAnimal.notes || '—'}</div>
                      </div>
                    </TabsContent>
                    <TabsContent value="atividades">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center"><div className="font-medium">Atividades</div><Button onClick={() => alert('Adicionar atividade — implementar')}>Adicionar atividade</Button></div>
                        {activeAnimal.activities.length === 0 ? <div className="text-sm text-muted-foreground">Nenhuma atividade registrada.</div> : (
                          activeAnimal.activities.map((it, i) => (
                            <div key={i} className="p-3 border rounded">
                              <div className="font-semibold">{it.tipo}</div>
                              <div className="text-xs text-muted-foreground">{new Date(it.data).toLocaleDateString()} — {it.responsavel}</div>
                              <div className="text-sm">{it.observacao}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="movimentacoes">
                      {activeAnimal.movements.length === 0 ? <div className="text-sm text-muted-foreground">Nenhuma movimentação.</div> : (
                        <div className="timeline space-y-4">
                          {activeAnimal.movements.map((m, i) => (
                            <div key={i} className="p-3 border rounded">
                              <div className="font-semibold">{m.tipo}</div>
                              <div className="text-xs text-muted-foreground">{new Date(m.data).toLocaleDateString()}</div>
                              <div>{m.descricao}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            <DrawerFooter>
              <div className="w-full flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpenDrawer(false)}>Fechar</Button>
                <Button onClick={() => alert('Editar — implementar')}>Editar</Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
      </Drawer>
    </div>
  );
}
