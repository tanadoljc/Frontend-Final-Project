export default async function updateExhibition(
  id: string,
  name: string,
  description: string,
  venue: string,
  startDate: string,
  durationDay: number,
  smallBoothQuota: number,
  bigBoothQuota: number,
  posterPicture: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/exhibitions/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        venue: venue,
        startDate: startDate,
        durationDay: durationDay,
        smallBoothQuota: smallBoothQuota,
        bigBoothQuota: bigBoothQuota,
        posterPicture: posterPicture,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('fail to update exhibition');
  }

  return await res.json();
}
