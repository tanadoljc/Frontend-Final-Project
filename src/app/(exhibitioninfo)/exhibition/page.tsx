'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import getMe from '../../../libs/getMe'; // Adjusted import path
import { useEffect } from 'react';
import { useState } from 'react';
import { User } from '../../../../interface';

export default function ExhibitionPage() {
  const router = useRouter();
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe(session.data?.user?.token || '')
      .then((u) => setUser(u.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="m-[50px]">
      <div className="flex justify-between">
        <h1 className="text-2xl">Exhibition List</h1>
        {user && user.role == 'admin' ? (
          <button
            className="px-4 py-2 cursor-pointer rounded-xl border-2 border-black hover:bg-blue-500 hover:text-white transition duration-200"
            onClick={() => router.push('/exhibition/create')}
          >
            Create Exhibition
          </button>
        ) : null}
      </div>
    </div>
  );
}
