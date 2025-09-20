import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SubmissionForm = ({ onSubmissionSuccess }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    githubLink: '',
    deploymentLink: '',
    zipFile: null,
    solution: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'zipFile') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    } else if (formData.teamName.trim().length > 100) {
      newErrors.teamName = 'Team name must be less than 100 characters';
    }

    if (!formData.githubLink.trim()) {
      newErrors.githubLink = 'GitHub link is required';
    } else {
      try {
        new URL(formData.githubLink);
        if (!formData.githubLink.includes('github.com')) {
          newErrors.githubLink = 'Please enter a valid GitHub repository URL';
        }
      } catch {
        newErrors.githubLink = 'Please enter a valid URL';
      }
    }

    // Validate deployment link (required)
    if (!formData.deploymentLink.trim()) {
      newErrors.deploymentLink = 'Deployment link is required';
    } else {
      try {
        new URL(formData.deploymentLink);
      } catch {
        newErrors.deploymentLink = 'Please enter a valid deployment URL';
      }
    }

    // Validate zip file (required)
    if (!formData.zipFile) {
      newErrors.zipFile = 'Project files upload is required';
    } else {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (formData.zipFile.size > maxSize) {
        newErrors.zipFile = 'File size must be less than 50MB';
      }
      if (!formData.zipFile.name.toLowerCase().endsWith('.zip')) {
        newErrors.zipFile = 'Please upload a .zip file';
      }
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution/Description is required';
    } else if (formData.solution.trim().length < 10) {
      newErrors.solution = 'Solution must be at least 10 characters long';
    } else if (formData.solution.trim().length > 2000) {
      newErrors.solution = 'Solution must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('teamName', formData.teamName);
      formDataToSend.append('githubLink', formData.githubLink);
      formDataToSend.append('deploymentLink', formData.deploymentLink);
      formDataToSend.append('solution', formData.solution);
      
      if (formData.zipFile) {
        formDataToSend.append('zipFile', formData.zipFile);
      }

      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage('Project submitted successfully!');
        setFormData({ teamName: '', githubLink: '', deploymentLink: '', zipFile: null, solution: '' });
        onSubmissionSuccess();
      } else {
        setSubmitMessage(data.message || 'Failed to submit project');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error submitting project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team Name */}
      <div className="group">
        <label htmlFor="teamName" className="block text-sm font-semibold text-slate-200 mb-3 group-focus-within:text-brand-400 transition-colors">
          Team Name *
        </label>
        <div className="relative">
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg shadow-soft focus:outline-none transition-all duration-300 bg-slate-800/50 text-slate-100 placeholder-slate-400 ${
              errors.teamName 
                ? 'border-danger-400 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20' 
                : 'border-slate-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-slate-500'
            }`}
            placeholder="Enter your team name"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        {errors.teamName && (
          <p className="mt-2 text-sm text-danger-400 flex items-center animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.teamName}
          </p>
        )}
      </div>

      {/* GitHub Link */}
      <div className="group">
        <label htmlFor="githubLink" className="block text-sm font-semibold text-slate-200 mb-3 group-focus-within:text-brand-400 transition-colors">
          GitHub Repository Link *
        </label>
        <div className="relative">
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleChange}
            className={`w-full px-4 py-3 pl-12 border rounded-lg shadow-soft focus:outline-none transition-all duration-300 bg-slate-800/50 text-slate-100 placeholder-slate-400 ${
              errors.githubLink 
                ? 'border-danger-400 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20' 
                : 'border-slate-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-slate-500'
            }`}
            placeholder="https://github.com/username/repository"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
        </div>
        {errors.githubLink && (
          <p className="mt-2 text-sm text-danger-400 flex items-center animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.githubLink}
          </p>
        )}
      </div>

      {/* Deployment Link */}
      <div className="group">
        <label htmlFor="deploymentLink" className="block text-sm font-semibold text-slate-200 mb-3 group-focus-within:text-brand-400 transition-colors">
          Deployment Link *
        </label>
        <div className="relative">
          <input
            type="url"
            id="deploymentLink"
            name="deploymentLink"
            value={formData.deploymentLink}
            onChange={handleChange}
            className={`w-full px-4 py-3 pl-12 border rounded-lg shadow-soft focus:outline-none transition-all duration-300 bg-slate-800/50 text-slate-100 placeholder-slate-400 ${
              errors.deploymentLink 
                ? 'border-danger-400 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20' 
                : 'border-slate-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-slate-500'
            }`}
            placeholder="https://your-project.vercel.app or https://your-project.netlify.app"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
        {errors.deploymentLink && (
          <p className="mt-2 text-sm text-danger-400 flex items-center animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.deploymentLink}
          </p>
        )}
      </div>
      {errors.deploymentLink && (
        <p className="mt-2 text-sm text-danger-400 flex items-center animate-fade-in">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.deploymentLink}
        </p>
      )}
      <p className="mt-1 text-xs text-slate-400">
        Share your live project URL (Vercel, Netlify, Heroku, etc.) - Required
      </p>

      {/* Zip File Upload */}
      <div className="group mt-6">
        <label htmlFor="zipFile" className="block text-sm font-semibold text-slate-200 mb-3 group-focus-within:text-brand-400 transition-colors">
          Project Files *
        </label>
        <div className="relative">
          <input
            type="file"
            id="zipFile"
            name="zipFile"
            accept=".zip"
            onChange={handleChange}
            className={`w-full px-4 py-3 pl-12 border rounded-lg shadow-soft focus:outline-none transition-all duration-300 bg-slate-800/50 text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-500/20 file:text-brand-300 hover:file:bg-brand-500/30 file:cursor-pointer cursor-pointer ${
              errors.zipFile 
                ? 'border-danger-400 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20' 
                : 'border-slate-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-slate-500'
            }`}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
        </div>
        {errors.zipFile && (
          <p className="mt-2 text-sm text-danger-400 flex items-center animate-fade-in">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.zipFile}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          Upload your project files as a .zip archive (max 50MB) - Required
        </p>
        {formData.zipFile && (
          <div className="mt-2 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-brand-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-slate-300 font-medium">
                {formData.zipFile.name}
              </span>
              <span className="text-xs text-slate-400 ml-2">
                ({(formData.zipFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Solution/Description */}
      <div className="group mt-6">
        <label htmlFor="solution" className="block text-sm font-semibold text-slate-200 mb-3 group-focus-within:text-brand-400 transition-colors">
          Project Description *
        </label>
        <div className="relative">
          <textarea
            id="solution"
            name="solution"
            rows={4}
            value={formData.solution}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg shadow-soft focus:outline-none transition-all duration-300 bg-slate-800/50 text-slate-100 placeholder-slate-400 resize-none ${
              errors.solution 
                ? 'border-danger-400 focus:border-danger-400 focus:ring-2 focus:ring-danger-400/20' 
                : 'border-slate-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 hover:border-slate-500'
            }`}
            placeholder="Describe your project, approach, key features, and technologies used..."
          />
          <div className="absolute top-3 right-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {errors.solution ? (
            <p className="text-sm text-danger-400 flex items-center animate-fade-in">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.solution}
            </p>
          ) : (
            <p className="text-sm text-slate-400 font-medium">
              {formData.solution.length}/2000 characters
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn-professional w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
          isSubmitting
            ? 'opacity-50 cursor-not-allowed'
            : 'hover-professional focus:outline-none focus:ring-2 focus:ring-brand-400/50'
        } text-white shadow-brand`}
      >
        <span className="relative z-10 flex items-center justify-center">
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Project...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Project
            </>
          )}
        </span>
      </button>

      {/* Success/Error Message */}
      {submitMessage && (
        <div className={`p-4 rounded-lg border shadow-soft animate-fade-in ${
          submitMessage.includes('successfully') 
            ? 'bg-success-500/10 text-success-300 border-success-500/20' 
            : 'bg-danger-500/10 text-danger-300 border-danger-500/20'
        }`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              submitMessage.includes('successfully') 
                ? 'bg-success-500/20' 
                : 'bg-danger-500/20'
            }`}>
              {submitMessage.includes('successfully') ? (
                <svg className="w-5 h-5 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{submitMessage}</p>
              {submitMessage.includes('successfully') && (
                <p className="text-sm text-slate-400 mt-1">Your project has been added to the showcase.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default SubmissionForm;
