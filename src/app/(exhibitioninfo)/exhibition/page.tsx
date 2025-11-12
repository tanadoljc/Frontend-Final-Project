'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ExhibitionPage() {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="m-[50px]">
      <div className="flex justify-between">
        <h1 className="text-2xl">Exhibition List</h1>
        {/* {session.data?.user && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push('/exhibitioninfo/create')}
          >
            Create Exhibition
          </button>
        )} */}
      </div>
    </div>
  );
}
