'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUserProfile({
  initialData,
  token,
}: {
  initialData: {
    name: string;
    email: string;
    tel: string;
    profilePicture: string;
  };
  token: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    tel: initialData.tel || '',
    profilePicture: initialData.profilePicture || '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Logging you in...');

      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4 font-bold">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-80 space-y-3">
        {/* <img
          src={form.profilePicture}
          alt="Profile Picture"
          className="rounded-lg w-[75%] bg-black my-8 mx-auto"
        /> */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="tel"
          placeholder="Phone Number"
          value={form.tel}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="url"
          name="profilePicture"
          placeholder="Profile Picture URL"
          value={form.profilePicture}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={form.confirmNewPassword}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          disabled={loading}
          className="bg-green-500 text-white my-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Editing...' : 'Edit'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
}
