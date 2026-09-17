import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Building, Briefcase, UserCheck, AlertCircle } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // Student fields
    fullName: '',
    collegeName: '',
    department: 'Computer Science and Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    cgpa: 8.0,
    // College fields
    institutionName: '',
    institutionType: 'Autonomous',
    location: '',
    website: '',
    // Company fields
    companyName: '',
    industryType: 'IT & Software',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...formData, role };
      const data = await register(payload);
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'college') navigate('/college/dashboard');
      else if (role === 'company') navigate('/industry/dashboard');
      else navigate('/opportunities');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            Skill<span className="text-brand-600">Bridge</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select your ecosystem role to get started
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        {/* ROLE SELECTOR TABS */}
        <div className="flex rounded-2xl bg-slate-200/70 p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              role === 'student'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('college')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              role === 'college'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>College</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              role === 'company'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Industry</span>
          </button>
        </div>

        {/* REGISTRATION FORM */}
        <div className="bg-white py-6 px-6 sm:px-8 rounded-2xl border border-slate-200 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@domain.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            {role === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      College Name
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      required
                      value={formData.collegeName}
                      onChange={handleChange}
                      placeholder="e.g. IIT Delhi / VJTI Mumbai"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option>Computer Science and Engineering</option>
                      <option>Information Technology</option>
                      <option>Electronics and Communication</option>
                      <option>Data Science & AI</option>
                      <option>Electrical Engineering</option>
                      <option>Mechanical Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      name="degree"
                      required
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="B.Tech"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Grad Year
                    </label>
                    <input
                      type="number"
                      name="graduationYear"
                      required
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      CGPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      name="cgpa"
                      required
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </>
            )}

            {role === 'college' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    required
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Institution Type
                    </label>
                    <select
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option>Autonomous</option>
                      <option>IIT/NIT</option>
                      <option>University</option>
                      <option>Affiliated</option>
                      <option>Government</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. New Delhi, India"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Institution Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://institution.edu.in"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </>
            )}

            {role === 'company' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Razorpay / Infosys"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Industry Domain
                    </label>
                    <select
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option>IT & Software</option>
                      <option>Finance & Fintech</option>
                      <option>AI & Data Analytics</option>
                      <option>E-commerce & Retail</option>
                      <option>Automotive & EV</option>
                      <option>Consulting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Location / HQ
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bengaluru, Karnataka"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? 'Creating Account...' : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
