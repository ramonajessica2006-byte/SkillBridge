import React, { useEffect, useState } from 'react';
import { AvatarIcon, getAvatar } from '../../components/AvatarSelector';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  Building,
  GraduationCap,
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  XCircle,
  ExternalLink,
  Save,
} from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';

const ApplicantReview = () => {
  const { opportunityId } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      // Fetch opportunity
      const oppRes = await api.get(`/opportunities/${opportunityId}`);
      if (oppRes.data.success) {
        setOpportunity(oppRes.data.data);
      }

      // Fetch applications
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const appRes = await api.get(`/applications/opportunity/${opportunityId}?${params.toString()}`);
      if (appRes.data.success) {
        setApplications(appRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching applicants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [opportunityId, statusFilter]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        note: `Recruiter updated status to ${newStatus}`,
      });
      if (res.data.success) {
        setMessage(`Applicant status changed to "${newStatus}"! Notification sent.`);
        fetchApplicants();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        to="/industry/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Hiring Console
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            {opportunity?.type || 'Opening'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Applicant Pipeline: {opportunity?.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {opportunity?.location} • {applications.length} Total Applicants Submitted
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* APPLICANTS LIST */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
          Loading candidate submissions...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No applicants currently in this stage.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const stu = app.student || {};

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:border-brand-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-lg border border-brand-200 shrink-0">
                      {getAvatar(stu.user?.avatar) ? (
                        <AvatarIcon avatarId={stu.user.avatar} size={48} />
                      ) : (
                        stu.fullName?.charAt(0) || 'U'
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{stu.fullName}</h3>
                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          {app.matchScore || 85}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {stu.collegeName} • {stu.degree} in {stu.department} (CGPA: {stu.cgpa || '8.0'})
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {(stu.skills || []).map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {sk.name} ({sk.proficiency})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resume & Profile */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    {stu.resumeUrl && (
                      <a
                        href={stu.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-600" /> Resume PDF
                      </a>
                    )}
                  </div>
                </div>

                {/* Candidate Notes if any */}
                {app.notes && (
                  <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Cover Note: </span>
                    {app.notes}
                  </div>
                )}

                {/* Status Updater Buttons Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Current Status:</span>
                    <span className="font-extrabold px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px]">
                      {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 mr-1">Move to:</span>
                    {['Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={app.status === st || updatingId === app._id}
                        onClick={() => handleUpdateStatus(app._id, st)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition disabled:opacity-30 ${
                          st === 'Selected'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : st === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                            : st === 'Interview'
                            ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
                            : st === 'Shortlisted'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicantReview;
