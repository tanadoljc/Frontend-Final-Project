import { ExhibitionForm } from '../../interface';
export default async function addExhibition(form: ExhibitionForm) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/exhibitions/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to add exhibition');
  }

  return await res.json();
}
