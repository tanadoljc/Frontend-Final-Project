export default function checkImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export async function checkImageUrls(urls: string[]): Promise<boolean[]> {
  return Promise.all(urls.map((u) => checkImageUrl(u)));
}