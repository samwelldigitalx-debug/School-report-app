import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface HeaderProps {
  user: {
    name: string;
    role: string;
    schoolName?: string;
  };
  onMenuClick: () => void;
}

export const Header = ({ user, onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search students, results..."
            className="w-64 py-2 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role.replace('-', ' ')}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
