'use client';
import { useRouter } from 'next/navigation';

export default function ExhibitionPage() {
  const router = useRouter();
  return (
    <div>
      <h1>Exhibition Information</h1>
      <p>Details about the exhibition will go here.</p>
      <button
        onClick={(e) => {
          e.stopPropagation(), router.push('exhibition/create-exhibition');
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Exhibition
      </button>
    </div>
  );
}
