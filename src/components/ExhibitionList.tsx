'use client';
import { useEffect, useState } from 'react';
import { Exhibition } from '../../interface';
import getExhibitions from '@/libs/getExhibitions';
import deleteExhibition from '@/libs/deleteExhibition';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MyExhibitionList() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      getExhibitions()
        .then((data) => setExhibitions(data.data))
        .catch((err) => {
          console.error(err);
          setError('Failed to load exhibitions.');
        })
        .finally(() => setLoading(false));
    }
  }, [status, session]);

  const handleDelete = async (id: string) => {
    if (!session?.user.token) {
      alert('You must be logged in to delete a exhibition.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this exhibition?'
    );
    if (!confirmDelete) return;

    try {
      await deleteExhibition(id, session?.user.token);
      setExhibitions((prev) => prev.filter((b) => b._id !== id)); // update UI
    } catch (err) {
      console.error(err);
      alert('Failed to delete exhibition.');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/exhibition/edit/${id}`);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center mt-[100px]">
        <p className="p-6 text-gray-500 text-center text-xl">
          Loading your exhibitions...
        </p>
      </div>
    );
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Exhibition List</h1>

      {exhibitions.length === 0 ? (
        <p className="text-gray-500">You have no exhibitions yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition._id}
              className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <img src={exhibition.posterPicture} alt="Poster" className="my-3 rounded-md" />
                  <h2 className="text-lg font-semibold mb-2">
                    {exhibition.name}
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(exhibition._id)}
                    className="border w-[70px] rounded-md cursor-pointer bg-blue-400 transition duration-200 hover:shadow-xl hover:text-white hover:border-black hover:bg-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exhibition._id)}
                    className="border w-[70px] rounded-md cursor-pointer bg-red-400 transition duration-200 hover:shadow-xl hover:text-white hover:border-black hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Description:</strong> {exhibition.description}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Venue:</strong> {exhibition.venue}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Start Date:</strong>{' '}
                {new Date(exhibition.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Duration Day:</strong> {exhibition.durationDay}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Small Booth Quota:</strong> {exhibition.smallBoothQuota}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Big Booth Quota:</strong> {exhibition.bigBoothQuota}
              </p>

              <div className="mt-3 border-t pt-2 text-xs text-gray-500">
                <p>
                  Created:{' '}
                  {new Date(exhibition.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
