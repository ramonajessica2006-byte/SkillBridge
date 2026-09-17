import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Sparkles, Brain, GraduationCap, Award, Briefcase } from 'lucide-react';
import SkillTag from './SkillTag';

const MatchDetailModal = ({ isOpen, onClose, matchData, title = 'AI Match & Skill Gap Breakdown' }) => {
  if (!isOpen || !matchData) return null;

  const {
    overallScore = 0,
    breakdown = {},
    matchedSkills = [],
    weakSkills = [],
    missingSkills = [],
    preferredMatchedSkills = [],
    explanation = '',
    reasons = [],
  } = matchData;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                Transparent multi-factor weighted matching algorithm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Score Banner */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Calculated Overall Fit
            </div>
            <div className="text-xs text-slate-300 mt-1 max-w-sm">
              Mathematical synthesis of core skills, proficiency ratings, academic metrics, and domain projects.
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-white">{overallScore}%</div>
            <div className="text-[11px] text-brand-200 uppercase font-bold tracking-wider">
              Compatibility
            </div>
          </div>
        </div>

        {/* 5-Factor Weighted Score Breakdown */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Factor Weight Breakdown (100% Total)
          </div>
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Required Skills Match (50% max)</span>
                <span>{breakdown.requiredSkills || 0} / 50 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all"
                  style={{ width: `${((breakdown.requiredSkills || 0) / 50) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Proficiency Calibration (20% max)</span>
                <span>{breakdown.proficiency || 0} / 20 pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${((breakdown.proficiency || 0) / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <GraduationCap className="w-3 h-3 text-slate-400" /> Degree & Dept (10%)
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {breakdown.education || 0} / 10
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <Award className="w-3 h-3 text-slate-400" /> CGPA Match (10%)
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {breakdown.cgpa || 0} / 10
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <Briefcase className="w-3 h-3 text-slate-400" /> Projects & Exp (10%)
                </div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {breakdown.experience || 0} / 10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Skills Categorization */}
        <div className="space-y-4 mb-6">
          {/* Matched */}
          {matchedSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Satisfied Requirements ({matchedSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((s, idx) => (
                  <SkillTag
                    key={idx}
                    name={s.name}
                    proficiency={s.studentProficiency}
                    status="matched"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Weak / Level Gaps */}
          {weakSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                Proficiency Gaps ({weakSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {weakSkills.map((s, idx) => (
                  <SkillTag
                    key={idx}
                    name={s.name}
                    proficiency={s.studentProficiency}
                    status="weak"
                    gapInfo={`Target: ${s.requiredProficiency}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
          {missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                <XCircle className="w-4 h-4" />
                Missing Required Skills ({missingSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((s, idx) => (
                  <SkillTag
                    key={idx}
                    name={s.name}
                    status="missing"
                    gapInfo={`Required: ${s.requiredProficiency}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Preferred Matched */}
          {preferredMatchedSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Bonus Preferred Skills ({preferredMatchedSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {preferredMatchedSkills.map((name, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    +{name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Explainable Reasoning */}
        {explanation && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-brand-600" />
              Explainable Evaluation Summary:
            </div>
            <p className="leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Footer close */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;
