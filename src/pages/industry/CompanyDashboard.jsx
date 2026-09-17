import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  ArrowRight,
  TrendingUp,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const CompanyDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!profile?._id) return;
      try {
        setLoading(true);
        // 1. Fetch Company Stats
        const statsRes = await api.get(`/companies/${profile._id}/stats`);
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        // 2. Fetch Company Opportunities
        const oppRes = await api.get(`/opportunities?company=${profile._id}`);
        if (oppRes.data.success) {
          setOpportunities(oppRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load company dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [profile?._id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
        Gathering recruitment pipeline statistics and candidate flows...
      </div>
    );
  }

  const {
    totalPostings = 0,
    activePostings = 0,
    totalApplicants = 0,
    shortlistedCount = 0,
    interviewCount = 0,
    selectedCount = 0,
    statusFunnel = [],
  } = stats || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
            {profile?.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.companyName} className="w-full h-full object-cover" />
            ) : (
              <Building className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-1">
              <Briefcase className="w-3.5 h-3.5" /> Corporate Hiring Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {profile?.companyName || 'Recruiter Console'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              {profile?.industryType} • {profile?.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/industry/post-opportunity"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Post New Opening
          </Link>
          <Link
            to="/industry/candidates"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" /> Find Best Candidates
          </Link>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Openings"
          value={activePostings}
          subtitle={`${totalPostings} total created`}
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Total Applications"
          value={totalApplicants}
          subtitle="Across active postings"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="In Interview Stages"
          value={interviewCount}
          subtitle="Direct technical rounds"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Final Hires Selected"
          value={selectedCount}
          subtitle="Offers dispatched"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Recruitment Pipeline Funnel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1">Recruitment Pipeline Funnel</h2>
        <p className="text-xs text-slate-500 mb-6">Candidate conversion progression across all stages</p>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusFunnel} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip formatter={(val) => [`${val} Candidates`, 'Candidates']} />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Openings Table with 1-Click Reverse Candidate Ranking */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Job & Internship Postings</h2>
            <p className="text-xs text-slate-500">
              Trigger AI candidate matching or manage applicant pipelines
            </p>
          </div>
          <Link
            to="/industry/post-opportunity"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Create opening <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {opportunities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No openings posted yet. Click "Post New Opening" above to begin campus recruitment.
          </div>
        ) : (
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp._id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                      {opp.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {opp.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{opp.salaryStipend}</span>
                    <span>•</span>
                    <span>{opp.location} ({opp.workMode})</span>
                    <span>•</span>
                    <span>{opp.openings} Openings</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/industry/candidates?jobId=${opp._id}`}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Find Best Candidates</span>
                  </Link>

                  <Link
                    to={`/industry/opportunities/${opp._id}/applicants`}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition"
                  >
                    Review Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
