'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BookingForm, Exhibition } from '../../../../../../interface';
import getBookings from '@/libs/getBookings';
import addBooking from '@/libs/addBooking';
import { BookingItem } from '../../../../../../interface';
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
  const [totalBooked, setTotalBooked] = useState(0);

  useEffect(() => {
    if (session.status === 'authenticated') {
      if (typeof id === 'string') {
        getExhibition(id)
          .then((data) => setExhibition(data.data))
          .catch((err) => console.log(err));
      }

      getBookings(session.data.user.token)
        .then((bookings) => {
          const userId = session.data.user._id;

          if (!Array.isArray(bookings.data)) return;

          // Filter booking ของ user + exhibition
          const filtered = bookings.data.filter(
            (b: BookingItem) => b.user._id === userId && b.exhibition._id === id
          );

          // sum จำนวนที่จองไปแล้ว
          var tmp = filtered.reduce(
            (sum: any, b: BookingItem) => sum + b.amount,
            0
          );
          setTotalBooked(tmp);
        })
        .catch((err) => console.log(err));
    }
  }, [session, id]);

  const handleCreate = async () => {
    const token = session.data?.user.token;
    if (!token) {
      setMessage('User token missing. Please login again.');
      return;
    }
    console.log(totalBooked);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // เวลาเริ่มต้นของวันนี้

    if (exhibition) {
      const startDate = new Date(exhibition.startDate); // สร้าง Date object จริง
      startDate.setHours(0, 0, 0, 0); // reset เวลาเพื่อเปรียบเทียบเฉพาะวัน

      if (startDate < todayDate) {
        setMessage('The Exhibition has already started!');
        return;
      }
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
      amount > exhibition.smallBoothQuota
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

    if (totalBooked + amount > 6) {
      setMessage(
        `You cannot book more than 6 booths in this exhibition. You already booked ${totalBooked} booths.`
      );
      return;
    }

    setMessage('');
    try {
      const form: BookingForm = {
        exhibition: String(id),
        boothType,
        amount,
      };

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
    <main className="min-h-screen flex flex-col justify-center items-center">
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

        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-black">
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
