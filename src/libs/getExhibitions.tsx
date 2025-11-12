export default async function getExhibitions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/exhibitions/`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch exhibition data');
  }

  return await res.json();
}
