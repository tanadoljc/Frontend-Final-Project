'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import getMe from '../../../libs/getMe'; // Adjusted import path
import { useEffect } from 'react';
import { useState } from 'react';
import { User } from '../../../../interface';
import ExhibitionList from '@/components/ExhibitionList';

// TODO: Add filter & search function

export default function ExhibitionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (status == 'authenticated') {
      getMe(session.user.token || '')
        .then((u) => setUser(u.data))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <>
      <div className="flex justify-between max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Exhibition List</h1>
        {user && user.role == 'admin' ? (
          <button
            className="px-4 py-2 cursor-pointer rounded-xl border-2 hover:bg-blue-500 hover:text-white transition duration-200"
            onClick={() => router.push('/exhibition/create')}
          >
            Create Exhibition
          </button>
        ) : null}
      </div>
      <ExhibitionList></ExhibitionList>
    </>
  );
}
