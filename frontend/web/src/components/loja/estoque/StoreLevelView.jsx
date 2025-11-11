import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '../../ui/button';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"

const PRODUCTS = [
  { id: 1, name: "Arroz" },
  { id: 2, name: "Feijão" },
  { id: 3, name: "Açúcar" },
  { id: 4, name: "Farinha" },
];

function getStockStatus(current, minimum) {
  const difference = current - minimum;
  if (difference > 5) return { status: 'good', color: 'bg-green-500', textColor: 'text-green-700', badgeVariant: 'default' };
  if (difference >= -5) return { status: 'warning', color: 'bg-yellow-500', textColor: 'text-yellow-700', badgeVariant: 'secondary' };
  return { status: 'critical', color: 'bg-red-500', textColor: 'text-red-700', badgeVariant: 'destructive' };
}

export function StoreLevelView() {
  const { getStoreItems, storeMapping } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productList, setProductList] = useState([]);

  // paginacao
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // dados
  const allStoreItems = useMemo(() => getStoreItems() || [], [getStoreItems]);
  const stores = useMemo(() => Object.values(storeMapping || {}), [storeMapping]);
  const categories = useMemo(() => [...new Set(allStoreItems.map(item => item.category).filter(Boolean))], [allStoreItems]);

  // filtra os itens com base em busca, loja e categoria
  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allStoreItems.filter(item => {
      const matchesSearch = !term ||
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.sku && item.sku.toLowerCase().includes(term)) ||
        (item.brand && item.brand.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term));
      const matchesStore = selectedStore === 'all' || item.store === selectedStore;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesStore && matchesCategory;
    });
  }, [allStoreItems, searchTerm, selectedStore, selectedCategory]);

  // recalcula métricas a partir dos itens filtrados
  const totalItems = filteredItems.length;
  const goodStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'good').length;
  const warningStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'warning').length;
  const criticalStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'critical').length;

  // pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));
  useEffect(() => { setPage(p => Math.min(Math.max(1, p), totalPages)); }, [totalPages]); // sempre garante que a página atual seja válida quando filtros / perPage mudarem
  useEffect(() => { setPage(1); }, [searchTerm, selectedStore, selectedCategory, perPage]); // resetar página quando filtros mudarem (UX comum)

  // items atualmente visíveis na página
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredItems.slice(start, start + perPage);
  }, [filteredItems, page, perPage]);

  // formatação de preço BRL
  const fmtBRL = (value) => typeof value === 'number' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : value;

  const formSchema = z.object({
    name_1503609575: z.string().min(1),
    name_7375090523: z.coerce.date(),
    name_1530877542: z.array(z.string()).min(1, { error: "Please select at least one item" }),
    name_5038797387: z.string(),
    name_6456591851: z.string()
  });

  const form = useForm({ defaultValues: { "name_1530877542": ["React"], "name_7375090523": new Date() }, })

  function onSubmit(values) {
    try {
      console.log(values);
      toast(<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4"><code className="text-white">{JSON.stringify(values, null, 2)}</code></pre>);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Estoque da Loja</CardTitle>
          <Card className={'border-none shadow-none'}>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input placeholder="Pesquise por nome, SKU, ou categoria..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div>
                  <Select value={selectedStore} onValueChange={(val) => setSelectedStore(val)}>
                    <SelectTrigger className={'w-full'}><SelectValue placeholder="Selecionar loja" /></SelectTrigger>
                    <SelectContent className={'w-full'}>
                      <SelectItem value="all">Todos os fornecedores</SelectItem>
                      {stores.map(store => (<SelectItem key={store} value={store} className={'w-full'}>{store}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)} className={'w-full'}>
                    <SelectTrigger className={'w-full'}><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
                    <SelectContent className={'w-full'}>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Valor un</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map(item => {
                const stockStatus = getStockStatus(item.currentStock, item.minimumStock);
                const difference = item.currentStock - item.minimumStock;
                return (
                  <TableRow key={item.id}>
                    <TableCell><div className={`w-3 h-3 rounded-full ${stockStatus.id}`}></div></TableCell>
                    <TableCell className="max-w-xs"><div className="font-medium">{item.name}</div></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={stockStatus.textColor}>{item.currentStock}{item.unMedida}</Badge>{/* qtd e unmedida */}
                    </TableCell>
                    <TableCell>{item.store}</TableCell>{/* valor un */}
                    <TableCell className="font-mono text-sm">{item.brand} </TableCell>{/* Fornecedor */}
                    <TableCell><span className={stockStatus.textColor}></span></TableCell>{/* Situação */}
                    <TableCell><Badge variant="secondary">{item.displayStock}</Badge></TableCell>{/* lixo e editar */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum item encontrado para os filtros aplicados.</p>
            </div>
          )}
          <CardFooter className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Linhas por pág.</Label>
              <Select value={perPage} onChange={(e) => { const v = Number(e.target.value); setPerPage(v); setPage(1); }} >
                <SelectContent>
                  <SelectItem value={5}>5</SelectItem>
                  <SelectItem value={6}>6</SelectItem>
                  <SelectItem value={10}>10</SelectItem>
                  <SelectItem value={20}>20</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm">Pág. {page} de {Math.max(1, Math.ceil(filteredItems.length / perPage) || 1)}</div>
              <div className="inline-flex items-center gap-1 border-l border-neutral-800 pl-3">
                <Button variant="ghost" size="sm" onClick={() => setPage(1)} disabled={page === 1} aria-label="Primeira página" >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Página anterior" >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próxima página">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages} aria-label="Última página">
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* modal */}
            <Dialog>
              <form>
                <DialogTrigger asChild><Button variant="outline"> Repor estoque </Button></DialogTrigger>
                <DialogContent className="sm:max-w-[20%]">
                  <DialogHeader><DialogTitle> Reposição de Estoque </DialogTitle></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                      <div className="grid grid-cols-12 gap-4">

                        <div className="col-span-6">
                          <FormField control={form.control} name="name_1503609575" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do cliente</FormLabel>
                              <FormControl className={'py-0 p-0'}>
                                <Card className={'border-none shadow-none'}>
                                  <CardContent className={'px-0'}>
                                    <Select onValueChange={(value) => setSelectedProduct(value)} value={selectedProduct}>
                                      <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                      <SelectContent>
                                        {PRODUCTS.map((p) => (<SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>))}
                                      </SelectContent>
                                    </Select>
                                    {productList.length > 0 && (
                                      <div className="mt-4 space-y-3">
                                        {productList.map((item) => (
                                          <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                                            <span>{item.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FormField control={form.control} name="name_7375090523" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Quantidade</FormLabel>
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-[220px]">
                              <Input type="number" placeholder="0" {...field} className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full" />
                              <Select defaultValue="kg">
                                <SelectTrigger className="w-[70px] border-l border-gray-300 rounded-none focus:ring-0 focus:ring-offset-0">
                                  <SelectValue placeholder="Kg" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kg">Kg</SelectItem>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="l">L</SelectItem>
                                  <SelectItem value="ml">mL</SelectItem>
                                  <SelectItem value="un">un</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-12 gap-4">
                        <FormField control={form.control} name="name_7375090523" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-12 gap-4">
                        <FormField control={form.control} name="name_7375090523" render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Validade</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="col-span-6">
                          <FormField control={form.control} name="name_5038797387" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fornecedor</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="m@example.com">Fazenda Boa Vista</SelectItem>
                                  <SelectItem value="m@google.com">AgroFeliz</SelectItem>
                                  <SelectItem value="m@support.com">Mumus</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </div>
                    </form>
                  </Form>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Registrar reposição</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
