import { Video as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'teal' | 'slate';
  trend?: { value: number; label: string };
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }: StatCardProps) {
  const colors = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-700', text: 'text-blue-700' },
    green: { bg: 'bg-green-50', icon: 'bg-green-600', text: 'text-green-700' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-500', text: 'text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'bg-red-600', text: 'text-red-700' },
    teal: { bg: 'bg-teal-50', icon: 'bg-teal-600', text: 'text-teal-700' },
    slate: { bg: 'bg-slate-50', icon: 'bg-slate-700', text: 'text-slate-700' },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${c.text}`}>{value}</p>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={`${c.icon} rounded-xl p-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
