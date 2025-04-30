'use client';
import { usePathname } from 'next/navigation';
import AuthNavbar from './AuthNavbar';
import MainNavbar from './MainNavbar';

const noNavbarPaths = ['/sign-in', '/sign-up', '/verify-email'];

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Return null for auth paths
  if (noNavbarPaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  // Return AuthNavbar only for root path
  if (pathname === '/') {
    return <AuthNavbar />;
  }

  // Return MainNavbar for all other paths
  return <MainNavbar />;
}