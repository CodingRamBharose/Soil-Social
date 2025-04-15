import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sprout } from 'lucide-react';

export default function AuthNavbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Sprout className="h-6 w-6 text-green-700 dark:text-green-600" />
            <span className="ml-2 text-xl font-bold text-green-800 dark:text-green-600">
              SoilSocial
            </span>
          </Link>
          
          {/* Auth buttons */}
          <div className="flex gap-2">
            <Button asChild className='border-none bg-transparent shadow-none px-4 rounded-full hover:bg-gray-100'>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className='border-2 text-green-600 border-green-600 bg-transparent shadow-none px-4 rounded-full hover:bg-gray-100'>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}