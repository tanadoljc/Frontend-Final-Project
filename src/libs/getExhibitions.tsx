export default async function getExhibitions() {
  const res = await fetch(`${process.env.BACKEND_URL}/api/exhibitions/`);

  if (!res.ok) {
    throw new Error('Failed to fetch exhibition data');
  }

  return await res.json();
}
