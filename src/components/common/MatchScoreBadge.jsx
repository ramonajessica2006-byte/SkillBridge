import React from 'react';

const MatchScoreBadge = ({ score, size = 'md', showLabel = true, onClick }) => {
  const getTheme = (val) => {
    if (val >= 80) {
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        bar: 'bg-emerald-500',
        label: 'High Match',
      };
    }
    if (val >= 60) {
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        bar: 'bg-amber-500',
        label: 'Good Match',
      };
    }
    return {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      bar: 'bg-rose-500',
      label: 'Low Match',
    };
  };

  const theme = getTheme(score || 0);

  if (size === 'lg') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl border ${theme.bg} ${theme.border} ${
          onClick ? 'cursor-pointer hover:shadow-sm transition' : ''
        }`}
      >
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-inner font-extrabold text-xl text-slate-800">
          {score}%
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Skill Compatibility
          </div>
          <div className={`text-sm font-bold ${theme.text}`}>{theme.label}</div>
        </div>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border} ${
          onClick ? 'cursor-pointer hover:opacity-80' : ''
        }`}
      >
        <span>{score}%</span>
        {showLabel && <span className="opacity-75 font-medium">{theme.label}</span>}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border} ${
        onClick ? 'cursor-pointer hover:ring-2 hover:ring-brand-400 transition' : ''
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${theme.bar}`}></span>
      <span>{score}% Match</span>
    </button>
  );
};

export default MatchScoreBadge;
