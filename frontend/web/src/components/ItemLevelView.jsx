import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

const mockItems = [
  { id: '1', name: 'Smart Refrigerator 25 cu.ft', brand: 'Samsung', category: 'Refrigerators', price: 1299.99, stock: 15, store: 'Main Store', sku: 'SAM-REF-001' },
  { id: '2', name: 'Front Load Washer', brand: 'LG', category: 'Washers', price: 899.99, stock: 3, store: 'Downtown Branch', sku: 'LG-WASH-002' },
  { id: '3', name: 'Convection Microwave', brand: 'Whirlpool', category: 'Microwaves', price: 399.99, stock: 25, store: 'Main Store', sku: 'WP-MIC-003' },
  { id: '4', name: '4-Burner Gas Range', brand: 'GE', category: 'Ranges', price: 649.99, stock: 0, store: 'Suburban Store', sku: 'GE-RNG-004' },
  { id: '5', name: 'Built-in Dishwasher', brand: 'Bosch', category: 'Dishwashers', price: 749.99, stock: 8, store: 'Main Store', sku: 'BSH-DW-005' },
  { id: '6', name: 'Window AC Unit 12K BTU', brand: 'Frigidaire', category: 'Air Conditioners', price: 449.99, stock: 22, store: 'Downtown Branch', sku: 'FRG-AC-006' },
  { id: '7', name: 'French Door Refrigerator', brand: 'Samsung', category: 'Refrigerators', price: 1599.99, stock: 2, store: 'Suburban Store', sku: 'SAM-REF-007' },
  { id: '8', name: 'Top Load Dryer', brand: 'LG', category: 'Dryers', price: 699.99, stock: 12, store: 'Main Store', sku: 'LG-DRY-008' },
];

function getStockStatus(stock) {
  if (stock > 20) return { label: 'In Stock', color: 'bg-green-500', textColor: 'text-green-700' };
  if (stock >= 5) return { label: 'Low Stock', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
  return { label: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-700' };
}

export function ItemLevelView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');

  const brands = [...new Set(mockItems.map(item => item.brand))];
  const stores = [...new Set(mockItems.map(item => item.store))];

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
    const matchesStore = selectedStore === 'all' || item.store === selectedStore;
    return matchesSearch && matchesBrand && matchesStore;
  });

  return (
    <div className="space-y-6">
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
              <label className="block mb-2">Store</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store} value={store}>{store}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const stockStatus = getStockStatus(item.stock);
          return (
            <Card key={item.id} className="relative">
              <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${stockStatus.color}`}></div>
              <CardHeader>
                <CardTitle className="pr-6">{item.name}</CardTitle>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{item.brand}</Badge>
                  <span className="text-lg font-medium">${item.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>{item.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Store:</span>
                    <span>{item.store}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">Stock:</span>
                    <div className="flex items-center gap-2">
                      <span className={stockStatus.textColor}>{item.stock} units</span>
                      <Badge variant={item.stock > 20 ? 'default' : item.stock >= 5 ? 'secondary' : 'destructive'}>
                        {stockStatus.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No items found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
