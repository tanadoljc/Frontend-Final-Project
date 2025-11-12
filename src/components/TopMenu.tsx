'use client';

import Link from 'next/link';
import TopMenuItem from './TopMenuItem';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function TopMenu() {
  const { data: session } = useSession();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-[75px] border-b-2 border-black bg-white flex items-center justify-between px-4">
        <div className="flex gap-9">
          <Link href="/" className="text-black font-bold">
            Exhibition
          </Link>
          <TopMenuItem title="Exhibition List" pageRef="/exhibition" />
          <TopMenuItem title="My Booking" pageRef="/mybooking" />
        </div>

        <div className="flex items-center h-full px-4">
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-cyan-600 hover:underline cursor-pointer"
            >
              Sign out of {session.user.name}
            </button>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/' })}
              className="text-cyan-600 hover:underline cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <div className="h-[75px]" />
    </>
  );
}
