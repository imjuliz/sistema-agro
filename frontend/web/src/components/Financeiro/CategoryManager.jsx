import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Plus, Edit, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export interface Category {
  id: string;
  name: string;
  type: 'entrada' | 'saida';
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export function CategoryManager({ categories, onCategoriesChange }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'entrada' | 'saida'>('entrada');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  
  // Estados para edição
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      type: newCategoryType,
      subcategories: []
    };
    
    onCategoriesChange([...categories, newCategory]);
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
  };

  const addSubcategory = () => {
    if (!newSubcategoryName.trim() || !selectedCategoryId) return;
    
    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategoryId) {
        return {
          ...category,
          subcategories: [
            ...category.subcategories,
            {
              id: Date.now().toString(),
              name: newSubcategoryName,
              categoryId: selectedCategoryId
            }
          ]
        };
      }
      return category;
    });
    
    onCategoriesChange(updatedCategories);
    setNewSubcategoryName('');
    setSelectedCategoryId('');
    setIsAddSubcategoryOpen(false);
  };

  const deleteCategory = (categoryId) => {
    onCategoriesChange(categories.filter(cat => cat.id !== categoryId));
  };

  const deleteSubcategory = (categoryId, subcategoryId) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          subcategories: category.subcategories.filter(sub => sub.id !== subcategoryId)
        };
      }
      return category;
    });
    onCategoriesChange(updatedCategories);
  };

  const startEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const startEditSubcategory = (subcategory) => {
    setEditingSubcategoryId(subcategory.id);
    setEditSubcategoryName(subcategory.name);
  };

  const saveEditCategory = () => {
    if (!editCategoryName.trim() || !editingCategoryId) return;
    
    const updatedCategories = categories.map(category => {
      if (category.id === editingCategoryId) {
        return { ...category, name: editCategoryName };
      }
      return category;
    });
    
    onCategoriesChange(updatedCategories);
    setEditingCategoryId(null);
    setEditCategoryName('');
  };

  const saveEditSubcategory = () => {
    if (!editSubcategoryName.trim() || !editingSubcategoryId) return;
    
    const updatedCategories = categories.map(category => ({
      ...category,
      subcategories: category.subcategories.map(sub => 
        sub.id === editingSubcategoryId 
          ? { ...sub, name: editSubcategoryName }
          : sub
      )
    }));
    
    onCategoriesChange(updatedCategories);
    setEditingSubcategoryId(null);
    setEditSubcategoryName('');
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingSubcategoryId(null);
    setEditCategoryName('');
    setEditSubcategoryName('');
  };

  const entradas = categories.filter(cat => cat.type === 'entrada');
  const saidas = categories.filter(cat => cat.type === 'saida');

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para organizar suas receitas ou despesas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Nome da Categoria</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Digite o nome da categoria"
                />
              </div>
              <div>
                <Label htmlFor="category-type">Tipo</Label>
                <Select value={newCategoryType} onValueChange={(value: 'entrada' | 'saida') => setNewCategoryType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addCategory} className="w-full">
                Adicionar Categoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Subcategoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Subcategoria</DialogTitle>
              <DialogDescription>
                Adicione uma subcategoria para detalhar melhor suas movimentações financeiras.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parent-category">Categoria Pai</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory-name">Nome da Subcategoria</Label>
                <Input
                  id="subcategory-name"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="Digite o nome da subcategoria"
                />
              </div>
              <Button onClick={addSubcategory} className="w-full">
                Adicionar Subcategoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Categorias de Entrada</CardTitle>
            <CardDescription>Categorias para receitas e ganhos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entradas.map(category => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    {editingCategoryId === category.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditCategory();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveEditCategory}
                          className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEdit}
                          className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-green-700">{category.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditCategory(category)}
                            className="text-blue-500 hover:text-blue-700 h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-1 ml-4">
                    {category.subcategories.map(subcategory => (
                      <div key={subcategory.id} className="flex items-center justify-between text-sm">
                        {editingSubcategoryId === subcategory.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <span>•</span>
                            <Input
                              value={editSubcategoryName}
                              onChange={(e) => setEditSubcategoryName(e.target.value)}
                              className="flex-1 h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditSubcategory();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={saveEditSubcategory}
                              className="text-green-600 hover:text-green-700 h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                              className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span>• {subcategory.name}</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditSubcategory(subcategory)}
                                className="text-blue-400 hover:text-blue-600 h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSubcategory(category.id, subcategory.id)}
                                className="text-red-400 hover:text-red-600 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Categorias de Saída</CardTitle>
            <CardDescription>Categorias para despesas e gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saidas.map(category => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    {editingCategoryId === category.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditCategory();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={saveEditCategory}
                          className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEdit}
                          className="text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-red-700">{category.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditCategory(category)}
                            className="text-blue-500 hover:text-blue-700 h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-1 ml-4">
                    {category.subcategories.map(subcategory => (
                      <div key={subcategory.id} className="flex items-center justify-between text-sm">
                        {editingSubcategoryId === subcategory.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <span>•</span>
                            <Input
                              value={editSubcategoryName}
                              onChange={(e) => setEditSubcategoryName(e.target.value)}
                              className="flex-1 h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditSubcategory();
                                if (e.key === 'Escape') cancelEdit();
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={saveEditSubcategory}
                              className="text-green-600 hover:text-green-700 h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                              className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span>• {subcategory.name}</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditSubcategory(subcategory)}
                                className="text-blue-400 hover:text-blue-600 h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSubcategory(category.id, subcategory.id)}
                                className="text-red-400 hover:text-red-600 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}