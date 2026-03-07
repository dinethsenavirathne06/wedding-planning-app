import { useState, useEffect } from 'react';
import { authStorage, vendorStorage, bookingStorage } from '../utils/storage';
import { Vendor, VendorCategory } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { sendBookingConfirmation } from '../../lib/email'

const categories: VendorCategory[] = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Florist',
  'Music/DJ',
  'Decoration',
  'Makeup Artist',
  'Transportation',
  'Other',
];

export default function Vendors() {
  const currentUser = authStorage.getCurrentUser();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Venue' as VendorCategory,
    description: '',
    price: '',
    contact: '',
    email: '',
    location: '',
    rating: '5',
  });

  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    notes: '',
  });

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, selectedCategory]);

  const loadVendors = () => {
    const allVendors = vendorStorage.getAll();
    setVendors(allVendors);
  };

  const filterVendors = () => {
    let filtered = vendors;

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }

    setFilteredVendors(filtered);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Venue',
      description: '',
      price: '',
      contact: '',
      email: '',
      location: '',
      rating: '5',
    });
  };

  const handleAddVendor = () => {
    if (!currentUser) return;

    const newVendor: Vendor = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      contact: formData.contact,
      email: formData.email,
      location: formData.location,
      rating: parseFloat(formData.rating),
      image: formData.category.toLowerCase().replace(/\//g, '-'),
      available: true,
      createdBy: currentUser.id,
    };

    vendorStorage.create(newVendor);
    loadVendors();
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Vendor added successfully!');
  };

  const handleEditVendor = () => {
    if (!selectedVendor) return;

    vendorStorage.update(selectedVendor.id, {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      contact: formData.contact,
      email: formData.email,
      location: formData.location,
      rating: parseFloat(formData.rating),
    });

    loadVendors();
    setIsEditDialogOpen(false);
    setSelectedVendor(null);
    resetForm();
    toast.success('Vendor updated successfully!');
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    if (confirm(`Are you sure you want to delete ${vendor.name}?`)) {
      vendorStorage.delete(vendor.id);
      loadVendors();
      toast.success('Vendor deleted successfully!');
    }
  };

  const openEditDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      category: vendor.category,
      description: vendor.description,
      price: vendor.price.toString(),
      contact: vendor.contact,
      email: vendor.email,
      location: vendor.location,
      rating: vendor.rating.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleBookVendor = async () => {
    if (!currentUser || !selectedVendor) return;

    if (!bookingData.bookingDate) {
      toast.error('Please select a booking date.');
      return;
    }

    const currentUserName =
      (currentUser as any)?.name ||
      (currentUser as any)?.fullName ||
      (currentUser as any)?.username ||
      'Customer';

    const currentUserEmail =
      (currentUser as any)?.email ||
      (currentUser as any)?.userEmail ||
      '';

    const newBooking = {
      id: Date.now().toString(),
      vendorId: selectedVendor.id,
      userId: currentUser.id,
      vendorName: selectedVendor.name,
      vendorCategory: selectedVendor.category,
      bookingDate: bookingData.bookingDate,
      status: 'Confirmed' as const,
      notes: bookingData.notes,
      price: selectedVendor.price,
      createdAt: new Date().toISOString(),
    };

    try {
      bookingStorage.create(newBooking);

      if (currentUserEmail) {
        await sendBookingConfirmation({
          customerName: currentUserName,
          customerEmail: currentUserEmail,
          vendorName: selectedVendor.name,
          bookingDate: bookingData.bookingDate,
          notes: bookingData.notes,
        });

        toast.success('Booking confirmed and email sent successfully!');
      } else {
        toast.success('Booking confirmed successfully!');
        toast.error('Booking saved, but no user email was found to send confirmation.');
      }

      setIsBookDialogOpen(false);
      setSelectedVendor(null);
      setBookingData({ bookingDate: '', notes: '' });
    } catch (error) {
      console.error(error);
      toast.error('Booking saved, but email could not be sent.');
      setIsBookDialogOpen(false);
      setSelectedVendor(null);
      setBookingData({ bookingDate: '', notes: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Vendors</h1>
          <p className="text-gray-600">Browse and manage wedding vendors</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Plus className="size-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Fill in the vendor details below
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Vendor Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as VendorCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Phone</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddVendor}
                className="bg-gradient-to-r from-pink-500 to-purple-500"
              >
                Add Vendor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredVendors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              No vendors found. Add your first vendor to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white text-gray-800">
                    {vendor.category}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{vendor.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star
                        className="size-4 text-yellow-500"
                        fill="currentColor"
                      />
                      <span className="text-sm">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-pink-600">
                      ${vendor.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {vendor.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="size-4" />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="size-4" />
                  <span>{vendor.contact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="size-4" />
                  <span className="truncate">{vendor.email}</span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedVendor(vendor);
                    setIsBookDialogOpen(true);
                  }}
                >
                  <Calendar className="size-4 mr-2" />
                  Book
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(vendor)}
                >
                  <Edit className="size-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteVendor(vendor)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>Update vendor details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Vendor Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as VendorCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-rating">Rating (1-5)</Label>
                <Input
                  id="edit-rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-contact">Contact Phone</Label>
              <Input
                id="edit-contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedVendor(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditVendor}
              className="bg-gradient-to-r from-pink-500 to-purple-500"
            >
              Update Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedVendor?.name}</DialogTitle>
            <DialogDescription>
              Schedule a booking for this vendor
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bookingDate">Booking Date</Label>
              <Input
                id="bookingDate"
                type="date"
                value={bookingData.bookingDate}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    bookingDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={bookingData.notes}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    notes: e.target.value,
                  })
                }
                placeholder="Add any special requests or notes..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Price:</span>
                <span className="text-xl font-semibold text-pink-600">
                  ${selectedVendor?.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsBookDialogOpen(false);
                setSelectedVendor(null);
                setBookingData({ bookingDate: '', notes: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBookVendor}
              className="bg-gradient-to-r from-pink-500 to-purple-500"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}