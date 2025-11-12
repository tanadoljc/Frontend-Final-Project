'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import addExhibition from '@/libs/addExhibition';
import { ExhibitionForm } from '../../../../../interface';

export default function CreateExhibitionPage() {
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

    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value, // แปลงตัวเลขอัตโนมัติ
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await addExhibition(form);
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
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
          className="border p-2 w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={form.description}
          className="border p-2 w-full"
        />
        <input
          name="venue"
          placeholder="Venue"
          onChange={handleChange}
          value={form.venue}
          className="border p-2 w-full"
        />
        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          value={form.startDate}
          className="border p-2 w-full"
        />
        <input
          name="durationDay"
          type="number"
          placeholder="Duration (days)"
          onChange={handleChange}
          value={form.durationDay}
          className="border p-2 w-full"
        />
        <input
          name="smallBoothQuota"
          type="number"
          placeholder="Small booth quota"
          onChange={handleChange}
          value={form.smallBoothQuota}
          className="border p-2 w-full"
        />
        <input
          name="bigBoothQuota"
          type="number"
          placeholder="Big booth quota"
          onChange={handleChange}
          value={form.bigBoothQuota}
          className="border p-2 w-full"
        />
        <input
          name="posterPicture"
          placeholder="Poster URL"
          onChange={handleChange}
          value={form.posterPicture}
          className="border p-2 w-full"
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
