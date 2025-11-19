import getMe from '@/libs/getMe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import EditUserProfile from '@/components/EditUserProfile';

export default async function EditProfile() {
  let initialData = {
    name: '',
    email: '',
    tel: '',
    profilePicture: '',
  };
  const session = await getServerSession(authOptions);
  if (!session || !session.user.token) return null;

  try {
    const res = await getMe(session.user.token);
    initialData = {
      name: res.data.name,
      email: res.data.email,
      tel: res.data.tel,
      profilePicture: res.data.profilePicture,
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }

  return (
    <EditUserProfile 
      initialData={initialData} 
      token={session?.user.token || ''}
    />
  );
}
