'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  ClipboardDocumentListIcon,
  MapIcon,
  MapPinIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Jobs', href: '/jobs', icon: ClipboardDocumentListIcon },
  { name: 'Transportation', href: '/transportation', icon: MapIcon },
  { name: 'Route Planning', href: '/route-planning', icon: MapPinIcon },
  { name: 'AI Tools', href: '/ai-tools', icon: SparklesIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-white">TMS AI Tools</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/20'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="flex items-center">
            <button className="p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 transition-all duration-200">
              <span className="sr-only">User menu</span>
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-blue-600 text-sm font-bold">U</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden">
        <div className="px-4 pt-2 pb-3 space-y-2 bg-blue-700">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                )}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}