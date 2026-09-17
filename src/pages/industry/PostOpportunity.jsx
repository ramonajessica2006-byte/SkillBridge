import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { PlusCircle, Plus, Trash2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const PostOpportunity = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Internship',
    workMode: 'On-site',
    location: profile?.location || 'Bengaluru, Karnataka',
    description: '',
    responsibilities: '',
    minCgpa: 7.0,
    experienceLevel: 'Fresher',
    salaryStipend: '₹35,000 / month',
    openings: 2,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  });

  // Skills state
  const [requiredSkills, setRequiredSkills] = useState([
    { name: 'React', category: 'Frontend', minProficiency: 'Intermediate' },
    { name: 'Node.js', category: 'Backend', minProficiency: 'Intermediate' },
  ]);
  const [newReqSkill, setNewReqSkill] = useState({ name: '', category: 'Programming', minProficiency: 'Intermediate' });

  const [preferredSkills, setPreferredSkills] = useState([{ name: 'Docker', category: 'Cloud & DevOps' }]);
  const [newPrefSkill, setNewPrefSkill] = useState({ name: '', category: 'Programming' });

  // Eligibility degrees & departments
  const availableDegrees = ['B.Tech', 'B.E.', 'MCA', 'BCA', 'M.Tech', 'B.Sc'];
  const [selectedDegrees, setSelectedDegrees] = useState(['B.Tech', 'B.E.', 'MCA']);

  const availableDepts = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication',
    'Data Science & AI',
    'Electrical Engineering',
  ];
  const [selectedDepts, setSelectedDepts] = useState([
    'Computer Science and Engineering',
    'Information Technology',
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddReqSkill = () => {
    if (!newReqSkill.name.trim()) return;
    setRequiredSkills([...requiredSkills, newReqSkill]);
    setNewReqSkill({ name: '', category: 'Programming', minProficiency: 'Intermediate' });
  };

  const handleRemoveReqSkill = (index) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const handleAddPrefSkill = () => {
    if (!newPrefSkill.name.trim()) return;
    setPreferredSkills([...preferredSkills, newPrefSkill]);
    setNewPrefSkill({ name: '', category: 'Programming' });
  };

  const handleRemovePrefSkill = (index) => {
    setPreferredSkills(preferredSkills.filter((_, i) => i !== index));
  };

  const toggleDegree = (deg) => {
    if (selectedDegrees.includes(deg)) {
      setSelectedDegrees(selectedDegrees.filter((d) => d !== deg));
    } else {
      setSelectedDegrees([...selectedDegrees, deg]);
    }
  };

  const toggleDept = (dept) => {
    if (selectedDepts.includes(dept)) {
      setSelectedDepts(selectedDepts.filter((d) => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        company: profile._id,
        requiredSkills,
        preferredSkills,
        requiredDegree: selectedDegrees,
        requiredDepartment: selectedDepts,
        responsibilities: formData.responsibilities
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
      };

      const res = await api.post('/opportunities', payload);
      if (res.data.success) {
        navigate('/industry/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish opening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-brand-600" />
            Create Campus Opening
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify technical competency criteria to trigger our multi-college AI candidate matcher
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
            1. Role Metadata
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Title
              </label>
              <input
                type="text"
                required
                name="title"
                placeholder="e.g. Associate Full Stack Engineer / AI Intern"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time Placement</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Mode
              </label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru / Hyderabad"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Salary / Monthly Stipend
              </label>
              <input
                type="text"
                required
                name="salaryStipend"
                value={formData.salaryStipend}
                onChange={handleChange}
                placeholder="e.g. ₹40,000 / month or ₹12 - ₹16 LPA"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Number of Openings
              </label>
              <input
                type="number"
                min="1"
                required
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                required
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Description
            </label>
            <textarea
              rows={3}
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the role, challenges, and team expectations..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows={3}
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Design scalable API endpoints&#10;Optimize database indexes&#10;Write integration test suites"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>
        </div>

        {/* REQUIRED SKILLS MATRIX (50% ALGORITHM WEIGHT) */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                2. Required Skills & Minimum Proficiency (50% Weight)
              </h2>
              <p className="text-[11px] text-slate-500">
                Candidates will be evaluated directly against these benchmarks
              </p>
            </div>
          </div>

          {/* Current Required Skills List */}
          <div className="space-y-2">
            {requiredSkills.map((sk, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{sk.name}</span>
                  <span className="text-[10px] text-slate-500">({sk.category})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                    Min: {sk.minProficiency}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReqSkill(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Required Skill Input Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-2xl bg-brand-50/40 border border-brand-200">
            <input
              type="text"
              placeholder="Skill Name (e.g. Java, Docker, PyTorch)"
              value={newReqSkill.name}
              onChange={(e) => setNewReqSkill({ ...newReqSkill, name: e.target.value })}
              className="flex-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            />
            <select
              value={newReqSkill.minProficiency}
              onChange={(e) => setNewReqSkill({ ...newReqSkill, minProficiency: e.target.value })}
              className="w-full sm:w-40 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
            <button
              type="button"
              onClick={handleAddReqSkill}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Required
            </button>
          </div>
        </div>

        {/* PREFERRED SKILLS MATRIX (BONUS SCORE) */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            3. Preferred / Optional Skills (Bonus 5%)
          </h2>

          <div className="flex flex-wrap gap-2">
            {preferredSkills.map((p, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200"
              >
                +{p.name}
                <button
                  type="button"
                  onClick={() => handleRemovePrefSkill(idx)}
                  className="text-indigo-400 hover:text-rose-600"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Preferred skill (e.g. AWS, Kubernetes, Redis)"
              value={newPrefSkill.name}
              onChange={(e) => setNewPrefSkill({ ...newPrefSkill, name: e.target.value })}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleAddPrefSkill}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
            >
              Add Preferred
            </button>
          </div>
        </div>

        {/* ELIGIBILITY CRITERIA */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            4. Academic Eligibility Criteria
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum CGPA
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="minCgpa"
                value={formData.minCgpa}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option>Fresher</option>
                <option>0-1 Years</option>
                <option>1-3 Years</option>
                <option>3+ Years</option>
              </select>
            </div>
          </div>

          {/* Eligible Degrees */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Allowed Degrees
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDegrees.map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => toggleDegree(deg)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                    selectedDegrees.includes(deg)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {deg}
                </button>
              ))}
            </div>
          </div>

          {/* Eligible Departments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Allowed Departments
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDepts.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleDept(dept)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                    selectedDepts.includes(dept)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Campus Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostOpportunity;
