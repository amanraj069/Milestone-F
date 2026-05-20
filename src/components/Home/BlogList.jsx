import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { fetchAllBlogs, fetchFeaturedBlog } from '../../redux/slices/blogSlice';
import Footer from './Footer';
import Navbar from '../Navbar';
import SolrSearchBar from '../search/SolrSearchBar';

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, getDashboardRoute } = useAuth();
  const { blogs: allBlogs, featuredBlog, loading } = useSelector((state) => state.blog);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef(null);
  const resultsRef = useRef(null);

  // Auto-scroll to results when searching
  useEffect(() => {
    if (searchTerm.trim() && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }, [searchTerm]);

  const categories = [
    'All',
    'Freelancing Tips',
    'Career Advice',
    'Productivity',
    'Success Stories',
    'Tools & Resources',
    'Industry News',
    'Remote Work',
    'Client Management',
    'Finance for Freelancers'
  ];

  useEffect(() => {
    dispatch(fetchFeaturedBlog());
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const recentBlogs = allBlogs
    .filter(blog => blog.blogId !== featuredBlog?.blogId)
    .slice(0, 6);

  let filteredBlogs = activeCategory === 'All'
    ? allBlogs
    : allBlogs.filter(blog => blog.category === activeCategory);

  // Apply search filter
  if (searchTerm.trim()) {
    const search = searchTerm.toLowerCase();
    filteredBlogs = filteredBlogs.filter(blog =>
      blog.title.toLowerCase().includes(search) ||
      blog.tagline.toLowerCase().includes(search) ||
      blog.category.toLowerCase().includes(search)
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCategoryStyles = (category) => {
    const map = {
      'Productivity': 'bg-blue-50 text-blue-700 border-blue-100',
      'Freelancing Tips': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Career Advice': 'bg-blue-50 text-blue-700 border-blue-100',
      'Success Stories': 'bg-amber-50 text-amber-700 border-amber-100',
      'Tools & Resources': 'bg-rose-50 text-rose-700 border-rose-100',
      'Industry News': 'bg-slate-100 text-slate-700 border-slate-200',
      'Remote Work': 'bg-cyan-50 text-cyan-700 border-cyan-100',
      'Client Management': 'bg-blue-50 text-blue-700 border-blue-100',
      'Finance for Freelancers': 'bg-teal-50 text-teal-700 border-teal-100'
    };
    return map[category] || 'bg-navy-50 text-navy-700 border-navy-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-navy-100 selection:text-navy-900">
      <Navbar 
        forceSolid={true}
        searchBar={
          <SolrSearchBar
            query={searchTerm}
            onQueryChange={setSearchTerm}
            type="blogs"
            hideToggle={true}
            onSearch={(query) => {
              if (query.trim()) {
                navigate(`/search?q=${encodeURIComponent(query)}&type=blogs`);
              }
            }}
          />
        }
      />

      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 mb-6">
              <span className="text-[10px] font-bold text-navy-900 uppercase tracking-widest">Platform Resources</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold font-heading text-slate-900 tracking-tight leading-tight mb-6">
              The <span className="text-navy-600">Milestone</span> Blog
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Insights, stories, and expert tips to help you scale your business and career in the freelance economy.
            </p>
          </div>
        </section>

        {/* Featured Blog */}
        {featuredBlog && (
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-bold font-heading text-slate-900">Editor's Choice</h2>
                <div className="h-px flex-1 bg-slate-100 mx-8"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Featured Post</span>
              </div>

              <Link to={`/blogs/${featuredBlog.blogId}`} className="group block">
                <div className="grid lg:grid-cols-2 gap-0 bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 group-hover:shadow-2xl group-hover:border-navy-100 transition-all duration-500">
                  <div className="relative h-96 lg:h-full overflow-hidden">
                    <img
                      src={featuredBlog.imageUrl}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute top-8 left-8">
                      <span className={`backdrop-blur-md px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl ${getCategoryStyles(featuredBlog.category)}`}>
                        {featuredBlog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-12 lg:p-20 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-2">
                        <i className="far fa-calendar"></i>
                        {formatDate(featuredBlog.createdAt)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-2">
                        <i className="far fa-clock"></i>
                        {featuredBlog.readTime} min read
                      </span>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-bold font-heading text-slate-900 mb-6 group-hover:text-navy-600 transition-colors leading-tight">
                      {featuredBlog.title}
                    </h3>

                    <p className="text-slate-600 mb-10 text-lg leading-relaxed line-clamp-3">
                      {featuredBlog.tagline}
                    </p>

                    <div className="flex items-center gap-4 pt-8 border-t border-slate-200/50">
                      <div className="w-12 h-12 bg-navy-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-navy-600/20">
                        {featuredBlog.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{featuredBlog.author}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Contributor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section ref={resultsRef} className="py-24 bg-slate-50 border-y border-slate-100 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-12 text-center">Explore Topics</h2>

            {/* Scrollable Categories Container */}
            <div className="relative mb-20 group">
              {/* Left Arrow */}
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 hover:text-navy-600 transition-all opacity-0 group-hover:opacity-100 -translate-x-6 hover:-translate-x-7 active:scale-95"
              >
                <i className="fas fa-chevron-left text-sm"></i>
              </button>

              {/* Categories Scroll Area */}
              <div 
                ref={scrollContainerRef}
                className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth px-2 py-4"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === category
                        ? 'bg-navy-600 text-white shadow-xl shadow-navy-600/20 border-transparent'
                        : 'bg-white text-slate-500 border border-slate-100 hover:border-navy-600 hover:text-navy-600'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 hover:text-navy-600 transition-all opacity-0 group-hover:opacity-100 translate-x-6 hover:translate-x-7 active:scale-95"
              >
                <i className="fas fa-chevron-right text-sm"></i>
              </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Link
                  key={blog.blogId}
                  to={`/blogs/${blog.blogId}`}
                  className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-navy-100 transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className={`backdrop-blur-md px-3 py-1.5 border rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm ${getCategoryStyles(blog.category)}`}>
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      <span>{formatDate(blog.createdAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{blog.readTime} min read</span>
                    </div>

                    <h3 className="text-xl font-bold font-heading text-slate-900 mb-4 group-hover:text-navy-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">
                      {blog.tagline}
                    </p>

                    <div className="mt-auto flex items-center gap-3 pt-6 border-t border-slate-50">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-navy-600 font-bold text-xs">
                        {blog.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="text-xs font-bold text-slate-700">{blog.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100">
                <i className="fas fa-search text-3xl text-slate-200 mb-4 block"></i>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No articles found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default BlogList;
