import { useState, useEffect } from 'react';
import { authStorage, budgetStorage } from '../utils/storage';
import { BudgetItem } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Plus, DollarSign, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Budget() {
  const currentUser = authStorage.getCurrentUser();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    estimatedCost: '',
    actualCost: '',
    paid: false,
    dueDate: '',
  });

  useEffect(() => {
    loadBudgetItems();
  }, []);

  const loadBudgetItems = () => {
    if (currentUser) {
      const items = budgetStorage.getByUserId(currentUser.id);
      setBudgetItems(items);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      estimatedCost: '',
      actualCost: '',
      paid: false,
      dueDate: '',
    });
  };

  const handleAddItem = () => {
    if (!currentUser) return;

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      userId: currentUser.id,
      category: formData.category,
      description: formData.description,
      estimatedCost: parseFloat(formData.estimatedCost),
      actualCost: parseFloat(formData.actualCost) || 0,
      paid: formData.paid,
      dueDate: formData.dueDate || undefined,
    };

    budgetStorage.create(newItem);
    loadBudgetItems();
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Budget item added successfully!');
  };

  const handleEditItem = () => {
    if (!selectedItem) return;

    budgetStorage.update(selectedItem.id, {
      category: formData.category,
      description: formData.description,
      estimatedCost: parseFloat(formData.estimatedCost),
      actualCost: parseFloat(formData.actualCost) || 0,
      paid: formData.paid,
      dueDate: formData.dueDate || undefined,
    });

    loadBudgetItems();
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    resetForm();
    toast.success('Budget item updated successfully!');
  };

  const handleDeleteItem = (item: BudgetItem) => {
    if (confirm(`Are you sure you want to delete "${item.description}"?`)) {
      budgetStorage.delete(item.id);
      loadBudgetItems();
      toast.success('Budget item deleted successfully!');
    }
  };

  const openEditDialog = (item: BudgetItem) => {
    setSelectedItem(item);
    setFormData({
      category: item.category,
      description: item.description,
      estimatedCost: item.estimatedCost.toString(),
      actualCost: item.actualCost.toString(),
      paid: item.paid,
      dueDate: item.dueDate || '',
    });
    setIsEditDialogOpen(true);
  };

  const togglePaid = (item: BudgetItem) => {
    budgetStorage.update(item.id, { paid: !item.paid });
    loadBudgetItems();
  };

  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);
  const totalPaid = budgetItems.filter(item => item.paid).reduce((sum, item) => sum + item.actualCost, 0);
  const budgetProgress = totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0;
  const isOverBudget = totalActual > totalEstimated;

  // Group items by category
  const itemsByCategory = budgetItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BudgetItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Budget Tracker</h1>
          <p className="text-gray-600">Manage your wedding expenses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Plus className="size-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Item</DialogTitle>
              <DialogDescription>Add a new expense to your wedding budget</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Venue, Catering" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                  <Input id="estimatedCost" name="estimatedCost" type="number" step="0.01" value={formData.estimatedCost} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="actualCost">Actual Cost ($)</Label>
                  <Input id="actualCost" name="actualCost" type="number" step="0.01" value={formData.actualCost} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paid"
                  checked={formData.paid}
                  onCheckedChange={(checked) => setFormData({ ...formData, paid: checked as boolean })}
                />
                <Label htmlFor="paid" className="cursor-pointer">Paid</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleAddItem} className="bg-gradient-to-r from-pink-500 to-purple-500">Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalEstimated.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Estimated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${isOverBudget ? 'text-red-600' : 'text-pink-600'}`}>
              ${totalActual.toLocaleString()}
            </div>
            <Progress value={budgetProgress} className={`mt-2 ${isOverBudget ? 'bg-red-200' : ''}`} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              ${(totalActual - totalPaid).toLocaleString()} remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Status Alert */}
      {isOverBudget && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center space-x-3 py-4">
            <AlertTriangle className="size-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Over Budget</p>
              <p className="text-sm text-red-700">
                You're ${(totalActual - totalEstimated).toLocaleString()} over your estimated budget
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Items */}
      {budgetItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <DollarSign className="size-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">No budget items yet. Add your first expense to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, items]) => {
            const categoryEstimated = items.reduce((sum, item) => sum + item.estimatedCost, 0);
            const categoryActual = items.reduce((sum, item) => sum + item.actualCost, 0);
            
            return (
              <Card key={category}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{category}</CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Estimated: ${categoryEstimated.toLocaleString()}</p>
                      <p className="text-sm font-semibold">Actual: ${categoryActual.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={item.paid}
                            onCheckedChange={() => togglePaid(item)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${item.paid ? 'line-through text-gray-500' : ''}`}>
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-sm text-gray-500">
                                Est: ${item.estimatedCost.toLocaleString()}
                              </span>
                              {item.actualCost > 0 && (
                                <span className={`text-sm font-medium ${item.actualCost > item.estimatedCost ? 'text-red-600' : 'text-green-600'}`}>
                                  Actual: ${item.actualCost.toLocaleString()}
                                </span>
                              )}
                              {item.dueDate && (
                                <Badge variant="outline" className="text-xs">
                                  Due: {new Date(item.dueDate).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.paid && (
                            <CheckCircle className="size-5 text-green-600" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Item</DialogTitle>
            <DialogDescription>Update budget item details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input id="edit-category" name="category" value={formData.category} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input id="edit-description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-estimatedCost">Estimated Cost ($)</Label>
                <Input id="edit-estimatedCost" name="estimatedCost" type="number" step="0.01" value={formData.estimatedCost} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-actualCost">Actual Cost ($)</Label>
                <Input id="edit-actualCost" name="actualCost" type="number" step="0.01" value={formData.actualCost} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dueDate">Due Date (Optional)</Label>
              <Input id="edit-dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-paid"
                checked={formData.paid}
                onCheckedChange={(checked) => setFormData({ ...formData, paid: checked as boolean })}
              />
              <Label htmlFor="edit-paid" className="cursor-pointer">Paid</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedItem(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditItem} className="bg-gradient-to-r from-pink-500 to-purple-500">Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
