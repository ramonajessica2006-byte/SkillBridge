import React from 'react';
import { GraduationCap, Heart, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Skill<span className="text-brand-600">Bridge</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
              A unified national digital ecosystem bridging Indian academia and industries through explainable AI skill mapping, real-time demand analytics, internships, and structured placement pipelines.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Ecosystem
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/opportunities" className="hover:text-brand-600 transition">Browse Opportunities</Link></li>
              <li><Link to="/analytics/industry-demand" className="hover:text-brand-600 transition">Industry Skill Demand Matrix</Link></li>
              <li><Link to="/login" className="hover:text-brand-600 transition">Quick Demo Accounts</Link></li>
              <li><Link to="/register" className="hover:text-brand-600 transition">Join Platform</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Key Pillars
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Students ↔ Skill Mapping</li>
              <li>Colleges ↔ Curriculum Alignment</li>
              <li>Industries ↔ Reverse Candidate Ranking</li>
              <li>Explainable AI Compatibility</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            © {new Date().getFullYear()} SkillBridge Platform.
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for Indian higher education.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
