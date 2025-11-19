'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    tel: '',
    password: '',
    profilePicture: '',
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Logging you in...');

      // Automatically sign in after registration
      await signIn(undefined, {
        email: form.email,
        password: form.password,
        callbackUrl: '/',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4 font-bold">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-80 space-y-3">
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
          value={form.profilePicture}
          placeholder="Profile Picture URL"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          disabled={loading}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <button
          onClick={() => signIn(undefined, { callbackUrl: '/' })}
          className="text-cyan-600 hover:underline cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
