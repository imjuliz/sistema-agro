import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Edit, Check, X, AlertCircle, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function CategoryManager({ categories, onCategoriesChange, fetchWithAuth, API_URL, onRefresh }) {
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('entrada');
  const [nameValidationMessage, setNameValidationMessage] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Estados para edição
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    // If validation message exists, block immediately
    if (nameValidationMessage) {
      toast({ title: 'Validação', description: nameValidationMessage, variant: 'destructive' });
      return;
    }

    // helper: normalize string (remove diacritics, lowercase, trim)
    const normalizeName = (s) => String(s || '').normalize ? String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '') : String(s || '');
    const normalizeAndClean = (s) => normalizeName(s).toLowerCase().trim();
    const normalizeType = (t) => {
      if (!t) return '';
      const s = String(t).toLowerCase();
      if (s.includes('entrada')) return 'entrada';
      if (s.includes('saida') || s.includes('saída')) return 'saida';
      return s;
    };

    // double-check duplicate before sending (accent-insensitive)
    const nameClean = normalizeAndClean(newCategoryName);
    const isDuplicate = Array.isArray(categories) && categories.some(cat => {
      const catName = normalizeAndClean(cat.name || cat.nome || '');
      return catName === nameClean && normalizeType(cat.type || cat.tipo) === normalizeType(newCategoryType);
    });
    if (isDuplicate) {
      const msg = `Já existe uma categoria do tipo "${newCategoryType}" com este nome.`;
      setNameValidationMessage(msg);
      toast({ title: 'Categoria duplicada', description: msg, variant: 'destructive' });
      return;
    }
    
    try {
      const categoriaData = {
        nome: newCategoryName,
        tipo: newCategoryType === 'entrada' ? 'ENTRADA' : 'SAIDA',
        descricao: ''
      };

      const url = API_URL ? `${API_URL}categorias` : '/api/categorias';
      const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoriaData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Tenta obter a mensagem de erro específica do backend
        const errorMessage = result.erro || result.detalhes || 'Erro ao criar categoria';
        // Se for conflito de duplicidade (409), mostre a mensagem de validação no input
        if (response.status === 409 || (typeof errorMessage === 'string' && errorMessage.includes('Já existe uma categoria'))) {
          const msg = typeof errorMessage === 'string' ? errorMessage : `Já existe uma categoria com este nome deste tipo.`;
          setNameValidationMessage(msg);
          toast({ title: 'Categoria duplicada', description: msg, variant: 'destructive' });
          return;
        }
        throw new Error(errorMessage);
      }

      if (result.sucesso) {
        toast({
          title: "Sucesso!",
          description: "Categoria criada com sucesso.",
          variant: "default",
        });
        
        if (onRefresh) {
          await onRefresh();
        } else {
          const newCategory = {
            id: result.dados.id.toString(),
            name: newCategoryName,
            type: newCategoryType,
            subcategories: [],
            pendingAccounts: []
          };
          
          onCategoriesChange([...categories, newCategory]);
        }
        setNewCategoryName('');
        setNameValidationMessage('');
        setIsAddCategoryOpen(false);
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      const errorMessage = error.message || 'Erro ao criar categoria. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const addSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedCategoryId) return;
    
    try {
      const subcategoriaData = {
        nome: newSubcategoryName,
        descricao: ''
      };

      const url = API_URL ? `${API_URL}categorias/${selectedCategoryId}/subcategorias` : `/api/categorias/${selectedCategoryId}/subcategorias`;
      const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoriaData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Tenta obter a mensagem de erro específica do backend
        const errorMessage = result.erro || result.detalhes || 'Erro ao criar subcategoria';
        throw new Error(errorMessage);
      }

      if (result.sucesso) {
        toast({
          title: "Sucesso!",
          description: "Subcategoria criada com sucesso.",
          variant: "default",
        });
        
        if (onRefresh) {
          await onRefresh();
        } else {
          const updatedCategories = categories.map(category => {
            if (category.id === selectedCategoryId) {
              return {
                ...category,
                subcategories: [
                  ...category.subcategories,
                  {
                    id: result.dados.id.toString(),
                    name: newSubcategoryName,
                    categoryId: selectedCategoryId
                  }
                ]
              };
            }
            return category;
          });
          
          onCategoriesChange(updatedCategories);
        }
        setNewSubcategoryName('');
        setSelectedCategoryId('');
        setIsAddSubcategoryOpen(false);
      }
    } catch (error) {
      console.error('Erro ao criar subcategoria:', error);
      const errorMessage = error.message || 'Erro ao criar subcategoria. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const url = API_URL ? `${API_URL}categorias/${categoryId}` : `/api/categorias/${categoryId}`;
      const response = await fetchWithAuth(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const errorMessage = result.erro || result.detalhes || 'Erro ao deletar categoria';
        throw new Error(errorMessage);
      }

      toast({
        title: "Sucesso!",
        description: "Categoria deletada com sucesso.",
        variant: "default",
      });

      if (onRefresh) {
        await onRefresh();
      } else {
        onCategoriesChange(categories.filter(cat => cat.id !== categoryId));
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      const errorMessage = error.message || 'Erro ao deletar categoria. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      const url = API_URL ? `${API_URL}subcategorias/${subcategoryId}` : `/api/subcategorias/${subcategoryId}`;
      const response = await fetchWithAuth(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const errorMessage = result.erro || result.detalhes || 'Erro ao deletar subcategoria';
        throw new Error(errorMessage);
      }

      toast({
        title: "Sucesso!",
        description: "Subcategoria deletada com sucesso.",
        variant: "default",
      });

      if (onRefresh) {
        await onRefresh();
      } else {
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
      }
    } catch (error) {
      console.error('Erro ao deletar subcategoria:', error);
      const errorMessage = error.message || 'Erro ao deletar subcategoria. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const startEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const startEditSubcategory = (subcategory) => {
    setEditingSubcategoryId(subcategory.id);
    setEditSubcategoryName(subcategory.name);
  };

  const saveEditCategory = async () => {
    if (!editCategoryName.trim() || !editingCategoryId) return;
    
    try {
      const categoriaData = {
        nome: editCategoryName,
        descricao: ''
      };

      const url = API_URL ? `${API_URL}categorias/${editingCategoryId}` : `/api/categorias/${editingCategoryId}`;
      const response = await fetchWithAuth(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoriaData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.erro || result.detalhes || 'Erro ao atualizar categoria';
        throw new Error(errorMessage);
      }

      toast({
        title: "Sucesso!",
        description: "Categoria atualizada com sucesso.",
        variant: "default",
      });

      if (onRefresh) {
        await onRefresh();
      } else {
        const updatedCategories = categories.map(category => {
          if (category.id === editingCategoryId) {
            return { ...category, name: editCategoryName };
          }
          return category;
        });
        
        onCategoriesChange(updatedCategories);
      }
      setEditingCategoryId(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      const errorMessage = error.message || 'Erro ao atualizar categoria. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const saveEditSubcategory = async () => {
    if (!editSubcategoryName.trim() || !editingSubcategoryId) return;
    
    try {
      const subcategoriaData = {
        nome: editSubcategoryName,
        descricao: ''
      };

      const url = API_URL ? `${API_URL}subcategorias/${editingSubcategoryId}` : `/api/subcategorias/${editingSubcategoryId}`;
      const response = await fetchWithAuth(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoriaData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.erro || result.detalhes || 'Erro ao atualizar subcategoria';
        throw new Error(errorMessage);
      }

      toast({
        title: "Sucesso!",
        description: "Subcategoria atualizada com sucesso.",
        variant: "default",
      });

      if (onRefresh) {
        await onRefresh();
      } else {
        const updatedCategories = categories.map(category => ({
          ...category,
          subcategories: category.subcategories.map(sub => 
            sub.id === editingSubcategoryId 
              ? { ...sub, name: editSubcategoryName }
              : sub
          )
        }));
        
        onCategoriesChange(updatedCategories);
      }
      setEditingSubcategoryId(null);
      setEditSubcategoryName('');
    } catch (error) {
      console.error('Erro ao atualizar subcategoria:', error);
      const errorMessage = error.message || 'Erro ao atualizar subcategoria. Tente novamente.';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingSubcategoryId(null);
    setEditCategoryName('');
    setEditSubcategoryName('');
  };

  // Funções auxiliares
  const formatCurrency = (value) => {
    const num = Number(value ?? 0);
    if (isNaN(num) || !isFinite(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Função para obter contas pendentes de uma categoria
  const getPendingAccounts = (category) => {
    if (!category.financeiros || !Array.isArray(category.financeiros)) {
      return [];
    }
    return category.financeiros.filter(conta => conta.status === 'PENDENTE');
  };

  // Função para calcular total pendente de uma categoria
  const getTotalPending = (category) => {
    const pending = getPendingAccounts(category);
    return pending.reduce((sum, conta) => {
      const valor = Number(conta.valor) || 0;
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
  };

  const entradas = categories.filter(cat => cat.type === 'entrada');
  const saidas = categories.filter(cat => cat.type === 'saida');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 ">
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para organizar suas receitas ou despesas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name" className={"pb-3"}>Nome da Categoria</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // call addCategory which will re-check validation
                      addCategory();
                    }
                  }}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    // validate live: only duplicate if same name and same type
                    const normalizeType = (t) => {
                      if (!t) return '';
                      const s = String(t).toLowerCase();
                      if (s.includes('entrada')) return 'entrada';
                      if (s.includes('saida') || s.includes('saída')) return 'saida';
                      return s;
                    };
                    const nameClean = (String(e.target.value || '').normalize ? String(e.target.value || '').normalize('NFD').replace(/\p{Diacritic}/gu, '') : String(e.target.value || '')).toLowerCase().trim();
                    if (!nameClean) { setNameValidationMessage(''); return; }
                    const dup = Array.isArray(categories) && categories.some(cat => {
                      const catName = (String(cat.name || cat.nome || '').normalize ? String(cat.name || cat.nome || '').normalize('NFD').replace(/\p{Diacritic}/gu, '') : String(cat.name || cat.nome || '')).toLowerCase().trim();
                      return catName === nameClean && normalizeType(cat.type || cat.tipo) === normalizeType(newCategoryType);
                    });
                    setNameValidationMessage(dup ? `Já existe uma categoria do tipo "${newCategoryType}" com este nome.` : '');
                  }}
                  placeholder="Digite o nome da categoria"
                />
                {nameValidationMessage && (
                  <p className="text-sm text-destructive mt-2">{nameValidationMessage}</p>
                )}
              </div>
              <div>
                <Label htmlFor="category-type" className={"pb-3"}>Tipo</Label>
                <Select value={newCategoryType} onValueChange={(value) => {
                    setNewCategoryType(value);
                    // re-validate name against new type
                    const normalizeType = (t) => {
                      if (!t) return '';
                      const s = String(t).toLowerCase();
                      if (s.includes('entrada')) return 'entrada';
                      if (s.includes('saida') || s.includes('saída')) return 'saida';
                      return s;
                    };
                    const nameClean = String(newCategoryName || '').trim().toLowerCase();
                    if (!nameClean) { setNameValidationMessage(''); return; }
                    const dup = Array.isArray(categories) && categories.some(cat => {
                      const catName = String(cat.name || cat.nome || '').trim().toLowerCase();
                      return catName === nameClean && normalizeType(cat.type || cat.tipo) === normalizeType(value);
                    });
                    setNameValidationMessage(dup ? `Já existe uma categoria do tipo "${value}" com este nome.` : '');
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addCategory} className="w-full" disabled={!!nameValidationMessage || !newCategoryName.trim()}>
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
          <DialogContent className="max-w-md">
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
                      <SelectItem key={category.id} value={String(category.id || '')}>
                        {category.name || 'Sem nome'} ({category.type || 'sem tipo'})
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
            <CardTitle className="">Categorias de Entrada</CardTitle>
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
                          className="hover:text-green-700 h-8 w-8 p-0"
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
                        <div className="flex items-center gap-2 flex-1">
                          <h4 className="font-semibold">{category.name}</h4>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditCategory(category)}
                            className="h-8 w-8 p-0"
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
                              className="h-6 w-6 p-0"
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
                                className="h-6 w-6 p-0"
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
            <CardTitle className="">Categorias de Saída</CardTitle>
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
                          className="h-8 w-8 p-0"
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
                        <div className="flex items-center gap-2 flex-1">
                          <h4 className="">{category.name}</h4>
                          {getPendingAccounts(category).length > 0 && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              {getPendingAccounts(category).length} pendente{getPendingAccounts(category).length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditCategory(category)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCategory(category.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Exibir contas pendentes */}
                  {getPendingAccounts(category).length > 0 && (
                    <Collapsible 
                      open={expandedCategories[category.id]} 
                      onOpenChange={() => toggleCategory(category.id)}
                      className="mt-2"
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
                          <span className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-orange-600" />
                            {getPendingAccounts(category).length} conta{getPendingAccounts(category).length > 1 ? 's' : ''} pendente{getPendingAccounts(category).length > 1 ? 's' : ''} 
                            ({formatCurrency(getTotalPending(category))})
                          </span>
                          <span className="text-muted-foreground">
                            {expandedCategories[category.id] ? 'Ocultar' : 'Ver'}
                          </span>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 space-y-2">
                        <div className="ml-4 border-l-2 border-orange-200 pl-3 space-y-2">
                          {getPendingAccounts(category).map((conta) => (
                            <div
                              key={conta.id}
                              className="rounded p-2 text-xs bg-white/50 dark:bg-transparent border border-orange-100 dark:border-orange-900/20"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-medium text-orange-900 dark:text-orange-100">
                                    {conta.descricao || 'Sem descrição'}
                                  </div>
                                  {conta.subcategoria && (
                                    <div className="text-orange-700 dark:text-orange-300 text-xs mt-1">
                                      Subcategoria: {conta.subcategoria.nome}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3 mt-1 text-orange-600 dark:text-orange-300">
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      {formatCurrency(conta.valor)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      Vence: {formatDate(conta.vencimento)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  
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
                              className="h-6 w-6 p-0"
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
                                className="h-6 w-6 p-0"
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