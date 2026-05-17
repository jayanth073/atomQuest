'use client';

import { useRouter } from 'next/navigation';
import { Check, ArrowLeft } from 'lucide-react';

export default function ApprovalActions({ employeeId }: { employeeId: string }) {
  const router = useRouter();

  const handleAction = async (action: 'APPROVE' | 'RETURN') => {
    const res = await fetch('/api/goals/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, action }),
    });

    if (res.ok) {
      router.push('/manager/team');
    } else {
      const data = await res.json();
      alert(data.error || 'Action failed');
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-surface-50 border-t border-surface-200 mt-6">
      <button 
        onClick={() => handleAction('RETURN')}
        className="flex-1 btn-secondary flex items-center justify-center gap-2"
      >
        <ArrowLeft size={16} />
        <span>Return for Rework</span>
      </button>
      <button 
        onClick={() => handleAction('APPROVE')}
        className="flex-2 btn-primary flex items-center justify-center gap-2"
      >
        <Check size={16} />
        <span>Approve Goal Sheet</span>
      </button>
    </div>
  );
}