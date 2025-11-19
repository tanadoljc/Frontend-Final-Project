'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import updateBooking from '@/libs/updateBooking';
import getBooking from '@/libs/getBooking';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Exhibition } from '../../../../../interface';
import getBookings from '@/libs/getBookings';

export default function EditBookingPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [boothType, setBoothType] = useState<'small' | 'big'>('small');
  const [amount, setAmount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [exhibition, setExhibition] = useState<Exhibition | null>();
  const [oldBoothType, setOldBoothType] = useState<'small' | 'big'>('small');
  const [oldAmount, setOldAmount] = useState<number>(0);
  const [oldTotalBooked, setOldTotalBooked] = useState<number>(0);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async() => {
      if (session.status === 'authenticated' && typeof id === 'string') {
        await getBooking(session.data?.user.token, id)
          .then((data) => {
            setExhibition(data.data.exhibition)
            setOldBoothType(data.data.boothType);
            setOldAmount(data.data.amount);

            console.log(data.data.boothType, data.data.amount, data.data.exhibition.smallBoothQuota, data.data.exhibition.bigBoothQuota);
          })
          .catch((err) => console.log(err));

        let totalBooked = 0;
        await getBookings(session.data?.user.token)
          .then((data) => {
            totalBooked += data.data.amount;
          })
          .catch((err) => console.log(err));
        setOldTotalBooked(totalBooked);
      }
    }

    fetchData();
  }, []);

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

    if (
      exhibition &&
      boothType === 'small' &&
      amount > exhibition.smallBoothQuota + (oldBoothType === 'small' ? oldAmount : 0)
    ) {
      setMessage('Not enough quota for small booth!');
      return;
    }
    if (
      exhibition &&
      boothType === 'big' &&
      amount > exhibition.bigBoothQuota + (oldBoothType === 'big' ? oldAmount : 0)
    ) {
      setMessage('Not enough quota for big booth!');
      return;
    }

    console.log(oldTotalBooked, amount, oldAmount, oldBoothType);

    if (oldTotalBooked + amount - oldAmount > 6) {
      setMessage(
        `You cannot book more than 6 booths in this exhibition. You already booked ${oldTotalBooked - oldAmount} booths.`
      );
      return;
    }

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
    <main className="min-h-screen flex flex-col justify-center items-center">
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
          <label className="inline-flex items-center gap-2 text-black">
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
          <label className="inline-flex items-center gap-2 text-black">
            <input
              type="radio"
              name="boothType"
              value="big"
              checked={boothType === 'big'}
              onChange={() => setBoothType('big')}
              className="form-radio text-black"
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
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

        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </main>
  );
}
