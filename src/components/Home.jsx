import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogSection from './Home/BlogSection';
import Navbar from './Navbar';
import { getBackendBaseUrl } from '../utils/backendBaseUrl';

const Home = () => {
  const { user, getDashboardRoute } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await fetch(`${getBackendBaseUrl()}/api/jobs/api`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Premium Freelance Marketplace</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Hire the top 1% <br />
                <span className="text-blue-600">Expert Talent</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect with the world's most talented developers, designers, and thinkers to build your next big thing.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start">
                <Link to="/login?role=Employer" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                  Post a Project
                </Link>
                <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                  Find Work
                </Link>
              </div>

            </div>

            {/* Right Image */}
            <div className="relative animate-scale-in w-full max-w-[750px] lg:justify-self-end">
              <img 
                src="/assets/home/Freelancer-bro.svg" 
                alt="Freelancer working illustration" 
                className="w-full h-[360px] sm:h-[420px] lg:h-[620px] xl:h-[680px] object-contain lg:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 lg:py-24 bg-[#0B0F19] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/20 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { label: 'Active Talent', value: '10K+' },
              { label: 'Projects Completed', value: '5K+' },
              { label: 'Success Rate', value: '99%' },
              { label: 'Avg. Rating', value: '4.9/5' }
            ].map((stat, i) => (
              <div key={i} className="text-center flex flex-col items-center justify-center">
                <div className="text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold text-blue-200/70 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Built for scale. Designed for trust.</h2>
            <p className="text-slate-600">Every tool you need to manage your freelance workforce effectively.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'fa-shield-halved', title: 'Secure Escrow', desc: 'Payments are held safely until you approve the work.' },
              { icon: 'fa-bolt-lightning', title: 'Fast Hiring', desc: 'Get qualified applicants within hours, not weeks.' },
              { icon: 'fa-award', title: 'Skill Badges', desc: 'Verified skills through our platform assessment system.' },
              { icon: 'fa-comment-dots', title: 'Real-time Chat', desc: 'Built-in communication tools with file sharing.' },
              { icon: 'fa-chart-pie', title: 'Rich Analytics', desc: 'Track your earnings and project progress in one place.' },
              { icon: 'fa-headset', title: 'Expert Support', desc: '24/7 dedicated support team ready to help.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className={`fas ${feature.icon} text-sm`}></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-24 space-y-32 bg-white">
        {/* For Freelancers */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 mb-6">
                <i className="fas fa-briefcase text-[10px]"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">For Freelancers</span>
              </div>
              <h3 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Find Your Dream Projects</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Browse thousands of job listings from top Indian companies and startups. Our smart matching algorithm helps you find projects that perfectly match your skills and experience.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Access to 5000+ active job listings',
                  'AI-powered job recommendations',
                  'Apply with one click using your profile'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[10px] text-emerald-600"></i>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/jobs" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                Browse Jobs <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-50 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <img src="/assets/home/Online resume-cuate.svg" alt="Find Jobs" className="relative w-full max-w-md mx-auto drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* For Employers */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-50 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <img src="/assets/home/oversight-bro.svg" alt="Post Jobs" className="relative w-full max-w-md mx-auto drop-shadow-2xl" />
              </div>
            </div>
            <div className="order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 mb-6">
                <i className="fas fa-building text-[10px]"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">For Employers</span>
              </div>
              <h3 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Hire Top Talent Easily</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Post your job requirements and get matched with qualified freelancers instantly. Review portfolios, compare rates, and hire the perfect candidate for your project.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Post unlimited job listings',
                  'Get applications within 24 hours',
                  'Verified freelancers with ratings & reviews'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[10px] text-emerald-600"></i>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                Post a Job <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Secure Platform */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mb-6">
                <i className="fas fa-shield-alt text-[10px]"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Platform</span>
              </div>
              <h3 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Safe & Secure Payments</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our milestone-based payment system ensures that funds are released only when you're satisfied with the work. Enjoy peace of mind with our secure escrow protection.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Escrow protection on all payments',
                  'Milestone-based payment releases',
                  'UPI, Net Banking & Card payments supported'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check text-[10px] text-emerald-600"></i>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                Get Started
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-emerald-50 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <img src="/assets/home/Mobile Marketing-bro.svg" alt="Secure Payments" className="relative w-full max-w-md mx-auto drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[#0B0F19] border-y border-slate-800/80 mt-12">
        {/* Elegant glowing background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Join the Community</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            Ready to build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-300">something great?</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join Milestone today and connect with thousands of experts ready to bring your vision to life in the new freelance economy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all duration-300">
              Get Started for Free
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 backdrop-blur-md transition-all duration-300">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
            <div>
              <Link to="/" className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold tracking-tight">Milestone</span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">Elevating the freelance economy through trust and top-tier talent.</p>
            </div>
            
            {['For Talent', 'For Business', 'Company'].map((title, i) => (
              <div key={i}>
                <h4 className="font-bold text-slate-900 mb-6 uppercase text-[10px] tracking-widest">{title}</h4>
                <ul className="space-y-4 text-xs font-semibold text-slate-500">
                  <li><Link to="/jobs" className="hover:text-blue-600">Browse Jobs</Link></li>
                  <li><Link to="/blogs" className="hover:text-blue-600">Resources</Link></li>
                  <li><Link to="/signup" className="hover:text-blue-600">Join Platform</Link></li>
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <p>© 2026 Milestone Inc.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-900">Privacy</a>
              <a href="#" className="hover:text-slate-900">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;