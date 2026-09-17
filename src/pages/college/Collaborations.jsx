import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Handshake,
  Plus,
  Building,
  Calendar,
  Award,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const Collaborations = () => {
  const { profile, isCollege, isCompany } = useAuth();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCollab, setNewCollab] = useState({
    title: '',
    type: 'MoU',
    description: '',
    skillsTargeted: '',
    companyId: '',
    collegeId: '',
  });
  const [companies, setCompanies] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collabRes, compRes, colRes] = await Promise.all([
          api.get('/collaborations'),
          api.get('/companies'),
          api.get('/colleges'),
        ]);

        if (collabRes.data.success) setCollaborations(collabRes.data.data);
        if (compRes.data.success) setCompanies(compRes.data.data);
        if (colRes.data.success) setColleges(colRes.data.data);
      } catch (err) {
        console.error('Error loading collaborations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newCollab.title,
        type: newCollab.type,
        description: newCollab.description,
        skillsTargeted: newCollab.skillsTargeted.split(',').map((s) => s.trim()).filter(Boolean),
        collegeId: isCollege ? profile._id : newCollab.collegeId,
        companyId: isCompany ? profile._id : newCollab.companyId,
      };

      const res = await api.post('/collaborations', payload);
      if (res.data.success) {
        setMessage('Collaboration registered successfully!');
        setCollaborations([res.data.data, ...collaborations]);
        setShowModal(false);
      }
    } catch (err) {
      console.error('Error creating collaboration', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Handshake className="w-6 h-6 text-brand-600" />
            Academia–Industry Collaborations & MoUs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking strategic institutional partnerships, sponsored labs, and curriculum alignment initiatives
          </p>
        </div>

        {(isCollege || isCompany) && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Propose New MoU / Partnership
          </button>
        )}
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* COLLABORATIONS LIST */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading institutional partnerships...
        </div>
      ) : collaborations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No collaborations recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collaborations.map((collab) => (
            <div
              key={collab._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-brand-200 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {collab.type}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {collab.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-2">
                  {collab.title}
                </h3>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="font-bold text-slate-800">{collab.collegeName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="font-bold text-slate-800">{collab.companyName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {collab.description}
                </p>

                {collab.skillsTargeted?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {collab.skillsTargeted.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Active since{' '}
                  {new Date(collab.startDate || collab.createdAt).toLocaleDateString()}
                </span>
                <span className="font-bold text-brand-600">Institutional MoU</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: PROPOSE COLLABORATION */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Register New Industry-Academia MoU
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Partnership Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Center of Excellence in Cloud & AI"
                  value={newCollab.title}
                  onChange={(e) => setNewCollab({ ...newCollab, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Partnership Type
                  </label>
                  <select
                    value={newCollab.type}
                    onChange={(e) => setNewCollab({ ...newCollab, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option>MoU</option>
                    <option>Curriculum Alignment</option>
                    <option>Sponsored Lab</option>
                    <option>Faculty Training</option>
                    <option>Hackathon</option>
                    <option>Campus Drive</option>
                  </select>
                </div>

                {!isCompany && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Partner Company
                    </label>
                    <select
                      value={newCollab.companyId}
                      required
                      onChange={(e) => setNewCollab({ ...newCollab, companyId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select Company</option>
                      {companies.map((c) => (
                        <option key={c._id} value={c._id}>{c.companyName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {!isCollege && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Partner College
                    </label>
                    <select
                      value={newCollab.collegeId}
                      required
                      onChange={(e) => setNewCollab({ ...newCollab, collegeId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select College</option>
                      {colleges.map((c) => (
                        <option key={c._id} value={c._id}>{c.institutionName}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Skills Targeted (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Docker, Kubernetes, Cloud, AI/ML"
                  value={newCollab.skillsTargeted}
                  onChange={(e) => setNewCollab({ ...newCollab, skillsTargeted: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Scope & Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe joint objectives, workshops, or lab equipment provisions..."
                  value={newCollab.description}
                  onChange={(e) => setNewCollab({ ...newCollab, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition shadow-sm"
                >
                  Save Collaboration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborations;
