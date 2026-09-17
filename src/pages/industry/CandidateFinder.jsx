import React, { useEffect, useState } from 'react';
import { AvatarIcon, getAvatar } from '../../components/AvatarSelector';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import MatchDetailModal from '../../components/common/MatchDetailModal';
import {
  Search,
  Sparkles,
  Users,
  Building,
  GraduationCap,
  Award,
  FileText,
  Filter,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

const CandidateFinder = () => {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('jobId') || '');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minScore, setMinScore] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);

  // 1. Fetch Company's opportunities for dropdown
  useEffect(() => {
    const fetchCompanyOpps = async () => {
      if (!profile?._id) return;
      try {
        const res = await api.get(`/opportunities?company=${profile._id}`);
        if (res.data.success && res.data.data.length > 0) {
          setOpportunities(res.data.data);
          if (!selectedJobId) {
            setSelectedJobId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load opportunities', err);
      }
    };
    fetchCompanyOpps();
  }, [profile?._id]);

  // 2. Fetch Ranked Candidates for selected opportunity
  useEffect(() => {
    const fetchBestCandidates = async () => {
      if (!selectedJobId) return;
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (minScore) params.append('minScore', minScore);

        const res = await api.get(`/matching/candidates/${selectedJobId}?${params.toString()}`);
        if (res.data.success) {
          setCandidates(res.data.data);
        }
      } catch (err) {
        console.error('Failed to rank candidates', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestCandidates();
  }, [selectedJobId, minScore]);

  const selectedOpp = opportunities.find((o) => o._id === selectedJobId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Reverse AI Candidate Matching
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Find Best Candidates
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Instantly evaluate all enrolled students across partner engineering colleges against your opening's exact requirements and proficiencies.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <div className="text-3xl font-black text-amber-400">{candidates.length}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Ranked Talent
          </div>
        </div>
      </div>

      {/* SELECTOR CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Target Opening:
          </span>
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setSearchParams({ jobId: e.target.value });
            }}
            className="w-full sm:w-80 px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {opportunities.map((opp) => (
              <option key={opp._id} value={opp._id}>
                {opp.title} ({opp.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Min Fit:
          </span>
          <select
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Scores</option>
            <option value="80">≥ 80% Fit (High)</option>
            <option value="70">≥ 70% Fit</option>
            <option value="60">≥ 60% Fit</option>
          </select>
        </div>
      </div>

      {/* CANDIDATES LIST */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
          Running 5-factor weighted algorithm across candidate database...
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500 shadow-sm">
          No candidates found matching the criteria for this position.
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map(({ student, match }, idx) => (
            <div
              key={student._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-300 transition flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-lg border border-brand-200 shrink-0">
                    {getAvatar(student.avatar) ? (
                      <AvatarIcon avatarId={student.avatar} size={48} />
                    ) : (
                      student.fullName.charAt(0)
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        Rank #{idx + 1}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">{student.fullName}</span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      {student.collegeName} • {student.degree} in {student.department}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5 font-medium">
                      <span>CGPA: <b className="text-slate-900">{student.cgpa}</b></span>
                      <span>•</span>
                      <span>{student.projectsCount} Projects</span>
                      <span>•</span>
                      <span>{student.certificationsCount} Certifications</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <MatchScoreBadge
                    score={match.overallScore}
                    onClick={() => setSelectedMatch(match)}
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(match)}
                    className="text-[11px] font-bold text-slate-500 hover:text-brand-600 underline"
                  >
                    View Breakdown
                  </button>
                </div>
              </div>

              {/* Matched & Missing Skills Breakdown */}
              <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 mr-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched ({match.matchedSkills?.length}):
                  </span>
                  {match.matchedSkills?.map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      ✓ {s.name} ({s.studentProficiency})
                    </span>
                  ))}
                </div>

                {match.weakSkills?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-amber-700 mr-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Level Gap:
                    </span>
                    {match.weakSkills?.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        ⚠ {s.name} ({s.studentProficiency} vs req {s.requiredProficiency})
                      </span>
                    ))}
                  </div>
                )}

                {match.missingSkills?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-rose-700 mr-1 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Missing:
                    </span>
                    {match.missingSkills?.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200"
                      >
                        ✗ {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 italic max-w-md truncate">
                  {match.explanation}
                </span>

                <div className="flex items-center gap-2">
                  {student.resumeUrl ? (
                    <a
                      href={student.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> Resume
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No PDF attached</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Match Breakdown Modal */}
      <MatchDetailModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        matchData={selectedMatch}
      />
    </div>
  );
};

export default CandidateFinder;
