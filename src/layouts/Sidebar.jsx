import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  GitPullRequest,
  Briefcase,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  Handshake,
  PlusCircle,
  Search,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isStudent, isCollege, isCompany } = useAuth();

  const studentNav = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Skill Profile', icon: User },
    { to: '/student/skill-gap', label: 'Skill Gap Analysis', icon: GitPullRequest, badge: 'AI' },
    { to: '/opportunities', label: 'Internships & Jobs', icon: Briefcase },
    { to: '/student/applications', label: 'My Applications', icon: FileText },
  ];

  const collegeNav = [
    { to: '/college/dashboard', label: 'College Analytics', icon: LayoutDashboard },
    { to: '/college/students', label: 'Student Directory', icon: Users },
    { to: '/analytics/industry-demand', label: 'Industry Skill Demand', icon: BarChart3 },
    { to: '/college/curriculum-gap', label: 'Curriculum Interventions', icon: BookOpen, badge: 'Crucial' },
    { to: '/college/collaborations', label: 'Academia-Industry MoUs', icon: Handshake },
  ];

  const companyNav = [
    { to: '/industry/dashboard', label: 'Hiring Console', icon: LayoutDashboard },
    { to: '/industry/post-opportunity', label: 'Post Opening', icon: PlusCircle },
    { to: '/industry/manage-opportunities', label: 'Manage Postings', icon: Briefcase },
    { to: '/industry/candidates', label: 'Find Best Candidates', icon: Search, badge: 'AI' },
    { to: '/college/collaborations', label: 'Campus Partnerships', icon: Handshake },
  ];

  const currentNav = isStudent ? studentNav : isCollege ? collegeNav : isCompany ? companyNav : [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Section: Main Menu */}
          <div>
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {currentNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 uppercase">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Section: Shared Explorer */}
          <div>
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Exploration
            </div>
            <nav className="space-y-1">
              <NavLink
                to="/opportunities"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>All Openings</span>
              </NavLink>

              <NavLink
                to="/analytics/industry-demand"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <span>Industry Demand Matrix</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-2xl border">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
          </div>  
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
