'use client';

import Link from 'next/link';
import TopMenuItem from './TopMenuItem';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User } from '../../interface';
import getMe from '@/libs/getMe';
import { useRouter } from 'next/navigation';

export default function TopMenu() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status == 'authenticated') {
      getMe(session?.user?.token || '')
        .then((u) => setUser(u.data))
        .catch((err) => console.error(err));
    }
  }, [status, session]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-[75px] border-b-2 border-black bg-white flex items-center justify-between px-4">
        <div className="flex gap-9">
          <Link href="/" className="text-black-400 font-bold text-xl m-2">
            Exhibition
          </Link>
          <TopMenuItem title="Exhibition List" pageRef="/exhibition" />
          <TopMenuItem title="My Booking" pageRef="/mybooking" />
        </div>

        <div className="flex items-center h-full px-4">
          {session ? (
            <div>
              <p className="inline mx-4">
                {session.user.name} ({user?.role})
              </p>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-red-500 font-bold hover:underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex">
              <button
                onClick={() => signIn(undefined, { callbackUrl: '/' })}
                className="text-cyan-600 hover:underline cursor-pointer"
              >
                Sign in
              </button>
              <p className="m-3">/</p>
              <button
                onClick={() => router.push('/register')}
                className="text-cyan-600 hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="h-[75px]" />
    </>
  );
}
