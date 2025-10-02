import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';

const storeColumns = ['AG001', 'AG002', 'AT6001', 'ATH001', 'AC001', 'MV001'];

export function SetupView() {
  const { items, updateItem, addItem, deleteItem, storeMapping } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetupType, setSelectedSetupType] = useState('all');
  const [selectedItemGroup, setSelectedItemGroup] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    setupType: 'model',
    storeDisplayStock: {},
    currentStock: {},
    minimumStock: {}
  });

  const itemGroups = [...new Set(items.map(item => item.itemGroup))];
  const brands = [...new Set(items.map(item => item.brand))].filter(Boolean);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedSetupType === 'all' || item.setupType === selectedSetupType;
    const matchesGroup = selectedItemGroup === 'all' || item.itemGroup === selectedItemGroup;
    const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
    return matchesSearch && matchesType && matchesGroup && matchesBrand;
  });

  const handleAddItem = () => {
    if (newItem.itemName && newItem.itemCode) {
      const item = {
        id: Date.now().toString(),
        code: `ELDH${(items.length + 1).toString().padStart(2, '0')}`,
        name: 'ADMIN',
        createDate: new Date().toLocaleDateString('en-GB'),
        updateDate: '',
        updatedBy: '',
        itemCode: newItem.itemCode || '',
        itemName: newItem.itemName || '',
        itemGroup: newItem.itemGroup || '',
        category: newItem.category || '',
        capacity: newItem.capacity || '',
        cluster: newItem.cluster || '',
        brand: newItem.brand || '',
        setupType: newItem.setupType,
        price: parseFloat(newItem.price) || 0,
        storeDisplayStock: newItem.storeDisplayStock || {},
        currentStock: newItem.currentStock || {},
        minimumStock: newItem.minimumStock || {}
      };
      addItem(item);
      setNewItem({ setupType: 'model', storeDisplayStock: {}, currentStock: {}, minimumStock: {} });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditItem = () => {
    if (editingItem) {
      updateItem(editingItem.id, editingItem);
      setEditingItem(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteItem = (id) => {
    deleteItem(id);
  };

  const updateStoreStock = (itemId, storeCode, value) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem(itemId, {
        storeDisplayStock: { ...item.storeDisplayStock, [storeCode]: value }
      });
    }
  };

  const modelSetups = filteredItems.filter(item => item.setupType === 'model').length;
  const branchSetups = filteredItems.filter(item => item.setupType === 'branch').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="text-2xl font-medium">{filteredItems.length}</div>
              <div className="text-sm text-muted-foreground ml-2">Total Setups</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <div className="text-2xl font-medium text-blue-600">{modelSetups}</div>
              <div className="text-sm text-muted-foreground ml-2">Model-wise</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <div className="text-2xl font-medium text-yellow-600">{branchSetups}</div>
              <div className="text-sm text-muted-foreground ml-2">Branch-wise</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Setup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Display Setup</DialogTitle>
                  <DialogDescription>
                    Configure a new inventory item with display stock settings across all store locations.
                  </DialogDescription>
                </DialogHeader>
                {/* Add Item Form (same as before) */}
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddItem}>Add Setup</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-2">Search</label>
              <Input
                placeholder="Search by item name, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Setup Type</label>
              <Select value={selectedSetupType} onValueChange={setSelectedSetupType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select setup type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="model">Model-wise</SelectItem>
                  <SelectItem value="branch">Branch-wise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Item Group</label>
              <Select value={selectedItemGroup} onValueChange={setSelectedItemGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {itemGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Setup Table */}
      <Card>
        <CardHeader>
          <CardTitle>Display Stock Setup Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Create Date</TableHead>
                  <TableHead>Update Date</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead>ItemCode</TableHead>
                  <TableHead>ItemName</TableHead>
                  <TableHead>ItemGroup</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Cluster</TableHead>
                  {storeColumns.map(store => (
                    <TableHead key={store} className="text-center min-w-[80px]">
                      <div className="space-y-1">
                        <div className="font-medium">{store}</div>
                        <div className="text-xs text-muted-foreground">Display</div>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow 
                    key={item.id} 
                    className={item.setupType === 'model' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-yellow-50 hover:bg-yellow-100'}
                  >
                    <TableCell className="font-mono text-sm">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-sm">{item.createDate}</TableCell>
                    <TableCell className="text-sm">{item.updateDate}</TableCell>
                    <TableCell className="text-sm">{item.updatedBy}</TableCell>
                    <TableCell className="font-mono text-sm">{item.itemCode}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-medium">{item.itemName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.itemGroup}</Badge>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.brand}</Badge>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{item.capacity}</TableCell>
                    <TableCell className="text-sm">{item.cluster}</TableCell>
                    {storeColumns.map(store => (
                      <TableCell key={store} className="text-center">
                        <div className="space-y-1">
                          <Input
                            type="number"
                            value={item.storeDisplayStock[store] || 0}
                            onChange={(e) => updateStoreStock(item.id, store, parseInt(e.target.value) || 0)}
                            className="w-16 text-center text-sm"
                            min="0"
                          />
                          <div className="text-xs text-muted-foreground">
                            Stock: {item.currentStock[store] || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Min: {item.minimumStock[store] || 0}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No setup items found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Display Setup</DialogTitle>
            <DialogDescription>
              Modify the inventory item details and configuration settings.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Item Code</Label>
                <Input
                  value={editingItem.itemCode}
                  onChange={(e) => setEditingItem({...editingItem, itemCode: e.target.value})}
                />
              </div>
              <div>
                <Label>Item Name</Label>
                <Input
                  value={editingItem.itemName}
                  onChange={(e) => setEditingItem({...editingItem, itemName: e.target.value})}
                />
              </div>
              <div>
                <Label>Item Group</Label>
                <Input
                  value={editingItem.itemGroup}
                  onChange={(e) => setEditingItem({...editingItem, itemGroup: e.target.value})}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                />
              </div>
              <div>
                <Label>Brand</Label>
                <Input
                  value={editingItem.brand}
                  onChange={(e) => setEditingItem({...editingItem, brand: e.target.value})}
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                  step="0.01"
                />
              </div>
              <div>
                <Label>Setup Type</Label>
                <Select 
                  value={editingItem.setupType} 
                  onValueChange={(value) => setEditingItem({ ...editingItem, setupType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model">Model-wise</SelectItem>
                    <SelectItem value="branch">Branch-wise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
