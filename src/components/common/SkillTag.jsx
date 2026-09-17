import React from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

const SkillTag = ({
  name,
  category,
  proficiency,
  status, // 'matched' | 'weak' | 'missing'
  gapInfo,
  onDelete,
}) => {
  const getProfColor = (prof) => {
    switch (prof) {
      case 'Expert':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Advanced':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Intermediate':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = () => {
    if (status === 'matched') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
          <Check className="w-3 h-3" /> Matched
        </span>
      );
    }
    if (status === 'weak') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
          <AlertTriangle className="w-3 h-3" /> Level Gap
        </span>
      );
    }
    if (status === 'missing') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
          <X className="w-3 h-3" /> Missing
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
        status === 'missing'
          ? 'bg-rose-50/50 border-rose-200 text-rose-900'
          : status === 'weak'
          ? 'bg-amber-50/50 border-amber-200 text-amber-900'
          : status === 'matched'
          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <span className="font-semibold">{name}</span>

      {proficiency && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${getProfColor(proficiency)}`}>
          {proficiency}
        </span>
      )}

      {getStatusBadge()}

      {gapInfo && (
        <span className="text-[10px] text-slate-500 italic">
          ({gapInfo})
        </span>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-1 text-slate-400 hover:text-rose-600 transition p-0.5 rounded hover:bg-slate-100"
          title="Remove skill"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SkillTag;
