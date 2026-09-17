import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import api from '../services/api';
import {
  Brain,
  ArrowRight,
  Sparkles,
  Briefcase,
  GraduationCap,
  Building,
  Target,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Users,
  ShieldCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';

const LandingPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 22,
    totalColleges: 3,
    totalCompanies: 8,
    totalOpportunities: 20,
    placementRate: 84,
  });

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await api.get('/analytics/overview');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (e) {
        // Fallback to initial realistic stats
      }
    };
    loadOverview();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              Bridging Academia and Industry Through{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
                Skills
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Connect students, institutions, and industries through transparent skill mapping,
              explainable AI recommendations, and data-driven curriculum interventions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/opportunities"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition"
              >
                <span>Try Demo Accounts</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </Link>
            </div>

            {/* Quick Demo Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Demo Student
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> IIT Delhi Faculty
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Infosys Recruiter
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Grid BG */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      </section>

      {/* STATS BANNER */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-brand-600">{stats.totalStudents}+</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Verified Students</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-indigo-600">{stats.totalColleges}</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Top Engineering Colleges</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-purple-600">{stats.totalCompanies}+</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Industry Partners</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-emerald-600">{stats.totalOpportunities}</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Active Openings</div>
            </div>
            <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-amber-600">84%</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">Avg Placement Match</div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-SIDED ECOSYSTEM SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-extrabold uppercase tracking-wider text-brand-600 mb-2">
              Tripartite Collaboration
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Solving the Academia–Industry Disconnect
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically to tackle the 6 core structural challenges identified in SIH26044.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Pillar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">For Students</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Build a standardized skill profile, discover exactly which jobs match your strengths, and follow step-by-step roadmaps to eliminate your skill gaps.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Explainable Match % on every job
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Automated Skill Gap Diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Real-time Application Tracking
                </li>
              </ul>
            </div>

            {/* College Pillar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 font-bold">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">For Colleges & Faculty</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Gain instant visibility into your student body’s real competencies, track placement metrics, and identify critical curriculum interventions demanded by industry.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Institution-wide Skill Analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> High Demand + Low Skill Alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Industry MoU & Lab Tracker
                </li>
              </ul>
            </div>

            {/* Industry Pillar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">For Industry & Recruiters</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Define exact requirements, post internships & jobs, and use reverse AI matching to rank candidate readiness across partner universities in 1 click.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> "Find Best Candidates" AI Ranking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> Candidate Proficiency Breakdown
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> 6-Stage Application Pipeline
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURE: TRANSPARENT AI MATCHING PREVIEW */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-4">
                <Brain className="w-3.5 h-3.5 text-amber-600" /> Explainable Weighted Match Engine
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Not Just a Percentage.
                <br />
                <span className="text-brand-600">Explainable AI</span> You Can Trust.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Most platforms display a black-box percentage. SkillBridge decomposes candidate eligibility into transparent, mathematically weighted criteria:
              </p>

              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>Required Skills Coverage</span>
                  <span className="font-extrabold text-brand-600">50% Weight</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>Proficiency Calibration (Beginner → Expert)</span>
                  <span className="font-extrabold text-purple-600">20% Weight</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>Academic Degree & Department Alignment</span>
                  <span className="font-extrabold text-indigo-600">10% Weight</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>CGPA Threshold Verification</span>
                  <span className="font-extrabold text-emerald-600">10% Weight</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>Domain Projects & Certifications</span>
                  <span className="font-extrabold text-amber-600">10% Weight</span>
                </div>
              </div>
            </div>

            {/* Interactive Card Mockup */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
                    Live Evaluation Sample
                  </span>
                  <div className="font-bold text-base text-white">
                    Aarav Sharma ↔ Full Stack Web Developer
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-400">92%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Overall Match</div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-4 text-xs mb-6">
                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-2">
                    Matched Requirements (✓)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold">
                      ✓ React (Advanced)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold">
                      ✓ Node.js (Advanced)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold">
                      ✓ Git (Advanced)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-2">
                    Level Difference (⚠)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-semibold">
                      ⚠ MongoDB (Intermediate vs Required Advanced)
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-2">
                    Missing Skill (✗)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-semibold">
                      ✗ Spring Boot (Required for backend microservices)
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation Quote */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold">Why 92%? </span>
                Candidate exceeds criteria in React and Node.js with strong MERN projects. Candidate can reach 98% compatibility by upskilling in Spring Boot.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY DEMAND PREVIEW CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              Real-time Demand vs Supply Matrix
            </h2>
            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              Explore how university student competencies align with current Indian industry skill demands across React, Cloud Computing, Docker, AI/ML, and Cybersecurity.
            </p>
            <Link
              to="/analytics/industry-demand"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition"
            >
              <BarChart3 className="w-4 h-4 text-brand-400" />
              <span>View Industry Demand Analytics</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
