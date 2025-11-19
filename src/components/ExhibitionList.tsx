'use client';
import { useEffect, useState } from 'react';
import { Exhibition } from '../../interface';
import getExhibitions from '@/libs/getExhibitions';
import deleteExhibition from '@/libs/deleteExhibition';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import checkImageUrl from '@/utils/checkImageUrl'; // <- new import

// Define a map to store the image validation status for each exhibition ID
interface ImageValidationMap {
  [exhibitionId: string]: boolean;
}

export default function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageValidities, setImageValidities] = useState<ImageValidationMap>({}); // New state for image validation
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExhibitions();
        const fetchedExhibitions: Exhibition[] = data.data;
        setExhibitions(fetchedExhibitions);

        const validationPromises = fetchedExhibitions.map((ex) =>
          checkImageUrl(ex.posterPicture).then((isValid) => ({
            id: ex._id,
            isValid,
          }))
        );

        const results = await Promise.all(validationPromises);
        
        const newValidities = results.reduce((acc, result) => {
          acc[result.id] = result.isValid;
          return acc;
        }, {} as ImageValidationMap);

        setImageValidities(newValidities);
      } catch (err) {
        console.error(err);
        setError('Failed to load exhibitions.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    if (status !== 'loading' && status !== 'authenticated') {
        setLoading(false); 
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!session?.user.token) {
      alert('You must be logged in to delete an exhibition.');
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
      alert('Failed to delete the exhibition.');
    }
  };

  const handleEdit = (id: string) => {
    if (!session?.user.token || session.user.role !== 'admin') {
      alert('You must be an admin to edit an exhibition.');
      return;
    }

    router.push(`/exhibition/edit/${id}`);
  };

  const handleBooking = async (id: string) => {
    if (!session?.user.token || session.user.role !== 'member') {
      alert('You must login to book an exhibition.');
      return;
    }

    router.push(`/exhibition/create-booking/${id}`);
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
      {exhibitions.length === 0 ? (
        <p className="text-gray-500">You have no exhibitions yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {exhibitions.map((exhibition) => {
            const isImageValid = imageValidities[exhibition._id];
            
            return (
              <div
                key={exhibition._id}
                className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between">
                  <div>
                    {isImageValid === true ? (
                      <img
                        src={exhibition.posterPicture}
                        alt="Exhibition Poster"
                        className="rounded-lg w-[75%] h-[100px] bg-black"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : isImageValid === false ? (
                        <div className="w-[100%] h-[100px] bg-gray-200 flex items-center justify-center rounded-lg text-xs text-gray-500">
                            Image Not Found
                        </div>
                    ) : (
                        <div className="w-[30%] h-[100px] bg-gray-100 animate-pulse rounded-lg"></div>
                    )}
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">
                      {exhibition.name}
                    </h2>
                  </div>
                  { session && session.user.role === 'admin' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(exhibition._id)}
                        className="border w-[70px] h-[50px] rounded-md cursor-pointer bg-blue-400 transition duration-200 hover:shadow-xl hover:text-white hover:border-black hover:bg-blue-500 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exhibition._id)}
                        className="border w-[70px] h-[50px] rounded-md cursor-pointer bg-red-400 transition duration-200 hover:shadow-xl hover:text-white hover:border-black hover:bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  { session && session.user.role === 'member' && (
                    <button
                      onClick={() => handleBooking(exhibition._id)}
                      className="border w-[70px] h-[50px] rounded-md cursor-pointer bg-green-500 transition duration-200 hover:shadow-xl hover:text-white hover:border-black hover:bg-green-600 text-white"
                    >
                      Book
                    </button>
                  )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}