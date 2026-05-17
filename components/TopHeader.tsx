'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bell, LogOut, Settings } from 'lucide-react';

export default function TopHeader({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (user?.email && user?.role === 'ADMIN') {
      fetch('/api/admin/notifications')
        .then(res => res.json())
        .then(data => {
          const emails = data.emails || [];
          const userNotifs = emails.filter((e: any) => e.to === user.email).length;
          setNotifCount(userNotifs);
        })
        .catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  // Simple title mapping based on pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'My Goals';
    if (pathname === '/checkins') return 'Check-ins';
    if (pathname.includes('/manager/team')) return 'Team Overview';
    if (pathname.includes('/admin/dashboard')) return 'Governance';
    if (pathname.includes('/admin/users')) return 'Directory';
    if (pathname.includes('/admin/analytics')) return 'Analytics';
    if (pathname.includes('/admin/escalations')) return 'Escalations';
    return 'AtomQuest';
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-surface-200 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {pathname !== '/dashboard' && (
          <button 
            onClick={() => router.back()} 
            className="text-surface-400 hover:text-surface-900 transition-colors" 
            title="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        )}
        <h1 className="text-sm font-semibold text-surface-900">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-surface-400 hover:text-surface-900 transition-colors" title="Notifications">
          <Bell size={18} />
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </button>

        <div className="h-4 w-px bg-surface-200"></div>

        <button className="text-surface-400 hover:text-surface-900 transition-colors" title="Settings">
          <Settings size={18} />
        </button>

        <a href="/logout" className="text-surface-400 hover:text-red-600 transition-colors" title="Sign Out">
          <LogOut size={18} />
        </a>
      </div>
    </header>
  );
}
