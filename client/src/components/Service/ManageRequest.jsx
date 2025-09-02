import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import bookingApi from '../../api/bookingApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';

const BookingManagement = () => {
  const { currentUser, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [pendingStatus, setPendingStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!loading) {
      fetchBookings();
    }
  }, [loading, currentUser]);

  const fetchBookings = async () => {
    try {
      const data = currentUser.role === 'user' 
        ? await bookingApi.getUserBookings()
        : await bookingApi.getAllBookings();
      console.log(data)
        setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const openStatusDialog = (booking, status) => {
    setSelectedBooking(booking);
    setPendingStatus(status);
    setAdminNotes('');
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !pendingStatus) return;

    try {
      // First update the booking status
      console.log(selectedBooking._id)
      await bookingApi.updateBookingStatus(
        selectedBooking._id,
        pendingStatus,
        adminNotes
      );

      // // Check user's email notification preference for both approval and rejection
      // if (selectedBooking.userId.emailNotifications) {
      //   try {
      //     await bookingApi.sendBookingNotification({
      //       userId: selectedBooking.userId._id,
      //       bookingId: selectedBooking._id,
      //       serviceName: selectedBooking.serviceId.name,
      //       bookingDate: selectedBooking.date,
      //       timeSlot: selectedBooking.timeSlot,
      //       adminNotes: adminNotes
      //     });
      //   } catch (emailError) {
      //     console.error('Failed to send email notification:', emailError);
      //     // Don't show this error to admin since the booking was still updated successfully
      //   }
      // }

      toast.success('Booking status updated');
      setIsDialogOpen(false);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <SidebarNavigation/>
    <MainLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {currentUser?.role === 'user' ? 'My Bookings' : 'Manage Bookings'}
      </h1>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{booking.serviceId.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot.startTime}
                </p>
                {currentUser?.role !== 'user' && (
                  <p className="text-sm">
                    Booked by: {booking.userId?.email}
                  </p>
                )}
                {booking.notes && (
                  <p className="text-sm mt-2">Customer Notes: {booking.notes}</p>
                )}
                {booking.adminNotes && (
                  <p className="text-sm mt-2 text-gray-700">
                    Admin Notes: {booking.adminNotes}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                
                {(currentUser?.role === 'admin' || currentUser.role === 'superadmin') && 
                 booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openStatusDialog(booking, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openStatusDialog(booking, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-md">
          <button 
            onClick={() => setIsDialogOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-800 dark:data-[state=open]:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              {pendingStatus === 'approved' ? 'Approve' : 'Reject'} Booking
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Add any relevant notes about your decision to {pendingStatus === 'approved' ? 'approve' : 'reject'} this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Admin Notes
              <span className="text-gray-400 dark:text-gray-500 ml-1">(optional)</span>
            </label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Enter any notes about this decision..."
              className="min-h-24 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant={pendingStatus === 'approved' ? 'default' : 'destructive'}
              onClick={handleStatusUpdate}
              className={pendingStatus === 'approved' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'}
            >
              {pendingStatus === 'approved' ? 'Approve' : 'Reject'} Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </MainLayout>
    </>

  );
};

export default BookingManagement;