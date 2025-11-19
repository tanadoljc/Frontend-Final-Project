'use client'

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from 'next/link';

export default function Home() {
  const images = Array.from({ length: 9 }, (_, i) => `/img/cpjobfair${i + 1}.jpg`);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className='text-center text-4xl my-8 font-bold'>Welcome to the Exhibition Booth Booking System!</h1>

      <Carousel showThumbs={false} autoPlay infiniteLoop>
        {images.map((imageSrc, idx) => (
          <div key={`slide-${idx + 1}`}>
            <img
              className="w-full max-w-[480px] mx-auto"
              src={imageSrc}
              alt={`cpjobfair ${idx + 1}`}
            />
          </div>
        ))}
      </Carousel>

      <div className="mt-6">
        <Link
          href="/exhibition"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          aria-label="View exhibitions"
        >
          View Exhibitions
        </Link>
      </div>
    </main>
  );
}
