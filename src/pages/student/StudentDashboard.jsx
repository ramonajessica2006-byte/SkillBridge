import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import MatchDetailModal from '../../components/common/MatchDetailModal';
import SkillTag from '../../components/common/SkillTag';
import {
  Award,
  Briefcase,
  FileText,
  GitPullRequest,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const StudentDashboard = () => {
  const { profile, user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!profile?._id) return;
      try {
        setLoading(true);
        // 1. Fetch AI Job Matches
        const matchRes = await api.get(`/matching/jobs/${profile._id}?limit=4`);
        if (matchRes.data.success) {
          setRecommendations(matchRes.data.data);
        }

        // 2. Fetch Student Applications
        const appRes = await api.get('/applications/my-applications');
        if (appRes.data.success) {
          setApplications(appRes.data.data);
        }

        // 3. Fetch Skill Gap summary
        const gapRes = await api.get(`/skill-gap/${profile._id}`);
        if (gapRes.data.success) {
          setSkillGap(gapRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile?._id]);

  // Skill category distribution for radar chart
  const categoryCounts = {
    Programming: 0,
    Frontend: 0,
    Backend: 0,
    Database: 0,
    'Cloud & DevOps': 0,
    'AI/ML': 0,
  };

  (profile?.skills || []).forEach((s) => {
    const cat = s.category || 'Programming';
    if (categoryCounts[cat] !== undefined) {
      categoryCounts[cat] += 1;
    } else {
      categoryCounts['Programming'] += 1;
    }
  });

  const radarData = Object.entries(categoryCounts).map(([cat, count]) => ({
    subject: cat,
    score: count * 25, // scaled for chart visual
    count,
  }));

  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected'
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Skill Mapping Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Welcome back, {profile?.fullName || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {profile?.collegeName} • {profile?.degree} {profile?.department} (CGPA {profile?.cgpa || '8.0'})
          </p>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Profile Completion"
          value={`${profile?.profileCompletion || 65}%`}
          subtitle="Add projects to reach 100%"
          icon={Award}
          color="blue"
        />
        <StatCard
          title="Verified Skills"
          value={`${(profile?.skills || []).length} Skills`}
          subtitle="Taxonomy calibrated"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Applications"
          value={applications.length}
          subtitle="Active trackings"
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Interviews & Shortlists"
          value={shortlistedCount}
          subtitle="Recruiter updates"
          icon={Briefcase}
          color="amber"
        />
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Recommended Opportunities */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  Top Recommended Opportunities
                </h2>
                <p className="text-xs text-slate-500">
                  Ranked by our 5-factor explainable skill matching algorithm
                </p>
              </div>
              <Link
                to="/opportunities"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                Evaluating candidate fit against live market postings...
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active postings found right now.
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map(({ opportunity, match }) => (
                  <div
                    key={opportunity._id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                          {opportunity.company?.logoUrl ? (
                            <img
                              src={opportunity.company.logoUrl}
                              alt={opportunity.companyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                              {opportunity.type}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {opportunity.companyName}
                            </span>
                          </div>
                          <Link
                            to={`/opportunities/${opportunity._id}`}
                            className="text-sm font-bold text-slate-900 hover:text-brand-600 transition block mt-0.5"
                          >
                            {opportunity.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {opportunity.location}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">
                              {opportunity.salaryStipend}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <MatchScoreBadge
                        score={match.overallScore}
                        onClick={() => setSelectedMatch(match)}
                      />
                    </div>

                    {/* Matched skills pill row */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">Matched:</span>
                        {match.matchedSkills?.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"
                          >
                            ✓ {s.name}
                          </span>
                        ))}
                        {match.missingSkills?.length > 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            ✗ Missing {match.missingSkills[0].name}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedMatch(match)}
                        className="text-[11px] font-bold text-slate-600 hover:text-brand-600 underline"
                      >
                        Why this score?
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Recent Applications
              </h2>
              <Link
                to="/student/applications"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all tracking <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                You haven't submitted any applications yet. Explore openings above to apply!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {app.opportunity?.title || 'Engineering Opening'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {app.opportunity?.companyName} • Applied on{' '}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        app.status === 'Selected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Shortlisted' || app.status === 'Interview'
                          ? 'bg-amber-100 text-amber-800'
                          : app.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Skill Radar & Skill Gap Callout */}
        <div className="lg:col-span-4 space-y-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Skill Domain Profile</h3>
            <p className="text-xs text-slate-500 mb-4">
              Competency distribution across core software disciplines
            </p>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Gap Callout Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Skill Gap Highlights</span>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed mb-4">
              {skillGap?.missingIndustrySkills?.length > 0
                ? `High industry demand detected for ${skillGap.missingIndustrySkills[0].name}. Mastering this will elevate your placement compatibility.`
                : 'Keep updating your profile certifications as you complete coursework!'}
            </p>

            {skillGap?.recommendedToLearn?.slice(0, 2).map((rec, i) => (
              <div
                key={i}
                className="mb-2 p-2.5 rounded-xl bg-white/80 border border-amber-200/60 text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{rec.name}</span>
                  <span className="text-[10px] text-amber-700 font-semibold uppercase">
                    Target: {rec.targetLevel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{rec.reason}</div>
              </div>
            ))}

            <Link
              to="/student/skill-gap"
              className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <span>View Full Skill Gap Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Explainable AI Modal */}
      <MatchDetailModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        matchData={selectedMatch}
      />
    </div>
  );
};

export default StudentDashboard;
