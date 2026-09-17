import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SkillTag from '../../components/common/SkillTag';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';

const StudentProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    collegeName: '',
    department: '',
    degree: '',
    graduationYear: 2026,
    cgpa: 8.0,
    location: '',
    about: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  // Modals / add forms
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Programming', proficiency: 'Intermediate' });
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', link: '', github: '' });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', issueDate: '', credentialUrl: '' });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [avatarSaving, setAvatarSaving] = useState(false);

  useEffect(() => {
    setSelectedAvatar(user?.avatar || '');
  }, [user?.avatar]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        collegeName: profile.collegeName || '',
        department: profile.department || '',
        degree: profile.degree || '',
        graduationYear: profile.graduationYear || 2026,
        cgpa: profile.cgpa || 8.0,
        location: profile.location || '',
        about: profile.about || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
      });
    }
  }, [profile]);

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) {
      setError('Please choose an avatar first.');
      return;
    }

    setAvatarSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/auth/profile/avatar', { avatar: selectedAvatar });
      if (res.data.success) {
        await refreshProfile();
        setMessage('Profile avatar saved successfully.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save your avatar.');
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put(`/students/${profile._id}`, formData);
      if (res.data.success) {
        setMessage('Profile updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    try {
      const res = await api.post(`/students/${profile._id}/skills`, newSkill);
      if (res.data.success) {
        setNewSkill({ name: '', category: 'Programming', proficiency: 'Intermediate' });
        await refreshProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/students/${profile._id}/skills/${skillId}`);
      await refreshProfile();
    } catch (err) {
      setError('Failed to delete skill.');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    try {
      const payload = {
        ...newProject,
        techStack: newProject.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = await api.post(`/students/${profile._id}/projects`, payload);
      if (res.data.success) {
        setNewProject({ title: '', description: '', techStack: '', link: '', github: '' });
        await refreshProfile();
      }
    } catch (err) {
      setError('Failed to add project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/students/${profile._id}/projects/${projectId}`);
      await refreshProfile();
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCert.name.trim()) return;
    try {
      const res = await api.post(`/students/${profile._id}/certifications`, newCert);
      if (res.data.success) {
        setNewCert({ name: '', issuer: '', issueDate: '', credentialUrl: '' });
        await refreshProfile();
      }
    } catch (err) {
      setError('Failed to add certification.');
    }
  };

  const handleDeleteCert = async (certId) => {
    try {
      await api.delete(`/students/${profile._id}/certifications/${certId}`);
      await refreshProfile();
    } catch (err) {
      setError('Failed to delete certification.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('resume', file);

    try {
      const endpoint = `/students/${profile._id}/upload-resume`;

      await api.post(endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await refreshProfile();
      setMessage('Resume uploaded successfully!');
    } catch (err) {
      setError('Upload failed. Please try a valid PDF or Image file.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-brand-100 border-2 border-brand-300 overflow-hidden flex items-center justify-center font-bold text-2xl text-brand-700">
                {user?.avatar ? (
                  <AvatarIcon avatarId={user.avatar} size={80} />
                ) : (
                  profile?.fullName?.charAt(0) || 'U'
                )}
              </div>
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{profile?.fullName}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile?.degree} in {profile?.department} • Class of {profile?.graduationYear}
              </p>
              <p className="text-xs font-semibold text-brand-600 mt-0.5">{profile?.collegeName}</p>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="w-full sm:w-48 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700">
              <span>Profile Strength</span>
              <span className="text-brand-600">{profile?.profileCompletion || 70}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all"
                style={{ width: `${profile?.profileCompletion || 70}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              High completion attracts 3x more recruiter interview invites.
            </p>
          </div>
        </div>

        {/* Resume Uplink Section */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-brand-50/50 border border-brand-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-100 text-brand-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Official Student Resume</div>
              <div className="text-[11px] text-slate-500">
                {profile?.resumeUrl ? 'Resume uploaded and verified for applications' : 'Upload your resume PDF for company shortlisting'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Uploaded Resume
              </a>
            )}

            <label className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-sm">
              <Upload className="w-3.5 h-3.5" /> Upload New PDF
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* PROFILE AVATAR SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              Profile Avatar
            </h2>
            <p className="text-xs text-slate-500 mt-1">Choose an avatar for your SkillBridge profile</p>
          </div>
          <button
            type="button"
            onClick={handleSaveAvatar}
            disabled={avatarSaving}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {avatarSaving ? 'Saving...' : 'Save Avatar'}
          </button>
        </div>
        <AvatarSelector value={selectedAvatar} onChange={setSelectedAvatar} />
      </div>

      {/* SKILLS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              My Skills & Proficiency Calibration
            </h2>
            <p className="text-xs text-slate-500">
              Calibrate your expertise level to feed our 50% required skill & 20% proficiency algorithm
            </p>
          </div>
        </div>

        {/* Current Skills Chips */}
        <div className="flex flex-wrap gap-2.5 mb-6 min-h-[50px] p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
          {(profile?.skills || []).length === 0 ? (
            <span className="text-xs text-slate-400 italic">No skills added yet. Add below!</span>
          ) : (
            profile.skills.map((s) => (
              <SkillTag
                key={s._id}
                name={s.name}
                category={s.category}
                proficiency={s.proficiency}
                onDelete={() => handleDeleteSkill(s._id)}
              />
            ))
          )}
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-end gap-3 pt-4 border-t border-slate-100">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skill Name
            </label>
            <input
              type="text"
              placeholder="e.g. React, Spring Boot, Docker, PyTorch"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="w-full sm:w-44">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option>Programming</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Database</option>
              <option>Cloud & DevOps</option>
              <option>AI/ML</option>
              <option>Cybersecurity</option>
              <option>Core CS</option>
            </select>
          </div>

          <div className="w-full sm:w-40">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Proficiency
            </label>
            <select
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </form>
      </div>

      {/* PROJECTS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="pb-4 border-b border-slate-100 mb-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Showcase Projects
          </h2>
          <p className="text-xs text-slate-500">
            Relevant technical projects boost candidate experience scores by up to 10%
          </p>
        </div>

        {/* Existing Projects */}
        <div className="space-y-4 mb-6">
          {(profile?.projects || []).map((proj) => (
            <div key={proj._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-start">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(proj.techStack || []).map((t, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteProject(proj._id)}
                className="text-slate-400 hover:text-rose-600 transition p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="space-y-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-200">
          <div className="font-bold text-xs text-slate-800">Add New Project</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Project Title (e.g. Distributed Cache Proxy)"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="text"
              placeholder="Technologies used (comma-separated, e.g. React, Node.js, Redis)"
              value={newProject.techStack}
              onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <textarea
            rows={2}
            placeholder="Project description and key technical accomplishments..."
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Save Project
          </button>
        </form>
      </div>

      {/* CERTIFICATIONS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="pb-4 border-b border-slate-100 mb-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Certifications & Industry Credentials
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          {(profile?.certifications || []).map((c) => (
            <div key={c._id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">{c.name}</div>
                <div className="text-[11px] text-slate-500">{c.issuer} • {c.issueDate}</div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCert(c._id)}
                className="text-slate-400 hover:text-rose-600 transition p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Cert Form */}
        <form onSubmit={handleAddCert} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            required
            placeholder="Certification Name (e.g. AWS Cloud Practitioner)"
            value={newCert.name}
            onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
            className="flex-1 w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="text"
            required
            placeholder="Issuer (e.g. Amazon Web Services)"
            value={newCert.issuer}
            onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
            className="w-full sm:w-48 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Cert
          </button>
        </form>
      </div>

      {/* EDIT PERSONAL & ACADEMIC FORM */}
      <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Academic & Personal Profile Details</h2>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              College Institution
            </label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Degree
            </label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
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
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            About & Bio
          </label>
          <textarea
            rows={3}
            name="about"
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Portfolio URL
            </label>
            <input
              type="url"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
