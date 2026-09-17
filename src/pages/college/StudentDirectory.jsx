import React, { useEffect, useState } from 'react';
import { AvatarIcon, getAvatar } from '../../components/AvatarSelector';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  ExternalLink,
  Award,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';
import SkillTag from '../../components/common/SkillTag';

const StudentDirectory = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (profile?._id) params.append('college', profile._id);
        if (search) params.append('search', search);
        if (deptFilter) params.append('department', deptFilter);
        if (skillFilter) params.append('skill', skillFilter);
        if (minCgpa) params.append('minCgpa', minCgpa);

        const res = await api.get(`/students?${params.toString()}`);
        if (res.data.success) {
          setStudents(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load students roster', err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchStudents, 250);
    return () => clearTimeout(delay);
  }, [profile?._id, search, deptFilter, skillFilter, minCgpa]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            Enrolled Student Skill Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, and inspect student skill profiles across campus departments
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          Total: {students.length} Candidates
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search name, skill, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Departments</option>
            <option>Computer Science and Engineering</option>
            <option>Information Technology</option>
            <option>Electronics and Communication</option>
            <option>Data Science & AI</option>
            <option>Electrical Engineering</option>
          </select>
        </div>

        {/* Skill Filter */}
        <div>
          <input
            type="text"
            placeholder="Filter by skill (e.g. React, Java, Docker)..."
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Min CGPA */}
        <div>
          <select
            value={minCgpa}
            onChange={(e) => setMinCgpa(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Any CGPA</option>
            <option value="8.5">CGPA ≥ 8.5</option>
            <option value="8.0">CGPA ≥ 8.0</option>
            <option value="7.5">CGPA ≥ 7.5</option>
            <option value="7.0">CGPA ≥ 7.0</option>
          </select>
        </div>
      </div>

      {/* STUDENTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading student roster...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No students found matching current query parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
              <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Department & Degree</th>
                  <th className="px-6 py-3.5">CGPA</th>
                  <th className="px-6 py-3.5">Top Skills</th>
                  <th className="px-6 py-3.5">Profile Strength</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => (
                  <tr key={stu._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center border border-brand-200 shrink-0">
                          {getAvatar(stu.user?.avatar) ? (
                            <AvatarIcon avatarId={stu.user.avatar} size={36} />
                          ) : (
                            stu.fullName?.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{stu.fullName}</div>
                          <div className="text-[11px] text-slate-500">{stu.user?.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      <div className="font-semibold">{stu.department}</div>
                      <div className="text-[11px] text-slate-500">{stu.degree} • Class of {stu.graduationYear}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                        {stu.cgpa || '8.0'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(stu.skills || []).slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {s.name}
                          </span>
                        ))}
                        {(stu.skills || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                            +{(stu.skills || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                          <span>{stu.profileCompletion || 65}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-brand-600 h-1.5 rounded-full"
                            style={{ width: `${stu.profileCompletion || 65}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(stu)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STUDENT PROFILE INSPECTION MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xl border border-brand-200">
                  {getAvatar(selectedStudent.user?.avatar) ? (
                    <AvatarIcon avatarId={selectedStudent.user.avatar} size={96} />
                  ) : (
                    selectedStudent.fullName?.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedStudent.degree} in {selectedStudent.department} (CGPA {selectedStudent.cgpa})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* About */}
            {selectedStudent.about && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Candidate Bio
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedStudent.about}</p>
              </div>
            )}

            {/* Skills */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Calibrated Skills ({(selectedStudent.skills || []).length})
              </div>
              <div className="flex flex-wrap gap-2">
                {(selectedStudent.skills || []).map((s, i) => (
                  <SkillTag key={i} name={s.name} category={s.category} proficiency={s.proficiency} />
                ))}
              </div>
            </div>

            {/* Projects */}
            {(selectedStudent.projects || []).length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Projects
                </div>
                <div className="space-y-2">
                  {selectedStudent.projects.map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume link */}
            {selectedStudent.resumeUrl && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Official Resume Available</span>
                <a
                  href={selectedStudent.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-700 transition shadow-sm"
                >
                  <FileText className="w-4 h-4" /> Download Resume
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
