import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
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

const IndustryDemand = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/industry-demand');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load industry demand analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
        Aggregating industry skill demands vs national student skill availability...
      </div>
    );
  }

  const {
    totalOpportunities = 0,
    totalStudents = 0,
    comparison = [],
    criticalGaps = [],
  } = data || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Market Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Industry Skill Demand vs. Student Availability
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live national comparative analytics across {totalOpportunities} corporate postings and {totalStudents} verified student portfolios.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <div className="text-3xl font-black text-rose-400">{criticalGaps.length}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Critical Market Gaps
          </div>
        </div>
      </div>

      {/* CRITICAL GAPS HIGHLIGHTS (DIRECT PROBLEM STATEMENT REQUIREMENT) */}
      {criticalGaps.length > 0 && (
        <div className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-900 uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>High Corporate Demand vs Low Student Supply Alerts</span>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed mb-4">
            These skills show the greatest supply deficit nationally. Students mastering these competencies have the highest statistical probability of fast-track placement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {criticalGaps.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white border border-rose-200 shadow-xs text-xs">
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>{item.skill}</span>
                  <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {item.gap}% Deficit
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                  <span>Demand: <b className="text-brand-600">{item.demand}%</b></span>
                  <span>Students: <b className="text-slate-900">{item.students}%</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPARISON CHART (RECHARTS) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              Comparative Demand Benchmark Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Blue = Corporate Demand Percentage • Green = Student Possession Percentage
            </p>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparison} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="skill" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis unit="%" tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip formatter={(val) => [`${val}%`, '']} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 15 }} />
              <Bar dataKey="demand" fill="#2563eb" radius={[4, 4, 0, 0]} name="Industry Demand %" />
              <Bar dataKey="students" fill="#10b981" radius={[4, 4, 0, 0]} name="Student Skill Availability %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FULL COMPARISON TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Comprehensive Skills Demand Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Skill Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Industry Demand %</th>
                <th className="px-6 py-3.5">Student Availability %</th>
                <th className="px-6 py-3.5">Supply Gap</th>
                <th className="px-6 py-3.5">Market Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{item.skill}</td>
                  <td className="px-6 py-3.5 text-slate-600 font-medium">{item.category}</td>
                  <td className="px-6 py-3.5 font-bold text-brand-600">{item.demand}%</td>
                  <td className="px-6 py-3.5 font-bold text-emerald-600">{item.students}%</td>
                  <td className="px-6 py-3.5 font-extrabold text-slate-800">
                    {item.gap > 0 ? `+${item.gap}%` : 'Balanced'}
                  </td>
                  <td className="px-6 py-3.5">
                    {item.isMajorGap ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Critical Deficit
                      </span>
                    ) : item.demand >= 60 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800">
                        High Demand
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        Steady
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndustryDemand;
