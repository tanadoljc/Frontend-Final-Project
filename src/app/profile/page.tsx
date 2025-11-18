import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import { getServerSession } from "next-auth"
import getMe from "@/libs/getMe"
import Link from "next/link"

export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;

  const profile = await getMe(session.user.token);
  var createdAt = new Date(profile.data.createdAt);

  // TODO: add user profile
  return (
    <main className='w-[100%] flex flex-col items-center space-y-4 gap-y-4'>
      <div className='text-2xl mt-10 font-bold'>
        {profile.data.name}
      </div>
      <table className='table-auto border-separate border-spacing-2'>
        <tbody>
          <tr>
            <td className='font-bold'>Email</td>
            <td>{profile.data.email}</td>
          </tr>
          <tr>
            <td className='font-bold'>Tel.</td>
            <td>{profile.data.tel}</td>
          </tr>
          <tr>
            <td className='font-bold'>Member Since</td>
            <td>{createdAt.toString()}</td>
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