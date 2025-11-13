'use client';
import { useEffect, useState } from 'react';
import { BookingItem } from '../../interface';
import getBooking from '@/libs/getBooking';
import deleteBooking from '@/libs/deleteBooking';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MyBookingList() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      getBooking(session?.user.token)
        .then((data) => setBookings(data.data))
        .catch((err) => {
          console.error(err);
          setError('Failed to load bookings.');
        })
        .finally(() => setLoading(false));
    }
  }, [status, session]);

  const handleDelete = async (id: string) => {
    if (!session?.user.token) {
      alert('You must be logged in to delete a booking.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this booking?'
    );
    if (!confirmDelete) return;

    try {
      await deleteBooking(id, session?.user.token);
      setBookings((prev) => prev.filter((b) => b._id !== id)); // update UI
    } catch (err) {
      console.error(err);
      alert('Failed to delete booking.');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/mybooking/edit/${id}`);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center mt-[100px]">
        <p className="p-6 text-gray-500 text-center text-xl">
          Loading your bookings...
        </p>
      </div>
    );
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    {booking.exhibition.name}
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(booking._id)}
                    className="border w-[70px] rounded-md cursor-pointer bg-blue-400 transition duration-200 hover:shadow-xl hover:text-white hover:border-black hover:bg-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="border w-[70px] rounded-md cursor-pointer bg-red-400 transition duration-200 hover:shadow-xl hover:text-white hover:border-black hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Venue:</strong> {booking.exhibition.venue}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Start:</strong>{' '}
                {new Date(booking.exhibition.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Booth Type:</strong> {booking.boothType}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Amount:</strong> {booking.amount}
              </p>

              <div className="mt-3 border-t pt-2 text-xs text-gray-500">
                <p>
                  Created:{' '}
                  {new Date(booking.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p>
                  By: {booking.user.name} ({booking.user.email})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
