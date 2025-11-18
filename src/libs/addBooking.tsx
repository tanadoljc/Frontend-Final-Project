import { BookingForm } from '../../interface';
export default async function addBooking(
  form: BookingForm,
  token: string
) {
  console.log(form);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to add exhibition');
  }

  return await res.json();
}
