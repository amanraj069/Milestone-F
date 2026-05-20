import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Footer from '../../components/Home/Footer';
import Navbar from '../../components/Navbar';
import { getBackendBaseUrl } from '../../utils/backendBaseUrl';
import SolrSearchBar from '../../components/search/SolrSearchBar';

const PublicJobListing = () => {
  const auth = useAuth();
  const user = auth?.user;
  const getDashboardRoute = auth?.getDashboardRoute;
  const apiBaseUrl = getBackendBaseUrl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const resultsRef = useRef(null);

  // Auto-scroll to results when searching
  useEffect(() => {
    if (searchTerm.trim() && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchTerm]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter states
  const [sortBy, setSortBy] = useState('date');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const pageSize = 10;

  const normalizeText = (value) => String(value || '').trim().toLowerCase();

  // Debounce search term change
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search params from URL on initial load
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
      setDebouncedSearchTerm(searchQuery);
    }
  }, [searchParams]);

  // Load jobs whenever page or search changes
  useEffect(() => {
    loadJobs(currentPage);
  }, [currentPage, debouncedSearchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  // Apply filters whenever jobs or filter states change
  useEffect(() => {
    applyFiltersAndSort();
  }, [jobs, sortBy, selectedExperience, selectedSkills, selectedJobType, isRemote, locationFilter]);

  const loadJobs = async (page = 1) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page,
        limit: pageSize,
        q: debouncedSearchTerm,
      });

      const response = await fetch(`${apiBaseUrl}/api/jobs/api?${queryParams.toString()}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        const jobList = Array.isArray(data.jobs) ? data.jobs : [];
        setJobs(jobList);
        setPagination(data.pagination || {
          page,
          limit: pageSize,
          total: jobList.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        });
        
        // Extract unique skills from all jobs
        const skillsSet = new Set();
        jobList.forEach(job => {
          if (job.description && job.description.skills) {
            job.description.skills.forEach(skill => {
              skillsSet.add(skill);
            });
          }
        });
        // Convert to array and sort alphabetically
        setAvailableSkills(Array.from(skillsSet).sort());
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const isNewJob = (postedDate) => {
    const now = new Date();
    const posted = new Date(postedDate);
    const hoursDiff = (now - posted) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  const getDaysAgo = (postedDate) => {
    const now = new Date();
    const posted = new Date(postedDate);
    const daysDiff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Posted Today';
    if (daysDiff === 1) return '1 Day Ago';
    return `${daysDiff} Days Ago`;
  };

  const applyFiltersAndSort = () => {
    let filtered = [...jobs];

    // Apply experience filter
    if (selectedExperience) {
      filtered = filtered.filter(job =>
        normalizeText(job.experienceLevel) === normalizeText(selectedExperience)
      );
    }

    // Apply job type filter
    if (selectedJobType) {
      filtered = filtered.filter(job =>
        job.jobType === selectedJobType
      );
    }

    // Apply remote filter
    if (isRemote) {
      filtered = filtered.filter(job => job.remote);
    }

    // Apply location filter
    if (locationFilter.trim()) {
      const search = normalizeText(locationFilter);
      filtered = filtered.filter(job =>
        normalizeText(job.location).includes(search)
      );
    }

    // Apply skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(job =>
        selectedSkills.every(skill =>
          job.description.skills.some(jobSkill =>
            jobSkill.toLowerCase() === skill.toLowerCase()
          )
        )
      );
    }

    // Sort results (Tiers first, then user preference)
    filtered.sort((a, b) => {
      const tierA = a.tier || (a.isSponsored && a.isBoosted ? 4 : a.isBoosted ? 3 : a.isSponsored ? 2 : 1);
      const tierB = b.tier || (b.isSponsored && b.isBoosted ? 4 : b.isBoosted ? 3 : b.isSponsored ? 2 : 1);

      if (tierB !== tierA) return tierB - tierA;
      
      switch (sortBy) {
        case 'salary-desc':
          return b.budget.amount - a.budget.amount;
        case 'salary-asc':
          return a.budget.amount - b.budget.amount;
        case 'date':
        default:
          return new Date(b.postedDate) - new Date(a.postedDate);
      }
    });

    setFilteredJobs(filtered);
  };

  const goToPage = (page) => {
    if (loading) return;
    if (page < 1 || page > (pagination?.totalPages || 1) || page === currentPage) {
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const totalPages = pagination?.totalPages || 1;
    const page = pagination?.page || currentPage;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        forceSolid={true}
        searchBar={
          <SolrSearchBar 
            query={searchTerm}
            onQueryChange={setSearchTerm}
            type="jobs"
            hideToggle={true}
            onSearch={() => {}}
          />
        }
      />

      {/* Main Content */}
      <main ref={resultsRef} className="pt-28 pb-20 min-h-screen scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6 mt-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <i className="fas fa-filter text-blue-600"></i>
              {mobileMenuOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-80 flex-shrink-0 transition-all ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="rounded-[2rem] border border-slate-200 p-8 sticky top-28 bg-white shadow-xl shadow-slate-200/40">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold font-heading text-slate-900">Filters</h2>
                  <button 
                    onClick={() => {
                      setSortBy('date');
                      setSelectedExperience('');
                      setSelectedJobType('');
                      setIsRemote(false);
                      setLocationFilter('');
                      setSelectedSkills([]);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                </div>

                {/* Sort Section */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="date">Newest First</option>
                    <option value="salary-desc">Highest Salary</option>
                    <option value="salary-asc">Lowest Salary</option>
                  </select>
                </div>

                {/* Job Type Section */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Job Type</h3>
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                {/* Experience Level Section */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h3>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:bg-white outline-none transition-all cursor-pointer"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Expert">Expert Level</option>
                  </select>
                </div>

                {/* Location Section */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Location</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="City or Country"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 focus:bg-white outline-none transition-all"
                    />
                    <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  </div>
                </div>

                {/* Remote Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-home text-blue-600 text-xs"></i>
                    <span className="text-sm font-bold text-slate-700">Remote Only</span>
                  </div>
                  <button 
                    onClick={() => setIsRemote(!isRemote)}
                    className={`w-10 h-5 rounded-full transition-all relative ${isRemote ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isRemote ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </aside>

            {/* Job Listings */}
            <section className="flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-100">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading amazing opportunities...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-24 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm px-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-search text-3xl text-slate-300"></i>
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-2 text-slate-900">
                    No matching jobs found
                  </h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Try adjusting your filters or searching for something different.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8 px-2">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                      Found <span className="text-blue-600">{pagination.total}</span> Jobs
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.jobId}
                        className="group relative rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 bg-white"
                      >
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                          
                          {/* Company Logo */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={job.imageUrl}
                                alt={job.title}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-500"
                              />
                              {job.tier > 1 && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                  <i className="fas fa-crown text-[10px] text-white"></i>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Job Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="min-w-0">
                                <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                                  {job.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  <span>{job.jobType}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span>{job.experienceLevel}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-slate-900">
                                  ₹{job.budget.amount.toLocaleString()}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  per {job.budget.period}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {job.description.skills.slice(0, 4).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100 group-hover:border-blue-100 transition-all"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.description.skills.length > 4 && (
                                <span className="px-3 py-1.5 text-[10px] font-bold text-slate-400">
                                  +{job.description.skills.length - 4} more
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
                              <div className="flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                  <i className="fas fa-map-marker-alt text-blue-600"></i>
                                  {job.location}
                                </span>
                                {job.remote && (
                                  <span className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">
                                    <i className="fas fa-laptop-house"></i>
                                    Remote
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {getDaysAgo(job.postedDate)}
                                </span>
                                <Link
                                  to={`/jobs/${job.jobId}`}
                                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 transition-all"
                                >
                                  Apply Now
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className={`mt-16 ${pagination?.totalPages <= 1 ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => goToPage(pagination.page - 1)}
                          disabled={loading || !pagination?.hasPrevPage}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 transition-all"
                        >
                          <i className="fas fa-arrow-left text-xs"></i>
                        </button>

                        <div className="flex items-center gap-2">
                          {getPageNumbers().map((item, index) => {
                            if (item === '...') return <span key={index} className="text-slate-300 mx-2">...</span>;
                            const isActive = item === pagination.page;
                            return (
                              <button
                                key={item}
                                onClick={() => goToPage(item)}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-bold transition-all ${
                                  isActive
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
                                    : 'bg-white border border-slate-100 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                                }`}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => goToPage(pagination.page + 1)}
                          disabled={loading || !pagination?.hasNextPage}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 transition-all"
                        >
                          <i className="fas fa-arrow-right text-xs"></i>
                        </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicJobListing;
