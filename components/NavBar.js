import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <img src="/assets/logo.png" alt="StatPulse Logo" className="h-10" />
        </Link>
        <div className="space-x-4">
          <Link href="/about"><a className="text-white">About</a></Link>
          <Link href="/stats"><a className="text-white">Stats</a></Link>
        </div>
      </div>
    </nav>
  );
}
