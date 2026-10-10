import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';
import {
  ListTodo,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Sparkles,
  Flag,
  Filter,
} from 'lucide-react';

export const TasksMilestonesPage: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    milestones,
    toggleMilestone,
    activeStartup,
    addToast,
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'HIGH' as TaskPriority,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    assignedMember: 'Alex (Founder)',
    status: 'TODO' as TaskStatus,
  });

  const priorityBadges: Record<TaskPriority, string> = {
    LOW: 'text-slate-400 bg-slate-800/60 border-slate-700',
    MEDIUM: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    HIGH: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    CRITICAL: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
  };

  const statusBadges: Record<TaskStatus, string> = {
    TODO: 'text-slate-400 font-mono text-[10px]',
    IN_PROGRESS: 'text-indigo-400 font-mono text-[10px]',
    BLOCKED: 'text-rose-400 font-mono text-[10px]',
    COMPLETED: 'text-emerald-400 font-mono text-[10px]',
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      addToast({ type: 'warning', title: 'Task Title Required' });
      return;
    }

    addTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'HIGH',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      assignedMember: 'Alex (Founder)',
      status: 'TODO',
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>SPRINT EXECUTION</span>
            <span>·</span>
            <span>VENTURE MILESTONES</span>
            <span>·</span>
            <span className="text-indigo-400">NEXT ACTIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ListTodo className="w-7 h-7 text-indigo-400" />
            <span>Tasks, Milestones & Execution Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track authorized development sprints, venture milestone gates, and AI-prescribed next actions.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'New Sprint Task'}</span>
        </button>
      </div>

      {/* Venture Milestones Ribbon */}
      <div className="rounded-2xl glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Flag className="w-4 h-4 text-indigo-400" />
            <span>Venture Milestone Gates ({milestones.filter((m) => m.achieved).length}/{milestones.length} Unlocked)</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">Reflects Real Founder Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {milestones.map((ms) => (
            <button
              key={ms.id}
              onClick={() => toggleMilestone(ms.id)}
              className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                ms.achieved
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                      ms.achieved ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ms.achieved ? 'ACHIEVED' : 'INCOMPLETE'}
                  </span>
                  <span className="text-slate-500">{ms.targetDate}</span>
                </div>
                <div className={`font-semibold text-xs ${ms.achieved ? 'text-white' : 'text-slate-300'}`}>
                  {ms.title}
                </div>
              </div>

              {ms.verifiedEvidence && (
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 truncate">
                  Evidence: {ms.verifiedEvidence}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Task Creation Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl glass-card border-indigo-500/30 space-y-4">
          <div className="font-semibold text-xs text-white">Create New Sprint Task</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-slate-300 mb-1">Task Title *</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="e.g. Implement bi-directional Linear status webhook"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Description & Acceptance Criteria</label>
            <input
              type="text"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="What specifically defines completion?"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Deadline</label>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Assignee</label>
              <input
                type="text"
                value={newTask.assignedMember}
                onChange={(e) => setNewTask({ ...newTask, assignedMember: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          {(['ALL', 'TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === s ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                priorityFilter === p ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="p-3.5 rounded-xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${priorityBadges[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={statusBadges[task.status]}>{task.status}</span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-slate-400 font-mono">Due {task.deadline}</span>
              </div>
              <div
                className={`text-xs font-semibold ${
                  task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-white'
                }`}
              >
                {task.title}
              </div>
              {task.description && <p className="text-[11px] text-slate-400">{task.description}</p>}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                {task.assignedMember}
              </span>

              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
