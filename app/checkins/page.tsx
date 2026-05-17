'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, MessageSquare, ChevronRight } from 'lucide-react';

export default function CheckInsDashboard() {
  const [goals, setGoals] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quarter, setQuarter] = useState('Q1');

  useEffect(() => {
    async function fetchData() {
      const [goalsRes, checkinsRes] = await Promise.all([
        fetch('/api/goals'),
        fetch('/api/checkins')
      ]);
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        if (Array.isArray(goalsData)) setGoals(goalsData.filter((g: any) => g.status === 'APPROVED'));
      }
      if (checkinsRes.ok) {
        const checkinsData = await checkinsRes.json();
        if (Array.isArray(checkinsData)) setCheckIns(checkinsData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-surface-500 font-medium">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold text-surface-900 mb-1">Quarterly Check-ins</h1>
            <p className="text-sm text-surface-500">Track achievement against your commitments</p>
          </div>
          <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-lg border border-surface-200">
            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
              <button 
                key={q}
                onClick={() => setQuarter(q)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  quarter === q ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-900'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 animate-fade-in animate-stagger-1">
          {goals.map((goal: any) => {
            const checkIn = checkIns.find(ci => ci.goalId === goal.id && ci.quarter === quarter);
            return (
              <div key={goal.id} className="card p-5 transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="badge badge-neutral">{goal.thrustArea}</span>
                    </div>
                    <h3 className="text-base font-semibold text-surface-900 mb-1">{goal.title}</h3>
                    <p className="text-sm text-surface-500 line-clamp-2">{goal.description}</p>
                    
                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <div className="text-[11px] font-medium text-surface-400 mb-0.5 uppercase tracking-wide">Target</div>
                        <div className="text-sm font-medium text-surface-900">{goal.target}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-surface-400 mb-0.5 uppercase tracking-wide">Weight</div>
                        <div className="text-sm font-medium text-surface-900">{goal.weightage}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-64 bg-surface-50 rounded-lg p-4 border border-surface-200">
                    {checkIn ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-surface-500">Actual</span>
                          <span className="text-sm font-semibold text-surface-900">{checkIn.actualAchievement}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-surface-500">Score</span>
                          <span className="text-sm font-semibold text-emerald-600">{(checkIn.computedScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="pt-3 border-t border-surface-200">
                          <div className="flex items-center gap-2 mb-1.5">
                            <MessageSquare size={12} className="text-surface-400" />
                            <span className="text-[11px] font-medium text-surface-500 uppercase tracking-wide">Manager Feedback</span>
                          </div>
                          <p className="text-xs text-surface-700">
                            {checkIn.managerComment ? `"${checkIn.managerComment}"` : "Awaiting review..."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-2">
                        <p className="text-xs text-surface-500 mb-3">No data for {quarter}</p>
                        <Link 
                          href={`/checkins/${goal.id}?quarter=${quarter}`}
                          className="btn-primary text-xs w-full py-1.5 flex items-center justify-center gap-1"
                        >
                          Start Check-in <ChevronRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="card p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-surface-50 border border-surface-200 rounded-xl mb-4">
                <Clock size={20} className="text-surface-400" />
              </div>
              <p className="text-sm text-surface-500 font-medium">No approved goals available for check-in</p>
              <Link href="/dashboard" className="text-surface-900 font-medium text-sm mt-3 inline-block hover:underline">Return to Dashboard</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}