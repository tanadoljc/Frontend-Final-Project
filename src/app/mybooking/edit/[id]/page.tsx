'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import updateBooking from '@/libs/updateBooking';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditBookingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [boothType, setBoothType] = useState<'small' | 'big'>('small');
  const [amount, setAmount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const session = useSession();
  const router = useRouter();

  const handleUpdate = async () => {
    if (!id || Array.isArray(id)) {
      setMessage('Invalid booking ID.');
      return;
    }

    const token = session.data?.user.token;
    if (!token) {
      setMessage('User token missing. Please login again.');
      return;
    }

    if (amount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await updateBooking(id, boothType, amount, token);
      setMessage('Booking updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error updating booking.');
    } finally {
      setLoading(false);
    }

    router.push('/mybooking');
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[400px]">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Edit Booking ID:
        </h2>
        <h1 className="text-2xl font-bold text-blue-500 mb-6">{id}</h1>

        {/* Booth Type Radio Buttons */}
        <div className="flex flex-col gap-2 mb-4 text-left">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Booth Type
          </span>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="boothType"
              value="small"
              checked={boothType === 'small'}
              onChange={() => setBoothType('small')}
              className="form-radio"
            />
            Small
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="boothType"
              value="big"
              checked={boothType === 'big'}
              onChange={() => setBoothType('big')}
              className="form-radio"
            />
            Big
          </label>
        </div>

        {/* Amount Input */}
        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={1}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Updating...' : 'Update Booking'}
        </button>

        {message && (
          <p
            className={`mt-4 ${
              message.includes('Error') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
