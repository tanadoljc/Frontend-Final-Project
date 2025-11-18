'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import updateBooking from '@/libs/updateBooking';
import getBooking from '@/libs/getBooking';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BookingForm, Exhibition } from '../../../../../../interface';
import addBooking from '@/libs/addBooking';
import getExhibition from '@/libs/getExhibition';

export default function CreateBookingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [boothType, setBoothType] = useState<'small' | 'big' | ''>('');
  const [amount, setAmount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const session = useSession();
  const router = useRouter();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);

  useEffect(() => {
    if (session.status === 'authenticated' && typeof id === 'string') {
      getExhibition(id)
        .then((data) => setExhibition(data.data))
        .catch((err) => console.log(err));
    }
  }, []);

  const handleCreate = async () => {
    const token = session.data?.user.token;
    if (!token) {
      setMessage('User token missing. Please login again.');
      return;
    }

    if (!boothType) {
      setMessage('Please select a booth type.');
      return;
    }
    if (amount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    if (
      exhibition &&
      boothType === 'small' &&
      amount > exhibition?.smallBoothQuota
    ) {
      setMessage('Not enough quota for small booth!');
      return;
    }
    if (
      exhibition &&
      boothType === 'big' &&
      amount > exhibition.bigBoothQuota
    ) {
      setMessage('Not enough quota for big booth!');
      return;
    }

    setMessage('');
    try {
      const form: BookingForm = {
        exhibition: String(id),
        boothType,
        amount,
      }

      await addBooking(form, token);
      setMessage('Booking created successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error creating booking.');
    } finally {
      setLoading(false);
    }

    router.push('/mybooking');
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[400px]">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Book This Exhibition
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
          onClick={handleCreate}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Booking...' : 'Book'}
        </button>

        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </main>
  );
}
