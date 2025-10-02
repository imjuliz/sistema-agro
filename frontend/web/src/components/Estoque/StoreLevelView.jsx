import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';

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

  const allStoreItems = getStoreItems();
  const stores = Object.values(storeMapping);
  const categories = [...new Set(allStoreItems.map(item => item.category))];

  const filteredItems = allStoreItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = selectedStore === 'all' || item.store === selectedStore;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesStore && matchesCategory;
  });

  const totalItems = filteredItems.length;
  const goodStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'good').length;
  const warningStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'warning').length;
  const criticalStock = filteredItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="py-0 h-fit">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-medium">{totalItems}</div>
              <div className="text-sm text-muted-foreground ml-2">Total de Itens</div>
            </div>
          </CardContent>
        </Card>
        <Card className="py-0 h-fit">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <div className="text-2xl font-medium text-green-600">{goodStock}</div>
              <div className="text-sm text-muted-foreground ml-2">Above Min</div>
            </div>
          </CardContent>
        </Card>
        <Card className="py-0 h-fit">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="text-2xl font-medium text-yellow-600">{warningStock}</div>
              <div className="text-sm text-muted-foreground ml-2">Near Min</div>
            </div>
          </CardContent>
        </Card>
        <Card className="py-0 h-fit">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <div className="text-2xl font-medium text-red-600">{criticalStock}</div>
              <div className="text-sm text-muted-foreground ml-2">Below Min</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Pesquisar Itens</label>
              <Input
                placeholder="Pesquise por nome, SKU, ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Lojas</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder="Selecionar loja" />
                </SelectTrigger>
                <SelectContent className={'w-full'}>
                  <SelectItem value="all">Todas as lojas</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store} value={store} className={'w-full'}>{store}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Categorias</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} className={'w-full'}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent className={'w-full'}>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Estoque da Loja</CardTitle>
          <p className="text-sm text-muted-foreground">
          Dados baseados na configuração de exposição. Quantidades de estoque de exibição são configuráveis na aba Configuração.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categorias</TableHead>
                <TableHead>Lojas</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Display Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(item => {
                const stockStatus = getStockStatus(item.currentStock, item.minimumStock);
                const difference = item.currentStock - item.minimumStock;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className={`w-3 h-3 rounded-full ${stockStatus.color}`}></div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.brand}</Badge>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.store}</TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <span className={stockStatus.textColor}>{item.currentStock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.displayStock}</Badge>
                    </TableCell>
                    <TableCell>{item.minimumStock}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={stockStatus.textColor}>
                          {difference > 0 ? '+' : ''}{difference}
                        </span>
                        <Badge variant={stockStatus.badgeVariant} className="text-xs">
                          {stockStatus.status === 'good' ? 'Good' : 
                           stockStatus.status === 'warning' ? 'Warning' : 'Critical'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No items found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
