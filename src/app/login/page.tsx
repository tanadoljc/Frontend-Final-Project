'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import userLogIn from '@/libs/userLogin';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4 font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col w-80 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-500 text-white py-2 rounded">Login</button>
        <div className="flex gap-0 justify-center text-sm">
          <p>Does not have an account yet?</p>
          <p
            className="mx-2 text-blue-500 underline cursor-pointer"
            onClick={() => router.push('/register')}
          >
            Register
          </p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
