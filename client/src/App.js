import React, { useState, useEffect } from 'react';
import SubmissionForm from './components/SubmissionForm';
import SubmissionsTable from './components/SubmissionsTable';

// Apply dark mode to document
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/submissions`);
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.data);
      } else {
        setError('Failed to fetch submissions');
      }
    } catch (err) {
      setError('Error fetching submissions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmissionSuccess = () => {
    fetchSubmissions(); // Refresh the submissions list
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle accent circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-500/8 rounded-full filter blur-2xl"></div>
        
        {/* Professional grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Professional Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-brand-gradient mb-4 tracking-tight">
              Niman2.0 2025
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-500 to-brand-600 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-xl text-slate-300 mb-8 font-medium leading-relaxed max-w-3xl mx-auto">
            Welcome to the premier platform for showcasing innovative projects. 
            Share your work with the developer community and discover cutting-edge solutions.
          </p>
          
          <div className="inline-flex items-center px-6 py-3 card-professional rounded-full text-slate-200 text-sm font-medium shadow-soft hover-professional">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-400 rounded-full mr-3 animate-subtle-pulse"></div>
              <span className="mr-2">Powered by</span>
              <span className="font-semibold text-accent-gradient">Revamp</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Submission Form */}
          <div className="card-professional rounded-2xl p-8 hover-professional animate-slide-up">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mr-4 shadow-brand">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-1">
                  Submit Your Project
                </h2>
                <p className="text-sm text-slate-400">Share your innovation with the community</p>
              </div>
            </div>
            <SubmissionForm onSubmissionSuccess={handleSubmissionSuccess} />
          </div>

          {/* Submissions Display */}
          <div className="card-professional rounded-2xl p-8 hover-professional animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-success-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-1">
                  Project Submissions
                </h2>
                <p className="text-sm text-slate-400">Explore community innovations</p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-slate-600 border-t-brand-500"></div>
                </div>
                <p className="text-slate-400 text-sm">Loading submissions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center px-6 py-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-danger-300 shadow-soft">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            ) : (
              <SubmissionsTable submissions={submissions} />
            )}
          </div>
        </div>
        
        {/* Professional Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-slate-700/50">
          <p className="text-slate-400 text-sm">
            © 2025 Niman2.0 Platform. Built with passion for innovation.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
