'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import addExhibition from '@/libs/addExhibition';
import { ExhibitionForm } from '../../../../../interface';
import { useSession } from 'next-auth/react';

export default function CreateExhibitionPage() {
  const { data: session, status } = useSession();
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session) {
      alert('You must be logged in');
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

    try {
      const res = await addExhibition(form, session.user.token);
      alert('Created successfully!');
      console.log('Created exhibition:', res.data);
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || 'Error creating exhibition');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create Exhibition</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="name">Name</label>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
          className="border p-2 w-full rounded-md"
          required
        />
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={form.description}
          className="border p-2 w-full rounded-md"
        />
        <label>Venue</label>
        <input
          name="venue"
          placeholder="Venue"
          onChange={handleChange}
          value={form.venue}
          className="border p-2 w-full rounded-md"
          required
        />
        <label>Date</label>
        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          value={form.startDate}
          className="border p-2 w-full rounded-md"
          required
        />
        {warnDate ? (
          <p className="text-red-500 text-sm">
            Invalid: Start Date cannot be before today
          </p>
        ) : (
          ''
        )}
        <label htmlFor="">Duration Day</label>
        <input
          name="durationDay"
          type="number"
          placeholder="Duration (days)"
          onChange={handleChange}
          value={form.durationDay}
          className="border p-2 w-full rounded-md"
          required
        />
        <label htmlFor="">Small Booth</label>
        <input
          name="smallBoothQuota"
          type="number"
          placeholder="Small booth quota"
          onChange={handleChange}
          value={form.smallBoothQuota}
          className="border p-2 w-full rounded-md"
          required
        />
        <label htmlFor="">Big Booth</label>
        <input
          name="bigBoothQuota"
          type="number"
          placeholder="Big booth quota"
          onChange={handleChange}
          value={form.bigBoothQuota}
          className="border p-2 w-full rounded-md"
          required
        />
        <label htmlFor="">Poster Picture</label>
        <input
          name="posterPicture"
          placeholder="Poster URL"
          onChange={handleChange}
          value={form.posterPicture}
          className="border p-2 w-full rounded-md"
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  );
}
