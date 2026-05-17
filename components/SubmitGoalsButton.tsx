'use client';

import { useToast } from '@/components/Toast';
import { Send } from 'lucide-react';

export default function SubmitGoalsButton({ cycleId }: { cycleId?: string }) {
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!cycleId) { showToast('No active cycle found', 'error'); return; }
    const res = await fetch('/api/goals/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cycleId }),
    });
    if (res.ok) {
      showToast('Goals submitted for approval!', 'success');
      window.location.reload();
    } else {
      const data = await res.json();
      showToast(data.error || 'Submission failed', 'error');
    }
  };

  return (
    <button 
      onClick={handleSubmit}
      className="w-full btn-primary flex items-center justify-center gap-2 py-3"
    >
      <Send size={16} />
      <span>Submit Goal Sheet for Approval</span>
    </button>
  );
}