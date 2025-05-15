// components/NavBar.js
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <img src="/assets/logo.png" alt="StatPulse Logo" className="h-10 cursor-pointer" />
        </Link>
        <div className="space-x-4">
          <Link href="/about" className="text-white hover:text-blue-300">About</Link>
          <Link href="/stats" className="text-white hover:text-blue-300">Stats</Link>
          <Link href="/profile" className="text-white hover:text-blue-300">Profile</Link>
        </div>
      </div>
    </nav>
  );
}
