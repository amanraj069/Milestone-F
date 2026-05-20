import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestBlogs } from '../../redux/slices/blogSlice';

const BlogSection = () => {
  const dispatch = useDispatch();
  const { latestBlogs: blogs, fetchingLatest: loading } = useSelector((state) => state.blog);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchLatestBlogs());
  }, [dispatch]);

  const handleNext = () => {
    if (currentIndex + 3 < blogs.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleBlogs = blogs.slice(currentIndex, currentIndex + 3);
  const showPrev = currentIndex > 0;
  const showNext = currentIndex + 3 < blogs.length;

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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading insights...</p>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white" id="blog">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl text-center md:text-left">
            <span className="text-navy-600 font-bold tracking-widest uppercase text-xs">Resources</span>
            <h2 className="text-4xl lg:text-5xl font-bold mt-4 text-slate-900 tracking-tight">
              Latest <span className="text-navy-600">Insights</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">Expert advice on scaling your freelance career and finding the best talent.</p>
          </div>
          <Link to="/blogs" className="hidden md:flex text-sm font-bold text-navy-600 hover:text-navy-700 transition-colors items-center gap-2">
            Read all posts <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>

        <div className="flex justify-center mb-12">
          <div className={`grid gap-8 w-full ${
            visibleBlogs.length === 1 
              ? 'grid-cols-1 max-w-md' 
              : visibleBlogs.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {visibleBlogs.map((blog) => (
              <Link
                key={blog.blogId}
                to={`/blogs/${blog.blogId}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:border-navy-100 transition-all duration-500 block no-underline"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    onError={(e) => {
                      e.target.src = '/assets/blog-default.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 backdrop-blur-md border rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm ${getCategoryStyles(blog.category)}`}>
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-navy-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {blog.tagline}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <span className="text-xs font-bold text-navy-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read more <i className="fas fa-chevron-right text-[8px]"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          {(showPrev || showNext) && (
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={!showPrev}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  showPrev 
                    ? 'border-slate-200 text-slate-600 hover:bg-navy-600 hover:text-white hover:border-navy-600' 
                    : 'border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(blogs.length / 3) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx * 3)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      Math.floor(currentIndex / 3) === idx ? 'bg-navy-600 w-6' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!showNext}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  showNext 
                    ? 'border-slate-200 text-slate-600 hover:bg-navy-600 hover:text-white hover:border-navy-600' 
                    : 'border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
          
          <Link to="/blogs" className="md:hidden w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-center">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
