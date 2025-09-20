import React from 'react';

const SubmissionsTable = ({ submissions }) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-slate-700/50 rounded-2xl flex items-center justify-center shadow-soft">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">No submissions yet</h3>
        <p className="text-slate-400 text-sm mb-6">Be the first to showcase your innovative project to the community.</p>
        <div className="inline-flex items-center px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-300 text-sm">
          <div className="w-2 h-2 bg-brand-400 rounded-full mr-2 animate-subtle-pulse"></div>
          Waiting for submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
      {submissions.map((submission, index) => (
        <div 
          key={submission._id || index} 
          className="card-elevated rounded-xl p-6 hover-professional animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-brand">
                  <span className="text-white font-bold text-lg">
                    {submission.teamName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-400 rounded-full border-2 border-slate-800">
                  <div className="w-full h-full bg-success-300 rounded-full animate-subtle-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-100 truncate">
                    {submission.teamName}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1 bg-success-500/10 text-success-300 text-xs font-medium rounded-full border border-success-500/20">
                    <div className="w-1.5 h-1.5 bg-success-400 rounded-full mr-2"></div>
                    Submitted
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Project successfully submitted to showcase
                </p>
                
                 <div className="flex flex-wrap gap-3 mt-3">
                   {submission.deploymentLink && (
                     <a 
                       href={submission.deploymentLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-sm text-success-400 hover:text-success-300 transition-colors duration-200 font-medium rounded-lg border border-slate-600/50"
                     >
                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                       Live Demo
                       <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                     </a>
                   )}
                   
                   {submission.githubLink && (
                     <a 
                       href={submission.githubLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200 font-medium rounded-lg border border-slate-600/50"
                     >
                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                       </svg>
                       GitHub
                       <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                     </a>
                   )}
                   
                   {submission.driveLink && (
                     <a 
                       href={submission.driveLink} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-sm text-accent-400 hover:text-accent-300 transition-colors duration-200 font-medium rounded-lg border border-slate-600/50"
                     >
                       <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748L12.545 10.239z"/>
                       </svg>
                       Project Files
                       <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                       </svg>
                     </a>
                   )}
                 </div>
                
                {/* Show solution preview */}
                {submission.solution && (
                  <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {submission.solution.length > 150 
                        ? `${submission.solution.substring(0, 150)}...` 
                        : submission.solution
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionsTable;
