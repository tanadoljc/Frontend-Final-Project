export default function BookingList() {
  const mockExhibitionsItems = [
    {
      fullname: 'Tanadol Jaichuen',
      date: '2024-07-01',
      Tel: '0812345678',
      exhibition: 'Impressionist Art Expo',
    },
    {
      fullname: 'Eiei',
      date: '2024-07-01',
      Tel: '0812345678',
      exhibition: 'Impressionist Art Expo',
    },
  ];

  if (!mockExhibitionsItems.length || mockExhibitionsItems.length === 0) {
    return (
      <main className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold my-4">My Bookings</h1>
        <p>You have no bookings yet.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center w-full">
      <h1 className="text-2xl font-semibold my-5">Exhibition Bookings</h1>
      {mockExhibitionsItems.map((item, index) => (
        <div
          key={index}
          className="w-[50%] border border-gray-300 rounded-lg p-4 mb-4 shadow-md"
        >
          <h2 className="text-xl font-bold mb-2">{item.exhibition}</h2>
          <p className="mb-1">
            <span className="font-semibold">Full Name:</span> {item.fullname}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Date:</span> {item.date}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Telephone:</span> {item.Tel}
          </p>
          <div className="flex justify-end gap-2">
            <button className="bg-green-400 text-white rounded-md p-3 hover:shadow hover:border-2 hover:border-black">
              Edit Booking
            </button>
            <button className="bg-red-400 text-white rounded-md p-3 hover:shadow hover:border-2 hover:border-black">
              Cancel Booking
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
