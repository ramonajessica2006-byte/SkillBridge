import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import MatchDetailModal from '../../components/common/MatchDetailModal';
import SkillTag from '../../components/common/SkillTag';
import {
  Building,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ExternalLink,
  Users,
  Send,
  ArrowLeft,
} from 'lucide-react';

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, isStudent, isAuthenticated } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [match, setMatch] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [notes, setNotes] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Opportunity
        const res = await api.get(`/opportunities/${id}`);
        if (res.data.success) {
          setOpportunity(res.data.data);
        }

        // 2. Check if student has applied
        if (profile?._id) {
          const appRes = await api.get('/applications/my-applications');
          if (appRes.data.success) {
            const hasApplied = appRes.data.data.some(
              (a) => a.opportunity?._id === id || a.opportunity === id
            );
            setApplied(hasApplied);
          }

          // 3. Compute live match evaluation
          const matchRes = await api.get(`/matching/evaluate?studentId=${profile._id}&opportunityId=${id}`);
          if (matchRes.data.success) {
            setMatch(matchRes.data.data);
          }
        }
      } catch (err) {
        console.error('Error fetching opportunity detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunityData();
  }, [id, profile?._id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!profile?._id) {
      navigate('/login');
      return;
    }
    setApplying(true);
    setError('');
    setMessage('');
    try {
      const res = await api.post('/applications', {
        opportunityId: id,
        notes,
      });
      if (res.data.success) {
        setApplied(true);
        setShowApplyModal(false);
        setMessage('Application submitted successfully! Check your application tracker.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
        Retrieving opening specifications and evaluating candidate fit...
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        Opportunity not found or no longer active.
      </div>
    );
  }

  const comp = opportunity.company || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        to="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all opportunities
      </Link>

      {/* Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {comp.logoUrl ? (
                <img src={comp.logoUrl} alt={opportunity.companyName} className="w-full h-full object-cover" />
              ) : (
                <Building className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {opportunity.type}
                </span>
                <span className="text-xs font-bold text-slate-600">{opportunity.companyName}</span>
                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-brand-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {opportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opportunity.location} ({opportunity.workMode})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline:{' '}
                  {new Date(opportunity.deadline).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {opportunity.openings} Openings
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="text-xl font-black text-slate-900">{opportunity.salaryStipend}</div>

            {isStudent ? (
              applied ? (
                <div className="px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Already Applied
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition"
                >
                  <Send className="w-4 h-4" /> Apply Now
                </button>
              )
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                Sign In to Apply
              </Link>
            ) : null}
          </div>
        </div>

        {/* AI Match Overview Banner for Student */}
        {match && isStudent && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Compatibility Evaluation
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {match.explanation || 'Skill compatibility assessed via required skills, proficiency, degree, and projects.'}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-3xl font-black text-white">{match.overallScore}%</div>
                <div className="text-[10px] text-brand-200 uppercase font-bold tracking-wider">
                  Fit Score
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMatchModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
              >
                View Breakdown
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Description & Responsibilities */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">About the Role</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </div>

            {opportunity.responsibilities?.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-base font-bold text-slate-900 mb-3">Key Responsibilities</h2>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {opportunity.responsibilities.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills Table */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Required Technical Competencies (50% Weight)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(opportunity.requiredSkills || []).map((sk, idx) => {
                  const studentHas = match?.matchedSkills?.some(
                    (m) => m.name.toLowerCase() === sk.name.toLowerCase()
                  );
                  const studentWeak = match?.weakSkills?.some(
                    (w) => w.name.toLowerCase() === sk.name.toLowerCase()
                  );

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        studentHas
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : studentWeak
                          ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{sk.name}</div>
                        <div className="text-[10px] text-slate-500">Min. {sk.minProficiency}</div>
                      </div>

                      {isStudent && (
                        <div>
                          {studentHas && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              ✓ Matched
                            </span>
                          )}
                          {studentWeak && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              ⚠ Level Gap
                            </span>
                          )}
                          {!studentHas && !studentWeak && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                              ✗ Missing
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preferred Skills */}
            {opportunity.preferredSkills?.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 mb-2">Preferred / Bonus Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.preferredSkills.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200"
                    >
                      +{p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Eligibility Requirements & Company Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Eligibility Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Eligibility Criteria
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-500">Minimum CGPA:</span>
                <span className="font-bold text-slate-900">{opportunity.minCgpa || 'No minimum'}</span>
              </div>

              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-500">Experience:</span>
                <span className="font-bold text-slate-900">{opportunity.experienceLevel}</span>
              </div>

              <div>
                <span className="font-medium text-slate-500 block mb-1">Eligible Degrees:</span>
                <div className="flex flex-wrap gap-1">
                  {(opportunity.requiredDegree || []).map((deg, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[11px] text-slate-800">
                      {deg}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-medium text-slate-500 block mb-1">Target Departments:</span>
                <div className="space-y-1 text-[11px] font-semibold text-slate-700">
                  {(opportunity.requiredDepartment || []).map((dept, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                      <span>{dept}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About Company Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              About the Company
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed mb-4">
              {comp.description || 'Verified enterprise hiring partner on the SkillBridge platform.'}
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Industry:</span>
                <span className="font-semibold text-slate-800">{comp.industryType || 'IT & Software'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Headquarters:</span>
                <span className="font-semibold text-slate-800">{comp.location || 'India'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Company Size:</span>
                <span className="font-semibold text-slate-800">{comp.companySize || '10,000+ employees'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATION SUBMISSION MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Application Submission
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                You are applying for <b className="text-slate-900">{opportunity.title}</b> at{' '}
                <b className="text-slate-900">{opportunity.companyName}</b>.
              </p>
              <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 font-medium">
                Your profile skills, academic credentials, and uploaded resume will be transmitted directly to the corporate recruitment team with your live match score of <b>{match?.overallScore || 85}%</b>.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Candidate Cover Note (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Share any specific context regarding your project portfolio or availability..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={applying}
                onClick={handleApply}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Breakdown Modal */}
      <MatchDetailModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchData={match}
        title={`Skill Compatibility for ${opportunity.title}`}
      />
    </div>
  );
};

export default OpportunityDetail;
