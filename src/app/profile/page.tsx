'use client'

import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import { getServerSession } from "next-auth"
import getMe from "@/libs/getMe"
import Link from "next/link"
import checkImageUrl from "@/utils/checkImageUrl";
import PictureFrame from "@/components/PictureFrame";
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [isImageValid, setIsImageValid] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'authenticated') {
          const fetechedProfile = await getMe(session?.user.token);
          setProfile(fetechedProfile.data);
          setCreatedAt(new Date(fetechedProfile.data.createdAt));

          const isValid = await checkImageUrl(fetechedProfile.data.profilePicture);
          setIsImageValid(isValid);
        }
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
  }, [status, session]);

  if (loading)
    return (
      <div className="flex flex-col items-center mt-[100px]">
        <p className="p-6 text-gray-500 text-center text-xl">
          Loading your bookings...
        </p>
      </div>
    );
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <main className='w-[100%] flex flex-col items-center space-y-4 gap-y-4'>
      {isImageValid && (<img
        src={profile.profilePicture}
        alt="Profile Picture"
        className="rounded-lg w-[25%] bg-black my-8"
      />)}

      <div className='text-2xl font-bold'>
        {profile.name}
      </div>
      <table className='table-auto border-separate border-spacing-2'>
        <tbody>
          <tr>
            <td className='font-bold'>Email</td>
            <td>{profile.email}</td>
          </tr>
          <tr>
            <td className='font-bold'>Tel.</td>
            <td>{profile.tel}</td>
          </tr>
          <tr>
            <td className='font-bold'>Member Since</td>
            <td>{createdAt?.toString()}</td>
          </tr>
        </tbody>
      </table>
      <Link
        href="/profile/edit"
        className="inline-block px-6 py-3 bg-green-500 text-white rounded-md hover:bg-blue-700 transition"
        aria-label="Edit Profile"
      >
        Edit Profile
      </Link>
    </main>
  )
}