import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Briefcase,
  PlusCircle,
  Sparkles,
  Users,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';

const ManageOpportunities = () => {
  const { profile } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchOpps = async () => {
    if (!profile?._id) return;
    try {
      setLoading(true);
      const res = await api.get(`/opportunities?company=${profile._id}`);
      if (res.data.success) {
        setOpportunities(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch opportunities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, [profile?._id]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    try {
      await api.put(`/opportunities/${id}`, { status: newStatus });
      setMessage(`Opening status updated to ${newStatus}`);
      fetchOpps();
    } catch (err) {
      console.error('Error toggling status', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await api.delete(`/opportunities/${id}`);
      setMessage('Opportunity deleted successfully.');
      fetchOpps();
    } catch (err) {
      console.error('Error deleting opportunity', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-600" />
            Manage Posted Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain active job & internship listings, monitor applicants, and rank talent
          </p>
        </div>

        <Link
          to="/industry/post-opportunity"
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" /> Post New Role
        </Link>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading corporate postings...
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No opportunities posted yet. Click "Post New Role" above.
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-800">
                    {opp.type}
                  </span>
                  <button
                    onClick={() => toggleStatus(opp._id, opp.status)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                      opp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    ● {opp.status} (Click to toggle)
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{opp.salaryStipend}</span>
                  <span>•</span>
                  <span>{opp.location} ({opp.workMode})</span>
                  <span>•</span>
                  <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
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
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Review Applicants
                </Link>

                <button
                  onClick={() => handleDelete(opp._id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete opening"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOpportunities;
