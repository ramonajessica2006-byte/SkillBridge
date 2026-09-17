import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{value}</div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${c.bg} ${c.text}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {trend && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
