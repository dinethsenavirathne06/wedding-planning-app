import { useState, useEffect } from 'react';
import { authStorage, bookingStorage, budgetStorage, guestStorage, taskStorage } from '../utils/storage';
import { exportAllData } from '../utils/fileOperations';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Calendar, DollarSign, Users, CheckCircle, AlertCircle, Heart, CalendarDays, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const currentUser = authStorage.getCurrentUser();
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    totalGuests: 0,
    attendingGuests: 0,
    budgetTotal: 0,
    budgetSpent: 0,
    completedTasks: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    if (currentUser) {
      const bookings = bookingStorage.getByUserId(currentUser.id);
      const guests = guestStorage.getByUserId(currentUser.id);
      const budgetItems = budgetStorage.getByUserId(currentUser.id);
      const tasks = taskStorage.getByUserId(currentUser.id);

      setStats({
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === 'Confirmed').length,
        totalGuests: guests.length,
        attendingGuests: guests.filter(g => g.rsvpStatus === 'Attending').length,
        budgetTotal: budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0),
        budgetSpent: budgetItems.reduce((sum, item) => sum + item.actualCost, 0),
        completedTasks: tasks.filter(t => t.completed).length,
        totalTasks: tasks.length,
      });
    }
  }, [currentUser]);

  const budgetProgress = stats.budgetTotal > 0 ? (stats.budgetSpent / stats.budgetTotal) * 100 : 0;
  const taskProgress = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
  const guestProgress = stats.totalGuests > 0 ? (stats.attendingGuests / stats.totalGuests) * 100 : 0;

  const daysUntilWedding = currentUser?.weddingDate 
    ? Math.ceil((new Date(currentUser.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleExportData = () => {
    exportAllData();
    toast.success('Data exported successfully! Check your downloads folder.');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Welcome back, {currentUser?.name}!</h1>
            <p className="text-pink-100">Here's what's happening with your wedding planning</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleExportData}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="size-4 mr-2" />
              Export Data
            </Button>
            <Heart className="size-12" fill="currentColor" />
          </div>
        </div>
        {currentUser?.weddingDate && (
          <div className="mt-6 flex items-center space-x-2 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <CalendarDays className="size-6" />
            <div>
              <p className="text-sm text-pink-100">Wedding Date</p>
              <p className="text-xl font-semibold">{new Date(currentUser.weddingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              {daysUntilWedding !== null && daysUntilWedding > 0 && (
                <p className="text-sm text-pink-100 mt-1">{daysUntilWedding} days to go!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Bookings</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.confirmedBookings} confirmed
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-green-600">
                {stats.confirmedBookings}/{stats.totalBookings}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Guests</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.attendingGuests} attending
            </p>
            <Progress value={guestProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Budget</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${stats.budgetSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of ${stats.budgetTotal.toLocaleString()}
            </p>
            <Progress 
              value={budgetProgress} 
              className={`mt-2 ${budgetProgress > 100 ? 'bg-red-200' : ''}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tasks</CardTitle>
            <CheckCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.completedTasks}/{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalTasks > 0 ? Math.round(taskProgress) : 0}% completed
            </p>
            <Progress value={taskProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalBookings === 0 && stats.totalGuests === 0 && stats.totalTasks === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="size-12 mx-auto mb-3 text-gray-400" />
                <p>No activity yet. Start by adding vendors or guests!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.totalBookings > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Calendar className="size-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vendor Bookings</p>
                      <p className="text-xs text-gray-500">{stats.totalBookings} vendor(s) booked</p>
                    </div>
                  </div>
                )}
                {stats.totalGuests > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="size-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Guest List</p>
                      <p className="text-xs text-gray-500">{stats.totalGuests} guest(s) added</p>
                    </div>
                  </div>
                )}
                {stats.budgetTotal > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <DollarSign className="size-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Budget Tracking</p>
                      <p className="text-xs text-gray-500">
                        ${stats.budgetSpent.toLocaleString()} spent of ${stats.budgetTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="size-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Book vendors early</p>
                  <p className="text-xs text-gray-500">Popular vendors book up 12-18 months in advance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="size-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Create a budget buffer</p>
                  <p className="text-xs text-gray-500">Add 10-15% extra for unexpected costs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="size-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Send invites on time</p>
                  <p className="text-xs text-gray-500">Mail invitations 6-8 weeks before the wedding</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
