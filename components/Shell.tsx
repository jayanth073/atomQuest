'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find(row => row.startsWith('session='));
    if (sessionCookie) {
      try {
        const cookieValue = sessionCookie.split('=').slice(1).join('=');
        const payloadBase64 = cookieValue.split('.')[0];
        const userData = JSON.parse(atob(payloadBase64));
        setUser(userData);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 text-surface-900">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader user={user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
