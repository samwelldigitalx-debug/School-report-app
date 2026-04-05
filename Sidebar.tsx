import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  LogOut, 
  CreditCard, 
  History, 
  CheckSquare, 
  MessageSquare,
  School as SchoolIcon,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '@/src/types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg group',
      active 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    )}
  >
    <span className={cn('mr-3 transition-colors', active ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-900')}>
      {icon}
    </span>
    {label}
  </button>
);

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ role, activeTab, setActiveTab, onLogout, isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['super-admin', 'school-admin', 'teacher'] },
    { id: 'schools', label: 'Schools', icon: <SchoolIcon size={20} />, roles: ['super-admin'] },
    { id: 'classes', label: 'Classes', icon: <GraduationCap size={20} />, roles: ['school-admin'] },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen size={20} />, roles: ['school-admin'] },
    { id: 'teachers', label: 'Teachers', icon: <Users size={20} />, roles: ['school-admin'] },
    { id: 'students', label: 'Students', icon: <Users size={20} />, roles: ['school-admin', 'teacher'] },
    { id: 'results', label: 'Results', icon: <History size={20} />, roles: ['school-admin', 'teacher'] },
    { id: 'attendance', label: 'Attendance', icon: <CheckSquare size={20} />, roles: ['teacher'] },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={20} />, roles: ['school-admin'] },
    { id: 'branding', label: 'Branding', icon: <Settings size={20} />, roles: ['school-admin'] },
    { id: 'ai-assistant', label: 'AI Assistant', icon: <MessageSquare size={20} />, roles: ['school-admin', 'teacher'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">EduResult</span>
            </div>
            <button className="lg:hidden" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredItems.map(item => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 transition-colors rounded-lg hover:bg-red-50"
            >
              <LogOut className="mr-3" size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
