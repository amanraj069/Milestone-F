import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ forceSolid = false, searchBar }) => {
  const { user, getDashboardRoute, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const showWhiteBg = scrolled || forceSolid || !isHome || mobileMenuOpen;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        showWhiteBg ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Left Section: Logo & Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className={`text-xl font-bold tracking-tight transition-colors ${
                showWhiteBg || isHome ? 'text-slate-900' : 'text-white'
              }`}>
                Mile<span className="text-blue-600">stone</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7">
              <Link to="/jobs" className={`text-sm font-medium transition-colors ${
                showWhiteBg || isHome ? 'text-slate-500 hover:text-blue-600' : 'text-white/70 hover:text-white'
              }`}>Find Work</Link>
              <Link to="/blogs" className={`text-sm font-medium transition-colors ${
                showWhiteBg || isHome ? 'text-slate-500 hover:text-blue-600' : 'text-white/70 hover:text-white'
              }`}>Resources</Link>
            </nav>
          </div>

          {/* Center/Right Section: Search & Auth */}
          <div className="flex-1 flex items-center justify-end gap-6">
            {/* Search Section */}
            <div className={`hidden md:flex flex-1 items-center justify-end max-w-md ${!searchBar && isHome ? 'invisible w-0' : ''}`}>
              {searchBar ? (
                searchBar
              ) : (
                <div className="relative w-full group/search">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-search text-[10px] text-slate-400 group-focus-within/search:text-blue-600 transition-colors"></i>
                  </div>
                  <form onSubmit={handleSearch} className="relative">
                    <input 
                      type="text" 
                      placeholder="Search jobs..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-full text-xs font-medium outline-none transition-all ${
                        showWhiteBg 
                          ? 'bg-slate-100/50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20' 
                          : 'bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:bg-white/20'
                      }`}
                    />
                  </form>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      showWhiteBg || isHome
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <i className="fas fa-right-from-bracket text-xs"></i>
                    Logout
                  </button>
                  <Link 
                    to={getDashboardRoute()} 
                    className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`hidden sm:block px-3 py-2 text-sm font-medium transition-all ${
                      showWhiteBg || isHome ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all whitespace-nowrap"
                  >
                    Join Now
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                  showWhiteBg || isHome ? 'text-slate-600 hover:bg-slate-100' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 py-6 px-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-6">
              <div className="md:hidden">
                {searchBar || (
                  <form onSubmit={handleSearch} className="relative">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                    />
                    <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  </form>
                )}
              </div>
              <nav className="flex flex-col gap-4">
                <Link to="/jobs" className="text-base font-bold text-slate-900" onClick={() => setMobileMenuOpen(false)}>Find Work</Link>
                <Link to="/blogs" className="text-base font-bold text-slate-900" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
              </nav>
              {!user && (
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <Link to="/login" className="w-full py-3 text-center font-bold text-slate-900" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  <Link to="/signup" className="w-full py-4 bg-blue-600 text-white text-center rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


export default Navbar;
