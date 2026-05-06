import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Home/Footer';

const NotFound = () => {
  const navigate = useNavigate();
  const { user, getDashboardRoute } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-navy-100">
      <Navbar forceSolid={true} />

      {/* 404 Content */}
      <div className="pt-24 min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50">
        <div className="max-w-4xl w-full px-6 py-20 text-center relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03]">
            <h1 className="text-[400px] font-bold leading-none select-none">404</h1>
          </div>

          <div className="relative z-10">
            {/* Animated Icon */}
            <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 animate-bounce">
              <Search className="w-10 h-10 text-navy-600" strokeWidth={2.5} />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-heading text-slate-900 mb-6 tracking-tight">
              Lost in <span className="text-navy-600">Space?</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed mb-12 font-medium">
              We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-navy-600 hover:text-navy-600 transition-all shadow-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </div>
              </button>
              
              <Link
                to="/"
                className="w-full sm:w-auto px-10 py-4 bg-navy-600 text-white rounded-2xl font-bold hover:bg-navy-700 hover:shadow-xl hover:shadow-navy-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>

            {/* Suggested Links */}
            <div className="mt-20 pt-12 border-t border-slate-200/60 max-w-2xl mx-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Maybe try one of these instead?</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { label: 'Browse Jobs', path: '/jobs' },
                  { label: 'Read Articles', path: '/blogs' },
                  { label: 'Success Stories', path: '/success-stories' },
                  { label: 'Get Support', path: '/contact' }
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="px-6 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 border border-slate-100 hover:border-navy-600 hover:text-navy-600 transition-all shadow-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
