'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ExhibitionForm } from '../../../../../../interface';
import updateExhibition from '@/libs/updateExhibition';
import getExhibition from '@/libs/getExhibition';

export default function EditExhibitionPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [warnDate, setWarnDate] = useState(false);
  const [form, setForm] = useState<ExhibitionForm>({
      name: '',
      description: '',
      venue: '',
      startDate: '',
      durationDay: 1,
      smallBoothQuota: 0,
      bigBoothQuota: 0,
      posterPicture: '',
    });
  const [message, setMessage] = useState('');
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated' && typeof id === 'string') {
      getExhibition(id)
        .then((data) => setForm({
          name: data.data.name,
          description: data.data.description,
          venue: data.data.venue,
          startDate: data.data.startDate.split("T")[0],
          durationDay: data.data.durationDay,
          smallBoothQuota: data.data.smallBoothQuota,
          bigBoothQuota: data.data.bigBoothQuota,
          posterPicture: data.data.posterPicture,
        }))
        .catch((err) => console.log(err));
    }
  }, []);

  const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
  
      if (name == 'startDate') {
        const startDate = new Date(value);
        startDate.setHours(0, 0, 0, 0);
  
        if (startDate < todayDate) {
          setWarnDate(true);
          return;
        } else {
          setWarnDate(false);
        }
      }
  
      setForm((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value, // แปลงตัวเลขอัตโนมัติ
      }));
    };

  const handleUpdate = async () => {
    if (!id || Array.isArray(id)) {
      setMessage('Invalid exhibition ID.');
      return;
    }

    const token = session.data?.user.token;
    if (!token) {
      setMessage('User token missing. Please login again.');
      return;
    }

    if (
      !form.name ||
      !form.description ||
      !form.venue ||
      !form.startDate ||
      form.durationDay <= 0 ||
      form.smallBoothQuota <= 0 ||
      form.bigBoothQuota <= 0
    ) {
      alert('Please fill all fields correctly');
      return;
    }

    setMessage('');
    try {
      await updateExhibition(
        id, 
        form.name,
        form.description,
        form.venue,
        form.startDate,
        form.durationDay,
        form.smallBoothQuota,
        form.bigBoothQuota,
        form.posterPicture,
        token);
      setMessage('Exhibition updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error updating exhibition.');
    } finally {
      setLoading(false);
    }

    router.push('/exhibition');
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[400px]">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Edit Exhibition ID:
        </h2>
        <h1 className="text-2xl font-bold text-blue-500 mb-6">{id}</h1>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
          className="border p-2 w-full rounded-md text-black"
          required
        />
        <label className="text-black">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={form.description}
          className="border p-2 w-full rounded-md text-black"
        />
        <label className="text-black">Venue</label>
        <input
          name="venue"
          placeholder="Venue"
          onChange={handleChange}
          value={form.venue}
          className="border p-2 w-full rounded-md text-black"
          required
        />
        <label className="text-black">Date</label>
        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          value={form.startDate}
          className="border p-2 w-full rounded-md text-black"
          required
        />
        {warnDate ? (
          <p className="text-red-500 text-sm">
            Invalid: Start Date cannot be before today
          </p>
        ) : (
          ''
        )}
        <label htmlFor="" className="text-black">Duration Day</label>
        <input
          name="durationDay"
          type="number"
          placeholder="Duration (days)"
          onChange={handleChange}
          value={form.durationDay}
          className="border p-2 w-full rounded-md text-black"
          required
        />
        <label htmlFor="" className="text-black">Small Booth</label>
        <input
          name="smallBoothQuota"
          type="number"
          placeholder="Small booth quota"
          onChange={handleChange}
          value={form.smallBoothQuota}
          className="border p-2 w-full rounded-md text-black"
          required
        />
        <label htmlFor="" className="text-black">Big Booth</label>
        <input
          name="bigBoothQuota"
          type="number"
          placeholder="Big booth quota"
          onChange={handleChange}
          value={form.bigBoothQuota}
          className="border p-2 w-full rounded-md text-black"
          required
        />
        <label htmlFor="" className="text-black">Poster Picture</label>
        <input
          name="posterPicture"
          placeholder="Poster URL"
          onChange={handleChange}
          value={form.posterPicture}
          className="border p-2 w-full rounded-md text-black"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white my-4 ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Updating...' : 'Update Exhibition'}
        </button>

        {message && <p className="mt-4 text-red-600">{message}</p>}
      </div>
    </main>
  );
}
