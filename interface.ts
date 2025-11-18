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

export interface BookingForm {
  exhibition: string;
  boothType: 'small' | 'big';
  amount: number;
}

export interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
  posterPicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  exhibition: Exhibition;
  boothType: 'small' | 'big';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'member';
}
