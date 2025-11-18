import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import { getServerSession } from "next-auth"
import getMe from "@/libs/getMe"
import TopMenuItem from "@/components/TopMenuItem";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;

  const profile = await getMe(session.user.token);
  var createdAt = new Date(profile.data.createdAt);

  // TODO: add user profile
  return (
    <main className='w-[100%] flex flex-col items-center space-y-4 gap-y-4'>
      <div className='text-2xl mt-4'>
        {profile.data.name}
      </div>
      <table className='table-auto border-separate border-spacing-2'>
        <tbody>
          <tr>
            <td>Email</td>
            <td>{profile.data.email}</td>
          </tr>
          <tr>
            <td>Tel.</td>
            <td>{profile.data.tel}</td>
          </tr>
          <tr>
            <td>Member Since</td>
            <td>{createdAt.toString()}</td>
          </tr>
        </tbody>
      </table>
      <TopMenuItem title="Edit Profile" pageRef="/profile/edit" />
    </main>
  )
}