import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { readDb } from '@/lib/db';
import Link from 'next/link';
import SubmitGoalsButton from '@/components/SubmitGoalsButton';
import { Target, Activity, CalendarDays, ShieldCheck, Users } from 'lucide-react';

export default function DashboardPage() {
  const session = getSession();
  if (!session) redirect('/login');

  const db = readDb();

  const goals = db.goals.filter((g: any) => g.employeeId === session.id);
  const activeCycle = db.goalCycles.find((c: any) => c.isActive);

  let sheetStatus = 'NOT STARTED';
  let statusColor = 'text-surface-500';
  if (goals.length > 0) {
    if (goals.every((g: any) => g.status === 'APPROVED')) {
      sheetStatus = 'APPROVED';
      statusColor = 'text-emerald-600';
    } else if (goals.some((g: any) => g.status === 'SUBMITTED')) {
      sheetStatus = 'PENDING';
      statusColor = 'text-amber-600';
    } else if (goals.some((g: any) => g.status === 'RETURNED')) {
      sheetStatus = 'RETURNED';
      statusColor = 'text-red-600';
    } else {
      sheetStatus = 'DRAFT';
      statusColor = 'text-surface-600';
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      APPROVED: 'badge-success',
      SUBMITTED: 'badge-warning',
      RETURNED: 'badge-error',
      DRAFT: 'badge-neutral',
    };
    return badges[status] || 'badge-neutral';
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <header className="mb-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-surface-900 tracking-tight mb-2">
                Welcome back, {session.name.split(' ')[0]}
              </h1>
              <p className="text-sm text-surface-500 font-medium flex items-center gap-2">
                <span className="badge badge-info">{session.role}</span>
                <span className="text-surface-300">•</span>
                <span>Active Cycle: <span className="font-semibold text-surface-700">{activeCycle?.name || 'No Active Cycle'}</span></span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {session.role === 'ADMIN' && (
                <Link href="/admin/dashboard" className="btn-secondary flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Admin
                </Link>
              )}
              {session.role === 'MANAGER' && (
                <Link href="/manager/team" className="btn-primary flex items-center gap-2">
                  <Users size={16} />
                  My Team
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 animate-fade-in animate-stagger-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-surface-500 text-sm font-medium">Total Goals</h3>
              <Target size={16} className="text-surface-400" />
            </div>
            <p className="text-2xl font-semibold text-surface-900">{goals.length}</p>
          </div>
          <div className="card p-5 animate-fade-in animate-stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-surface-500 text-sm font-medium">Sheet Status</h3>
              <Activity size={16} className="text-surface-400" />
            </div>
            <p className={`text-xl font-semibold ${statusColor}`}>{sheetStatus}</p>
          </div>
          <div className="card p-5 md:col-span-2 animate-fade-in animate-stagger-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-surface-500 text-sm font-medium">Deadline</h3>
              <CalendarDays size={16} className="text-surface-400" />
            </div>
            <p className="text-2xl font-semibold text-surface-900">
              {activeCycle?.windowClose ? new Date(activeCycle.windowClose).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not Defined'}
            </p>
          </div>
        </div>

        <div className="card overflow-hidden animate-fade-in animate-stagger-4">
              <div className="p-5 border-b border-surface-200 flex justify-between items-center bg-white">
                <h2 className="text-sm font-semibold text-surface-900">Performance Commitments</h2>
                {session.role === 'EMPLOYEE' && (goals.length === 0 || goals.every((g: any) => g.status === 'DRAFT' || g.status === 'RETURNED')) && (
                  <Link
                    href="/goals/new"
                    className="btn-primary text-sm"
                  >
                    Admin Panel
                  </Link>
                )}

                {session.role === 'MANAGER' && (
                  <Link
                    href="/manager/team"
                    className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 transition-all"
                  >
                    My Team
                  </Link>
                )}

              </div>

              {goals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-surface-200">
                        <th className="px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Area</th>
                        <th className="px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Goal</th>
                        <th className="px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Target</th>
                        <th className="px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider text-center">Weight</th>
                        <th className="px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-50">
                      {goals.map((goal: any) => (
                        <tr key={goal.id} className="hover:bg-surface-50 transition-colors">
                          <td className="px-5 py-4 align-top">
                            <span className="badge badge-neutral">{goal.thrustArea}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-medium text-surface-900 text-sm">{goal.title}</div>
                            <div className="text-sm text-surface-500 mt-1 line-clamp-1">{goal.description}</div>
                          </td>
                          <td className="px-5 py-4 align-top">
                            <span className="font-mono text-sm font-medium text-surface-600">
                              {goal.uomType === 'ZERO' ? 'Zero' : goal.target}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center align-top">
                            <span className="font-semibold text-surface-700 text-sm">{goal.weightage}%</span>
                          </td>
                          <td className="px-5 py-4 align-top">
                            <div className="flex flex-col gap-2">
                              <span className={`badge ${getStatusBadge(goal.status)}`}>
                                {goal.status}
                              </span>
                              {goal.status === 'RETURNED' && goal.managerComment && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 max-w-[180px]">
                                  &ldquo;{goal.managerComment}&rdquo;
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right align-top">
                            <div className="flex justify-end gap-2">
                              {(goal.status === 'DRAFT' || goal.status === 'RETURNED') && (
                                <Link href={`/goals/edit/${goal.id}`} className="text-sm font-medium text-surface-600 hover:text-surface-900">Edit</Link>
                              )}
                              {goal.status === 'APPROVED' && (
                                <Link href={`/checkins/${goal.id}`} className="btn-secondary text-xs py-1 px-2">
                                  Check-in
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-100 rounded-2xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-surface-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <p className="text-surface-500 font-medium">No goals set for this cycle</p>
                  <Link href="/goals/new" className="btn-primary mt-4 inline-flex">Create Your First Goal</Link>
                </div>
              )}

              {session.role === 'EMPLOYEE' && goals.length > 0 && goals.some((g: any) => g.status === 'DRAFT' || g.status === 'RETURNED') && (
                <div className="p-6 bg-surface-50 border-t border-surface-100">
                  <SubmitGoalsButton cycleId={activeCycle?.id} />
                </div>
              )}
            </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

              <p className="text-zinc-400 mb-2">
                Total Goals
              </p>

              <h1 className="text-5xl font-extrabold text-violet-500">
                {goals.length}
              </h1>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

              <p className="text-zinc-400 mb-2">
                Sheet Status
              </p>

              <h1 className={`text-4xl font-extrabold ${statusColor}`}>
                {sheetStatus}
              </h1>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">

              <p className="text-zinc-400 mb-2">
                Deadline
              </p>

              <h1 className="text-3xl font-bold text-cyan-400">
                {activeCycle?.windowClose
                  ? new Date(activeCycle.windowClose).toLocaleDateString()
                  : 'Not Defined'}
              </h1>

            </div>

          </div>

          {/* GOALS TABLE */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">

            <div className="flex items-center justify-between p-6 border-b border-zinc-800">

              <h2 className="text-2xl font-bold">
                Performance Goals
              </h2>

              {session.role === 'EMPLOYEE' && (
                <Link
                  href="/goals/new"
                  className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 transition-all"
                >
                  + Create Goal
                </Link>
              )}

            </div>

            {goals.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-zinc-950">

                    <tr>

                      <th className="p-5 text-left text-zinc-400">
                        Area
                      </th>

                      <th className="p-5 text-left text-zinc-400">
                        Goal
                      </th>

                      <th className="p-5 text-left text-zinc-400">
                        Target
                      </th>

                      <th className="p-5 text-left text-zinc-400">
                        Weight
                      </th>

                      <th className="p-5 text-left text-zinc-400">
                        Status
                      </th>

                      <th className="p-5 text-right text-zinc-400">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {goals.map((goal: any) => (

                      <tr
                        key={goal.id}
                        className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-all"
                      >

                        <td className="p-5">
                          <span className="px-3 py-1 rounded-xl bg-zinc-800 text-sm">
                            {goal.thrustArea}
                          </span>
                        </td>

                        <td className="p-5">

                          <h3 className="font-bold text-lg">
                            {goal.title}
                          </h3>

                          <p className="text-zinc-400 text-sm mt-1">
                            {goal.description}
                          </p>

                        </td>

                        <td className="p-5 text-cyan-400 font-semibold">
                          {goal.uomType === 'ZERO'
                            ? 'Zero'
                            : goal.target}
                        </td>

                        <td className="p-5 font-bold">
                          {goal.weightage}%
                        </td>

                        <td className="p-5">

                          <span className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm">
                            {goal.status}
                          </span>

                        </td>

                        <td className="p-5 text-right">

                          {(goal.status === 'DRAFT' ||
                            goal.status === 'RETURNED') && (

                              <Link
                                href={`/goals/edit/${goal.id}`}
                                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all"
                              >
                                Edit
                              </Link>
                            )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="p-20 text-center">

                <h2 className="text-3xl font-bold mb-4">
                  No Goals Found
                </h2>

                <p className="text-zinc-400 mb-6">
                  Create your first goal to get started.
                </p>

                <Link
                  href="/goals/new"
                  className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 transition-all"
                >
                  Create Goal
                </Link>

              </div>

            )}

          </div>

        </div>

      </div>
      );
}
