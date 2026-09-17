import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import MatchDetailModal from '../../components/common/MatchDetailModal';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Building,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Calendar,
} from 'lucide-react';

const OpportunitiesList = () => {
  const { profile, isStudent } = useAuth();
  const [searchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [matchesMap, setMatchesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState(searchParams.get('skill') || '');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (typeFilter) params.append('type', typeFilter);
        if (workModeFilter) params.append('workMode', workModeFilter);
        if (skillFilter) params.append('skill', skillFilter);

        const res = await api.get(`/opportunities?${params.toString()}`);
        if (res.data.success) {
          setOpportunities(res.data.data);
        }

        // If logged in as student, calculate matches for all opportunities
        if (profile?._id) {
          const matchRes = await api.get(`/matching/jobs/${profile._id}`);
          if (matchRes.data.success) {
            const map = {};
            matchRes.data.data.forEach((item) => {
              map[item.opportunity._id] = item.match;
            });
            setMatchesMap(map);
          }
        }
      } catch (err) {
        console.error('Failed to load opportunities', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchOpportunities, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, typeFilter, workModeFilter, skillFilter, profile?._id]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-600" />
            Internships & Placement Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore verified corporate openings calibrated against academic skill standards
          </p>
        </div>

        {isStudent && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-brand-600" />
            AI Compatibility Active
          </div>
        )}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company name, or technology..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Opportunity Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time Job</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="md:col-span-3">
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        {/* Quick Skill Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold text-[10px] uppercase mr-1">Popular:</span>
          {['React', 'Node.js', 'Java', 'Python', 'Docker', 'AWS', 'PyTorch'].map((sk) => (
            <button
              key={sk}
              type="button"
              onClick={() => setSkillFilter(skillFilter === sk ? '' : sk)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition ${
                skillFilter === sk
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sk}
            </button>
          ))}
          {skillFilter && (
            <button
              onClick={() => setSkillFilter('')}
              className="text-[11px] font-bold text-rose-600 ml-2 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* OPPORTUNITIES GRID */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Filtering verified opportunities...
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching opportunities found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or clear your filters to view all active postings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => {
            const match = matchesMap[opp._id];

            return (
              <div
                key={opp._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
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
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                            {opp.type}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {opp.companyName}
                          </span>
                        </div>
                        <Link
                          to={`/opportunities/${opp._id}`}
                          className="text-sm font-bold text-slate-900 hover:text-brand-600 transition block mt-0.5"
                        >
                          {opp.title}
                        </Link>
                      </div>
                    </div>

                    {/* Match Score Badge if Student */}
                    {match && (
                      <MatchScoreBadge
                        score={match.overallScore}
                        onClick={() => setSelectedMatch(match)}
                      />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {opp.description}
                  </p>

                  {/* Required Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(opp.requiredSkills || []).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer specs */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{opp.salaryStipend}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {opp.location} • {opp.workMode}
                    </div>
                  </div>

                  <Link
                    to={`/opportunities/${opp._id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explainable AI Modal */}
      <MatchDetailModal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        matchData={selectedMatch}
      />
    </div>
  );
};

export default OpportunitiesList;
