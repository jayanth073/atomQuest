'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Target, 
  CheckSquare, 
  Users, 
  PieChart, 
  ShieldCheck, 
  BookOpen, 
  BarChart3, 
  AlertTriangle 
} from 'lucide-react';

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  if (!user) return null;

  const navLinks = [
    { href: '/dashboard', label: 'My Goals', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'], icon: Target },
    { href: '/checkins', label: 'Check-ins', roles: ['EMPLOYEE'], icon: CheckSquare },
    { href: '/manager/team', label: 'Team', roles: ['MANAGER', 'ADMIN'], icon: Users },
    { href: '/manager/reports', label: 'Reports', roles: ['MANAGER', 'ADMIN'], icon: PieChart },
    { href: '/admin/dashboard', label: 'Governance', roles: ['ADMIN'], icon: ShieldCheck },
    { href: '/admin/users', label: 'Directory', roles: ['ADMIN'], icon: BookOpen },
    { href: '/admin/analytics', label: 'Analytics', roles: ['ADMIN'], icon: BarChart3 },
    { href: '/admin/escalations', label: 'Escalations', roles: ['ADMIN'], icon: AlertTriangle },
  ];

  const visibleLinks = navLinks.filter(link => link.roles.includes(user.role));

  return (
    <aside className="w-64 flex-shrink-0 border-r border-surface-200 bg-surface-50 hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-surface-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-surface-900 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-surface-900 tracking-tight">AtomQuest</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-surface-200 text-surface-900'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-surface-900' : 'text-surface-500'} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-surface-200">
        <div className="flex items-center gap-3 group px-2 py-2 rounded-lg">
          <div className="h-8 w-8 bg-surface-200 rounded-md flex items-center justify-center text-surface-700 font-semibold text-xs border border-surface-300">
            {user.name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-surface-900 truncate">{user.name}</div>
            <div className="text-xs text-surface-500 truncate">{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
