import { useState, useEffect } from 'react';
import { authStorage, bookingStorage, vendorStorage } from '../utils/storage';
import { Booking, BookingStatus } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, DollarSign, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  Completed: 'bg-blue-100 text-blue-800',
};

const statusIcons = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Cancelled: XCircle,
  Completed: CheckCircle,
};

export default function Bookings() {
  const currentUser = authStorage.getCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    if (currentUser) {
      const userBookings = bookingStorage.getByUserId(currentUser.id);
      setBookings(userBookings);
    }
  };

  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus) => {
    bookingStorage.update(bookingId, { status: newStatus });
    loadBookings();
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const handleDeleteBooking = (booking: Booking) => {
    if (confirm(`Are you sure you want to delete the booking for ${booking.vendorName}?`)) {
      bookingStorage.delete(booking.id);
      loadBookings();
      toast.success('Booking deleted successfully!');
    }
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const totalSpent = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Bookings</h1>
        <p className="text-gray-600">Manage your vendor bookings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {bookings.filter(b => b.status === 'Confirmed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-yellow-600">
              {bookings.filter(b => b.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-pink-600">
              ${totalSpent.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="size-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">
              {filterStatus === 'all' 
                ? "No bookings yet. Visit the Vendors page to book your first vendor!"
                : `No ${filterStatus.toLowerCase()} bookings found.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const StatusIcon = statusIcons[booking.status];
            return (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{booking.vendorName}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{booking.vendorCategory}</Badge>
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[booking.status]}>
                      <StatusIcon className="size-3 mr-1" />
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="size-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Booking Date</p>
                        <p className="font-medium">
                          {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="size-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p className="font-medium text-pink-600">${booking.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium mb-1">Notes:</p>
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Select
                    value={booking.status}
                    onValueChange={(value) => handleUpdateStatus(booking.id, value as BookingStatus)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBooking(booking)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
