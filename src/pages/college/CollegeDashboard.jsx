import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  Building,
  Users,
  Award,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Handshake,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CollegeDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [curriculumAlerts, setCurriculumAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollegeData = async () => {
      if (!profile?._id) return;
      try {
        setLoading(true);
        // 1. Fetch College Stats
        const statsRes = await api.get(`/colleges/${profile._id}/stats`);
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        // 2. Fetch College Analytics & Curriculum Recommendations
        const analyticsRes = await api.get(`/analytics/college/${profile._id}`);
        if (analyticsRes.data.success) {
          setCurriculumAlerts(analyticsRes.data.data.curriculumRecommendations || []);
        }
      } catch (err) {
        console.error('Failed to load college stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [profile?._id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
        Aggregating campus placement metrics and student skill rosters...
      </div>
    );
  }

  const {
    totalStudents = 0,
    placedStudents = 0,
    placementRate = 0,
    totalInternships = 0,
    topStudentSkills = [],
    departmentDistribution = [],
    proficiencyDistribution = [],
    avgPackage = 7.5,
    highestPackage = 32.0,
  } = stats || {};

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
            <Building className="w-3.5 h-3.5" />
            Institutional Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {profile?.institutionName || 'College Administration'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {profile?.institutionType} Institution • {profile?.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/college/students"
            className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Users className="w-4 h-4" /> Student Roster
          </Link>
          <Link
            to="/college/collaborations"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Handshake className="w-4 h-4" /> Industry MoUs
          </Link>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value={totalStudents}
          subtitle="Registered on platform"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Placement Conversion Rate"
          value={`${placementRate}%`}
          subtitle={`${placedStudents} of ${totalStudents} students placed`}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Active Internships"
          value={totalInternships}
          subtitle="Corporate engagements"
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Average CTC Package"
          value={`₹${avgPackage} LPA`}
          subtitle={`Highest: ₹${highestPackage} LPA`}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* CRUCIAL CURRICULUM INTERVENTION CALLOUT (SIH PROBLEM REQUIREMENT) */}
      {curriculumAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Critical Academia-Industry Action Required
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  High Industry Demand vs. Low Student Mastery Detected
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  The automated skill mapping engine identified several technical disciplines where corporate demand outpaces candidate availability. Consider conducting specialized bootcamps or workshops for these skills.
                </p>
              </div>
            </div>

            <Link
              to="/college/curriculum-gap"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-sm"
            >
              <span>View Intervention Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {curriculumAlerts.slice(0, 3).map((alert, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs">
                <div className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>{alert.skill}</span>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                    {alert.gap}% Gap
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Demand: <b>{alert.demandPct}%</b> • Student Mastery: <b>{alert.studentPct}%</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Student Skills Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Student Technical Competencies</h2>
              <p className="text-xs text-slate-500">
                Most prevalent skills across verified student profiles
              </p>
            </div>
            <Link
              to="/analytics/industry-demand"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Compare with industry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topStudentSkills.slice(0, 8)}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip formatter={(val) => [`${val} Students`, 'Students']} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Department Distribution Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Students by Department</h2>
            <p className="text-xs text-slate-500 mb-4">Departmental representation in campus portal</p>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    dataKey="count"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ department, percentage }) => `${percentage}%`}
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-1 text-xs">
            {departmentDistribution.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-slate-600">
                <span className="truncate max-w-[200px]">{d.department}</span>
                <span className="font-bold text-slate-900">{d.count} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
