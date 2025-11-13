export default async function updateBooking(
  id: string,
  boothType: string,
  amount: number,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        boothType: boothType,
        amount: amount,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('fail to update booking');
  }

  return await res.json();
}
