export interface ExhibitionForm {
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
  posterPicture: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'member';
}
