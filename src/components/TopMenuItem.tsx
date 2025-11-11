import Link from 'next/link';

export default function TopMenuItem({
  title,
  pageRef,
}: {
  title: string;
  pageRef: string;
}) {
  return (
    <Link
      href={pageRef}
      className="text-blue-400 w-[120px] flex items-center justify-center text-center text-md"
    >
      {title}
    </Link>
  );
}
