'use client';

import Link from 'next/link';
import TopMenuItem from './TopMenuItem';

export default function TopMenu() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-[75px] border-b-2 border-black bg-white flex items-center justify-between px-4">
        {/* <div className="absolute left-0 flex items-center h-full px-4">
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-sm text-cyan-600 hover:underline"
            >
              Sign out of {session.user?.name}
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-sm text-cyan-600 hover:underline"
            >
              Sign in
            </button>
          )}
        </div> */}
        <div>
          <Link href="/" className="text-black">
            Exhibition
          </Link>
        </div>
        <nav className="flex gap-6 text-cyan-600 text-sm">
          <TopMenuItem title="My Booking" pageRef="/mybooking" />
          <TopMenuItem title="Booking" pageRef="/booking" />
        </nav>
      </header>

      {/* Add padding to prevent content overlap */}
      <div className="h-[75px]" />
    </>
  );
}
