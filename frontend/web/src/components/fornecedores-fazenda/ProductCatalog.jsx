'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, Truck, Eye, MessageSquare, Calendar, DollarSign, Search, Filter, Plus, Edit, Trash2, ShoppingCart, Package, Star, } from 'lucide-react';

export function ProductCatalog({ contratos = [], carregando = false }) {
  /* produtos */
  const [searchProducts, setSearchProducts] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const categoriesProducts = ['all', 'Produtos Frescos', 'Carne e Aves', 'Seafood', 'Dairy', 'Produtos de panificação', 'Beverages'];

  /* produtos */
  const products = [
    {
      id: 1,
      name: 'Premium Ribeye Steaks',
      category: 'Carne e Aves',
      price: 24.99,
      unit: 'per lb',
      stock: 45,
      supplier: 'Premium Meats Co.',
      image: '/api/placeholder/300/200',
      description: 'Bifes de ribeye de primeira qualidade, maturados por 21 dias',
      rating: 4.8,
      minOrder: 10
    },
    {
      id: 2,
      name: 'Organic Mixed Greens',
      category: 'Produtos Frescos',
      price: 8.50,
      unit: 'per case',
      stock: 120,
      supplier: 'Fresh Valley Farms',
      image: '/api/placeholder/300/200',
      description: 'Salada verde orgânica fresca e mista',
      rating: 4.6,
      minOrder: 5
    },
    {
      id: 3,
      name: 'Artisan Sourdough Bread',
      category: 'Produtos de panificação',
      price: 6.75,
      unit: 'per loaf',
      stock: 30,
      supplier: 'Artisan Bakery Supply',
      image: '/api/placeholder/300/200',
      description: 'Pão de fermentação natural tradicional, assado diariamente',
      rating: 4.9,
      minOrder: 12
    },
    {
      id: 4,
      name: 'Fresh Atlantic Salmon',
      category: 'Frutos do mar',
      price: 18.99,
      unit: 'per lb',
      stock: 25,
      supplier: 'Ocean Fresh Seafood',
      image: '/api/placeholder/300/200',
      description: 'Filés de salmão selvagem do Atlântico',
      rating: 4.7,
      minOrder: 8
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchProducts.toLowerCase()) ||
      product.description.toLowerCase().includes(searchProducts.toLowerCase());
    const matchesCategory = selectedProductCategory === 'all' || product.category === selectedProductCategory;
    return matchesSearch && matchesCategory;
  });

  const AddProductForm = () => (
    <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar novo produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName">Nome do Produto</Label>
            <Input id="productName" placeholder="Nome do Produto" />
          </div>
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriesProducts.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço</Label>
              <Input id="price" type="number" placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Input id="unit" placeholder="per lb" />
            </div>
          </div>
          <div>
            <Label htmlFor="stock">Estoque</Label>
            <Input id="stock" type="number" placeholder="0" />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" placeholder="Product description" />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddProduct(false)} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setShowAddProduct(false)} className="flex-1">
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-0">
        <h2 className="text-lg font-semibold mb-3">Produtos</h2>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar produto..." value={searchProducts} onChange={(e) => setSearchProducts(e.target.value)} className="pl-10" />
        </div>
        <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoriesProducts.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'Todas categorias' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden justify-between">
            <div className="aspect-video relative">
              {/* <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              /> */}
              <div className="absolute top-2 right-2">
                <Badge variant={product.stock > 20 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                  {product.stock > 0 ? `${product.stock} no estoque` : 'Out of stock'}
                </Badge>
              </div>
            </div>

            <CardContent className="pt-4 ">
              <div className="space-y-3">
                <div>
                  <h4 className="line-clamp-2">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                  {userType === 'consumer' && (
                    <span className="text-sm text-muted-foreground">by {product.supplier}</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg">${product.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{product.unit}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Sem ações por enquanto */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h4>Nenhum produto encontrado</h4>
          <p className="text-muted-foreground">Tente ajustar seus critérios de pesquisa ou filtro</p>
        </div>
      )}

      <AddProductForm />

     
    </div>
  );
}