export default async function getExhibition(exhibitionId: string) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/exhibitions/${exhibitionId}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch exhibition data');
  }

  return await res.json();
}
