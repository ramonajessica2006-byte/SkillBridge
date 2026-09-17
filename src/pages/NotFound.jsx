import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-base font-bold text-slate-700 mt-1">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
        The requested resource does not exist or has been relocated. Return to your dashboard or explore open campus roles.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
