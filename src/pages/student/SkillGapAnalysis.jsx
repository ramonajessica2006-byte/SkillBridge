import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SkillTag from '../../components/common/SkillTag';
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const SkillGapAnalysis = () => {
  const { profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGap = async () => {
      if (!profile?._id) return;
      try {
        setLoading(true);
        const res = await api.get(`/skill-gap/${profile._id}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching skill gap', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGap();
  }, [profile?._id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
        Analyzing active marketplace demand vs your current skill profile...
      </div>
    );
  }

  const {
    mySkills = [],
    missingIndustrySkills = [],
    weakSkills = [],
    recommendedToLearn = [],
    marketDemandComparison = [],
  } = data || {};

  // Numeric map for level comparison chart
  const levelValues = { None: 0, Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };

  const chartData = (missingIndustrySkills.slice(0, 6) || []).concat(weakSkills.slice(0, 4) || []).map((s) => ({
    name: s.name,
    Current: levelValues[s.currentLevel] || 0,
    Required: levelValues[s.requiredLevel] || 2,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-2">
            <GitPullRequest className="w-3.5 h-3.5" />
            AI Diagnostic Report
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Skill Gap & Upskilling Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time delta between your current capabilities and the technical competencies demanded across 20+ active industry postings.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <div className="text-3xl font-black text-amber-400">
            {missingIndustrySkills.length + weakSkills.length}
          </div>
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
            Identified Gaps
          </div>
        </div>
      </div>

      {/* 4 CORE SECTIONS AS REQUESTED IN PROBLEM STATEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Section 1: My Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>My Verified Skills ({mySkills.length})</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {mySkills.length === 0 ? (
              <p className="text-xs text-slate-400">No skills listed yet.</p>
            ) : (
              mySkills.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {s.proficiency}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Missing Industry Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-700 uppercase tracking-wider mb-3">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Missing Industry Skills ({missingIndustrySkills.length})</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {missingIndustrySkills.length === 0 ? (
              <p className="text-xs text-emerald-600 font-semibold">Zero missing skills! Outstanding coverage.</p>
            ) : (
              missingIndustrySkills.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{s.name}</span>
                    <span className="text-[10px] text-rose-700 font-bold bg-rose-100 px-1.5 py-0.5 rounded">
                      {s.demandPercent}% Demand
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Demanded by {s.jobCount} job openings
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 3: Weak Skills / Level Difference */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700 uppercase tracking-wider mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Proficiency Gaps ({weakSkills.length})</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {weakSkills.length === 0 ? (
              <p className="text-xs text-slate-400">All your skills match target expectations!</p>
            ) : (
              weakSkills.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                  <div className="font-bold text-slate-900">{s.name}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
                    <span>Current: <b>{s.currentLevel}</b></span>
                    <span>Required: <b className="text-amber-700">{s.requiredLevel}</b></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 4: Recommended To Learn */}
        <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-2xl border border-brand-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-900 uppercase tracking-wider mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Action Priority</span>
          </div>
          <div className="space-y-2">
            {recommendedToLearn.map((rec) => (
              <div key={rec.priority} className="p-2.5 rounded-xl bg-white border border-brand-100 shadow-xs text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-black">
                      {rec.priority}
                    </span>
                    {rec.name}
                  </span>
                  <span className="text-[10px] text-brand-700 font-bold uppercase">{rec.targetLevel}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{rec.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Chart: Current Level vs Required Level Gap */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              Current Proficiency vs. Industry Benchmark Level
            </h3>
            <p className="text-xs text-slate-500">
              Proficiency levels calibrated: 1 = Beginner, 2 = Intermediate, 3 = Advanced, 4 = Expert
            </p>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip
                formatter={(value) => {
                  const labels = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
                  return [labels[value] || value, ''];
                }}
              />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 15 }} />
              <Bar dataKey="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} name="My Skill Level" />
              <Bar dataKey="Required" fill="#2563eb" radius={[4, 4, 0, 0]} name="Industry Required Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
