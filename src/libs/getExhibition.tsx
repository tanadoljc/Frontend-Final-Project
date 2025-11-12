export default async function getExhibition(exhibitionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/exhibitions/${exhibitionId}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch exhibition data');
  }

  return await res.json();
}
