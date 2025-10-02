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

export function BrandLevelView() {
  const { getBrandItems } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allBrandItems = getBrandItems();
  const brands = [...new Set(allBrandItems.map(item => item.brand))].filter(brand => brand);
  const categories = [...new Set(allBrandItems.map(item => item.category))];

  const filteredItems = allBrandItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const brandStats = brands.map(brandName => {
    const brandItems = filteredItems.filter(item => item.brand === brandName);
    const totalItems = brandItems.length;
    const goodStock = brandItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'good').length;
    const warningStock = brandItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'warning').length;
    const criticalStock = brandItems.filter(item => getStockStatus(item.currentStock, item.minimumStock).status === 'critical').length;
    const marketShare = brandItems.length > 0 ? brandItems[0].marketShare : 0;
    const totalValue = brandItems.reduce((sum, item) => sum + (item.currentStock * item.price), 0);

    return {
      brandName,
      totalItems,
      goodStock,
      warningStock,
      criticalStock,
      marketShare,
      totalValue
    };
  }).filter(stat => stat.totalItems > 0);

  return (
    <div className="space-y-6">
      {/* Brand Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brandStats.map(brand => (
          <Card key={brand.brandName}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{brand.brandName}</CardTitle>
                <Badge variant="outline">{brand.marketShare}% share</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <div className="font-medium">{brand.totalItems}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div>
                    <div className="font-medium text-green-600">{brand.goodStock}</div>
                    <div className="text-xs text-muted-foreground">Good</div>
                  </div>
                  <div>
                    <div className="font-medium text-yellow-600">{brand.warningStock}</div>
                    <div className="text-xs text-muted-foreground">Warning</div>
                  </div>
                  <div>
                    <div className="font-medium text-red-600">{brand.criticalStock}</div>
                    <div className="text-xs text-muted-foreground">Critical</div>
                  </div>
                </div>
                <div className="text-center pt-2 border-t">
                  <div className="font-medium">${brand.totalValue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Inventory Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Search Items</label>
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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
          <CardTitle>Brand Inventory Matrix</CardTitle>
          <p className="text-sm text-muted-foreground">
            Brand performance analysis driven by Display Setup configuration. Market share calculated based on item distribution across brands.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Display Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Market Share</TableHead>
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
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.marketShare}%
                      </Badge>
                    </TableCell>
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
