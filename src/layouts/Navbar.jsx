import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { AvatarIcon, getAvatar } from '../components/AvatarSelector';
import {
  Bell,
  LogOut,
  User,
  Building,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCheck,
  ExternalLink,
  ChevronDown,
  Menu,
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, profile, logout, isStudent, isCollege, isCompany } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const getRoleBadge = () => {
    if (isStudent) return { label: 'Student', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (isCollege) return { label: 'College Faculty', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (isCompany) return { label: 'Industry Partner', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    return { label: 'User', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const role = getRoleBadge();
  const displayName = profile?.fullName || profile?.institutionName || profile?.companyName || user?.email?.split('@')[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile menu toggle + Logo */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  Skill<span className="text-brand-600">Bridge</span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium text-slate-500 -mt-1">
                  Connecting Talent, Academia & Industry
                </span>
              </div>
            </Link>
          </div>

          {/* Center Links (if visitor) */}
          {!user && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/opportunities" className="hover:text-brand-600 transition">
                Opportunities
              </Link>
              <Link to="/analytics/industry-demand" className="hover:text-brand-600 transition">
                Industry Skill Demand
              </Link>
              <Link to="/login" className="hover:text-brand-600 transition">
                Demo Accounts
              </Link>
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Card */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) navigate(n.link);
                                setShowNotifications(false);
                              }}
                              className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${
                                !n.isRead ? 'bg-brand-50/40 font-medium' : 'text-slate-600'
                              }`}
                            >
                              <div className="font-bold text-slate-800 mb-0.5">{n.title}</div>
                              <p className="text-slate-600 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center overflow-hidden border border-brand-200">
                      {getAvatar(user.avatar) ? (
                        <AvatarIcon avatarId={user.avatar} size={36} />
                      ) : (
                        displayName?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                        {displayName}
                      </div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${role.color}`}>
                        {role.label}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900">{displayName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      </div>

                      <div className="py-1 text-xs text-slate-700">
                        {isStudent && (
                          <Link
                            to="/student/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-slate-400" /> My Skill Profile
                          </Link>
                        )}
                        {isCollege && (
                          <Link
                            to="/college/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                          >
                            <Building className="w-4 h-4 text-slate-400" /> College Dashboard
                          </Link>
                        )}
                        {isCompany && (
                          <Link
                            to="/industry/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                          >
                            <Briefcase className="w-4 h-4 text-slate-400" /> Company Console
                          </Link>
                        )}
                        <Link
                          to="/opportunities"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-400" /> Opportunities
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={logout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
