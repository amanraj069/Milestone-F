import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { fetchBlogById, fetchRecentBlogs, fetchFeaturedBlog, clearCurrentBlog } from '../../redux/slices/blogSlice';
import Footer from './Footer';
import Navbar from '../Navbar';

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, getDashboardRoute } = useAuth();
  const { currentBlog: blog, recentBlogs, featuredBlog, fetchingCurrent: loading } = useSelector((state) => state.blog);
  const [searchTerm, setSearchTerm] = useState('');
  const [comment, setComment] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [comments, setComments] = useState([]);
  const [hasResolvedCurrentBlog, setHasResolvedCurrentBlog] = useState(false);

  useEffect(() => {
    setHasResolvedCurrentBlog(false);
    const currentBlogPromise = dispatch(fetchBlogById(blogId));
    dispatch(fetchRecentBlogs(blogId));
    dispatch(fetchFeaturedBlog());

    Promise.resolve(currentBlogPromise).finally(() => {
      setHasResolvedCurrentBlog(true);
    });

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, blogId]);

  useEffect(() => {
    if (hasResolvedCurrentBlog && blog === null && !loading) {
      navigate('/blogs');
    }
  }, [blog, loading, hasResolvedCurrentBlog, navigate]);

  const handleCommentChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      ...comment,
      id: Date.now(),
      date: new Date().toISOString(),
      blogId: blogId
    };
    setComments([newComment, ...comments]);
    setComment({ name: '', email: '', message: '' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryStyles = (category) => {
    const map = {
      'Productivity': 'bg-purple-50 text-purple-700 border-purple-100',
      'Freelancing Tips': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Career Advice': 'bg-blue-50 text-blue-700 border-blue-100',
      'Success Stories': 'bg-amber-50 text-amber-700 border-amber-100',
      'Tools & Resources': 'bg-rose-50 text-rose-700 border-rose-100',
      'Industry News': 'bg-slate-100 text-slate-700 border-slate-200',
      'Remote Work': 'bg-cyan-50 text-cyan-700 border-cyan-100',
      'Client Management': 'bg-indigo-50 text-indigo-700 border-indigo-100',
      'Finance for Freelancers': 'bg-teal-50 text-teal-700 border-teal-100'
    };
    return map[category] || 'bg-navy-50 text-navy-700 border-navy-100';
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog?.title || '';

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Blog not found</h2>
          <Link to="/blogs" className="text-navy-600 font-bold hover:underline">
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-navy-100 selection:text-navy-900">
      <Navbar forceSolid={true} />

      <div className="pt-24">
        {/* Hero Section */}
        <article className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {/* Category and Featured Badge */}
            <div className="flex items-center gap-3 mb-8">
              <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getCategoryStyles(blog.category)}`}>
                {blog.category}
              </span>
              {blog.featured && (
                <span className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-amber-100 flex items-center gap-2">
                  <i className="fas fa-star text-[10px]"></i>
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-slate-900 mb-8 leading-[1.1] tracking-tight">
              {blog.title}
            </h1>

            {/* Tagline */}
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              {blog.tagline}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-slate-100 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-navy-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-navy-600/20">
                  {blog.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{blog.author}</p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span>{blog.readTime} min read</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span>{blog.views || 0} views</span>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Share</span>
                {[
                  { id: 'twitter', icon: 'fa-twitter' },
                  { id: 'facebook', icon: 'fa-facebook-f' },
                  { id: 'linkedin', icon: 'fa-linkedin-in' }
                ].map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => handleShare(platform.id)}
                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 hover:bg-navy-600 hover:text-white hover:shadow-lg hover:shadow-navy-600/20 transition-all"
                  >
                    <i className={`fab ${platform.icon} text-sm`}></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto"
              />
            </div>

            {/* Blog Content */}
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-slate-600 prose-img:rounded-3xl">
              {blog.content.map((section, index) => (
                <div key={index} className="mb-12">
                  <h2 className="text-2xl lg:text-3xl text-slate-900 mb-6">
                    {section.heading}
                  </h2>
                  <p className="whitespace-pre-line">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-16 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tagged in:</span>
                <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${getCategoryStyles(blog.category)}`}>
                  {blog.category}
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold font-heading text-slate-900">Discussion</h2>
              <div className="px-4 py-1 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-500">
                {comments.length} Comments
              </div>
            </div>

            <form onSubmit={handleCommentSubmit} className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/40 mb-16">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={comment.name}
                    onChange={handleCommentChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-navy-600/5 focus:bg-white outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={comment.email}
                    onChange={handleCommentChange}
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-navy-600/5 focus:bg-white outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Comment</label>
                <textarea
                  name="message"
                  value={comment.message}
                  onChange={handleCommentChange}
                  required
                  rows="5"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-navy-600/5 focus:bg-white outline-none transition-all resize-none"
                  placeholder="What are your thoughts?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-10 py-4 bg-navy-600 text-white rounded-2xl font-bold hover:bg-navy-700 hover:shadow-xl hover:shadow-navy-600/20 transition-all"
              >
                Post Comment
              </button>
            </form>

            {/* Comments Display */}
            <div className="space-y-8">
              {comments.map((c) => (
                <div key={c.id} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-navy-600 font-bold text-xs flex-shrink-0 border border-slate-100">
                      {c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        <h4 className="font-bold text-slate-900">{c.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{c.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {(recentBlogs.length > 0 || featuredBlog) && (
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-3xl font-bold font-heading text-slate-900 mb-16 text-center">More from the blog</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Featured Blog */}
                {featuredBlog && (
                  <Link
                    to={`/blogs/${featuredBlog.blogId}`}
                    className="group flex flex-col"
                  >
                    <div className="relative h-64 rounded-[2rem] overflow-hidden border border-slate-100 mb-6">
                      <img
                        src={featuredBlog.imageUrl}
                        alt={featuredBlog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6">
                        <span className={`backdrop-blur-md px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${getCategoryStyles(featuredBlog.category)}`}>
                          {featuredBlog.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 mb-3 group-hover:text-navy-600 transition-colors line-clamp-2">{featuredBlog.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{formatDate(featuredBlog.createdAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span>{featuredBlog.readTime} min read</span>
                    </div>
                  </Link>
                )}

                {/* Recent Blogs */}
                {recentBlogs.slice(0, 2).map((recentBlog) => (
                  <Link
                    key={recentBlog.blogId}
                    to={`/blogs/${recentBlog.blogId}`}
                    className="group flex flex-col"
                  >
                    <div className="relative h-64 rounded-[2rem] overflow-hidden border border-slate-100 mb-6">
                      <img
                        src={recentBlog.imageUrl}
                        alt={recentBlog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 left-6">
                        <span className={`backdrop-blur-md px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${getCategoryStyles(recentBlog.category)}`}>
                          {recentBlog.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 mb-3 group-hover:text-navy-600 transition-colors line-clamp-2">{recentBlog.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{formatDate(recentBlog.createdAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span>{recentBlog.readTime} min read</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default BlogDetail;
