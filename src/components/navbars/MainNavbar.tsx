'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CldImage } from 'next-cloudinary';
import { useUserData } from '@/hooks/useUserData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  MessageSquare,
  Users,
  Sprout,
  Calendar,

  ShoppingCart,
  Search,
  ChevronDown
} from 'lucide-react';

// interface SearchResult {
//   id: string;
//   username: string;
//   name: string;
//   avatar?: string;
// }

export default function Navbar() {
  const { user } = useUserData();
  // const { unreadCount } = useNotifications();
  // const [isOpen, setIsOpen] = useState(false);
  // const [isMobileOpen, setIsMobileOpen] = useState(false);
  // const [isScrolled, setIsScrolled] = useState(false);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // const [isSearching, setIsSearching] = useState(false);
  // const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // const searchInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      active: pathname?.startsWith('/messages')
    },
    {
      name: 'Connections',
      href: '/network',
      icon: Users,
      active: pathname?.startsWith('/network')
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      icon: ShoppingCart,
      active: pathname?.startsWith('/marketplace')
    },
    {
      name: 'Events',
      href: '/events',
      icon: Calendar,
      active: pathname?.startsWith('/events')
    },
    // {
    //   name: 'Notification',
    //   href: '/notification',
    //   icon: BellDot,
    //   active: pathname?.startsWith('/notification'),
    //   badge: unreadCount > 0 ? unreadCount : null
    // },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Search */}
          <div className="flex items-center space-x-10">
            {/* Logo with active indicator */}
            <Link
              href="/dashboard"
              className={`flex items-center h-full px-2}`}
            >
              <Sprout className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="ml-2 text-xl font-bold text-green-800 dark:text-green-300">
                Soil Social
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                type="search"
                placeholder="Search for farmers, posts, crops..."
                className="pl-10 w-64 lg:w-96 rounded-full bg-gray-50 dark:bg-gray-700 focus-visible:ring-green-500 dark:focus-visible:ring-green-400"
              />
            </div>
          </div>

          {/* Right side - Navigation Icons */}
          <div className="flex items-center space-x-4 h-full">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Navigation Items with bottom border indicators */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`h-full flex items-center px-4 ${item.active ? 'border-b-2 border-green-600 dark:border-green-400' : ''}`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`flex flex-col h-full gap-1  ${item.active ? 'text-green-600 dark:text-green-400' : ''}`}
                >
                  <item.icon className="h-6 w-6 min-w-6 min-h-6 aspect-square" />
                  {/* {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )} */}

                  <span className="text-white text-[10px]">{item.name}</span>
                </Button>
              </Link>
            ))}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="relative border-none outline-none bg-transparent text-white h-10 w-10 flex flex-col items-center justify-centerl gap-1 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    {user.profilePicture ? (
                      <CldImage
                        src={user.profilePicture}
                        width={32}
                        height={32}
                        alt="Profile"
                        className="rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {user.name?.charAt(0) || 'R'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <p className='text-[10px] flex'>Me<ChevronDown /></p>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    👤 View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    ⚙️ Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900 cursor-pointer"
                  onClick={() => signOut()}
                >
                  🚪 Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}