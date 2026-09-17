import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my-applications');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shortlisted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-600" />
          My Applications & Hiring Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your application lifecycle across all partner recruiters in real-time
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading application pipelines...
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Browse our recommended jobs and internships to find opportunities that align with your skillset.
          </p>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition"
          >
            Explore Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const opp = app.opportunity || {};
            const isExpanded = expandedApp === app._id;
            const currentStageIdx = stages.indexOf(app.status);

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-brand-200 transition"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                        {opp.company?.logoUrl ? (
                          <img
                            src={opp.company.logoUrl}
                            alt={opp.companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                            {opp.type || 'Internship'}
                          </span>
                          <span className="text-xs font-bold text-slate-600">
                            {opp.companyName || 'Partner Company'}
                          </span>
                        </div>

                        <Link
                          to={`/opportunities/${opp._id}`}
                          className="text-base font-bold text-slate-900 hover:text-brand-600 transition block mt-0.5"
                        >
                          {opp.title || 'Engineering Role'}
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Applied on{' '}
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Application Match
                        </div>
                        <div className="font-extrabold text-sm text-slate-800">
                          {app.matchScore || 85}%
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Stage Stepper Progress */}
                  {app.status !== 'Rejected' && (
                    <div className="mt-6 pt-6 border-t border-slate-100 hidden sm:block">
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {stages.map((stage, idx) => {
                          const isDone = idx <= currentStageIdx;
                          const isCurrent = idx === currentStageIdx;

                          return (
                            <div key={stage} className="relative">
                              <div
                                className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                                  isCurrent
                                    ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                                    : isDone
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isDone && !isCurrent ? '✓' : idx + 1}
                              </div>
                              <div
                                className={`text-[11px] mt-1.5 font-semibold ${
                                  isCurrent
                                    ? 'text-brand-700 font-bold'
                                    : isDone
                                    ? 'text-slate-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {stage}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Toggle Timeline Drawer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                      className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition"
                    >
                      {isExpanded ? (
                        <>
                          Hide Status Log <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          View Status Log ({(app.statusHistory || []).length}){' '}
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <Link
                      to={`/opportunities/${opp._id}`}
                      className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                    >
                      View Posting <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Timeline History Drawer */}
                {isExpanded && (
                  <div className="bg-slate-50 p-5 border-t border-slate-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Recruitment Action Log
                    </div>
                    <div className="space-y-3">
                      {(app.statusHistory || []).map((h, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs">
                          <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0"></span>
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                              <span>{h.status}</span>
                              <span className="text-[10px] font-normal text-slate-400">
                                {new Date(h.changedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">{h.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
