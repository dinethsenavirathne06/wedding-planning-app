import { useState, useEffect } from 'react';
import { authStorage, guestStorage } from '../utils/storage';
import { Guest, RSVPStatus } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Plus, Search, UserCircle, Mail, Phone, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

const rsvpColors = {
  Pending: 'bg-gray-100 text-gray-800',
  Attending: 'bg-green-100 text-green-800',
  'Not Attending': 'bg-red-100 text-red-800',
  Maybe: 'bg-yellow-100 text-yellow-800',
};

export default function GuestList() {
  const currentUser = authStorage.getCurrentUser();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRSVP, setFilterRSVP] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rsvpStatus: 'Pending' as RSVPStatus,
    dietaryRestrictions: '',
    plusOne: false,
    group: '',
  });

  useEffect(() => {
    loadGuests();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [guests, searchTerm, filterRSVP]);

  const loadGuests = () => {
    if (currentUser) {
      const userGuests = guestStorage.getByUserId(currentUser.id);
      setGuests(userGuests);
    }
  };

  const filterGuests = () => {
    let filtered = guests;

    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.group && g.group.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterRSVP !== 'all') {
      filtered = filtered.filter(g => g.rsvpStatus === filterRSVP);
    }

    setFilteredGuests(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      rsvpStatus: 'Pending',
      dietaryRestrictions: '',
      plusOne: false,
      group: '',
    });
  };

  const handleAddGuest = () => {
    if (!currentUser) return;

    const newGuest: Guest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      ...formData,
    };

    guestStorage.create(newGuest);
    loadGuests();
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Guest added successfully!');
  };

  const handleEditGuest = () => {
    if (!selectedGuest) return;

    guestStorage.update(selectedGuest.id, formData);
    loadGuests();
    setIsEditDialogOpen(false);
    setSelectedGuest(null);
    resetForm();
    toast.success('Guest updated successfully!');
  };

  const handleDeleteGuest = (guest: Guest) => {
    if (confirm(`Are you sure you want to remove ${guest.name} from the guest list?`)) {
      guestStorage.delete(guest.id);
      loadGuests();
      toast.success('Guest removed successfully!');
    }
  };

  const openEditDialog = (guest: Guest) => {
    setSelectedGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      rsvpStatus: guest.rsvpStatus,
      dietaryRestrictions: guest.dietaryRestrictions || '',
      plusOne: guest.plusOne,
      group: guest.group || '',
    });
    setIsEditDialogOpen(true);
  };

  const attendingCount = guests.filter(g => g.rsvpStatus === 'Attending').length;
  const plusOneCount = guests.filter(g => g.plusOne && g.rsvpStatus === 'Attending').length;
  const totalAttending = attendingCount + plusOneCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Guest List</h1>
          <p className="text-gray-600">Manage your wedding guests and RSVPs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Plus className="size-4 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
              <DialogDescription>Fill in the guest details below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rsvpStatus">RSVP Status</Label>
                <Select value={formData.rsvpStatus} onValueChange={(value) => setFormData({ ...formData, rsvpStatus: value as RSVPStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Attending">Attending</SelectItem>
                    <SelectItem value="Not Attending">Not Attending</SelectItem>
                    <SelectItem value="Maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="group">Group (Optional)</Label>
                <Input id="group" name="group" value={formData.group} onChange={handleInputChange} placeholder="e.g., Family, Friends, Colleagues" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions (Optional)</Label>
                <Input id="dietaryRestrictions" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleInputChange} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="plusOne"
                  checked={formData.plusOne}
                  onCheckedChange={(checked) => setFormData({ ...formData, plusOne: checked as boolean })}
                />
                <Label htmlFor="plusOne" className="cursor-pointer">Bringing a plus one</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleAddGuest} className="bg-gradient-to-r from-pink-500 to-purple-500">Add Guest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{guests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">{attendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Plus Ones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-purple-600">{plusOneCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Attending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-pink-600">{totalAttending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterRSVP} onValueChange={setFilterRSVP}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All RSVPs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All RSVPs</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Attending">Attending</SelectItem>
            <SelectItem value="Not Attending">Not Attending</SelectItem>
            <SelectItem value="Maybe">Maybe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guests List */}
      {filteredGuests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="size-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">
              {guests.length === 0
                ? "No guests yet. Add your first guest to get started!"
                : "No guests found matching your filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredGuests.map(guest => (
            <Card key={guest.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-2 rounded-full">
                      <UserCircle className="size-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>{guest.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={rsvpColors[guest.rsvpStatus]}>
                          {guest.rsvpStatus}
                        </Badge>
                        {guest.plusOne && (
                          <Badge variant="outline">+1</Badge>
                        )}
                        {guest.group && (
                          <Badge variant="outline">{guest.group}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="size-4" />
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="size-4" />
                  <span>{guest.phone}</span>
                </div>
                {guest.dietaryRestrictions && (
                  <div className="bg-yellow-50 p-2 rounded text-sm">
                    <span className="font-medium">Dietary:</span> {guest.dietaryRestrictions}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(guest)}
                >
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteGuest(guest)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
            <DialogDescription>Update guest details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rsvpStatus">RSVP Status</Label>
              <Select value={formData.rsvpStatus} onValueChange={(value) => setFormData({ ...formData, rsvpStatus: value as RSVPStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Attending">Attending</SelectItem>
                  <SelectItem value="Not Attending">Not Attending</SelectItem>
                  <SelectItem value="Maybe">Maybe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-group">Group (Optional)</Label>
              <Input id="edit-group" name="group" value={formData.group} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dietaryRestrictions">Dietary Restrictions (Optional)</Label>
              <Input id="edit-dietaryRestrictions" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleInputChange} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-plusOne"
                checked={formData.plusOne}
                onCheckedChange={(checked) => setFormData({ ...formData, plusOne: checked as boolean })}
              />
              <Label htmlFor="edit-plusOne" className="cursor-pointer">Bringing a plus one</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedGuest(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditGuest} className="bg-gradient-to-r from-pink-500 to-purple-500">Update Guest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
