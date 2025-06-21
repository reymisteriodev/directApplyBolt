import React from 'react';
import { MapPin, DollarSign, Clock, Star } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    postedDate: string;
    isVerified: boolean;
    matchScore?: number;
    description: string;
    remote?: boolean;
  };
  showMatchScore?: boolean;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, showMatchScore = false, onApply }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-300 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {job.title}
            </h3>
            <VerificationBadge isVerified={job.isVerified} />
          </div>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        {showMatchScore && job.matchScore && (
          <div className="flex items-center space-x-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">{job.matchScore}% Match</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
          {job.remote && <span className="text-orange-600 font-medium">• Remote</span>}
        </div>
        {job.salary && (
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{job.postedDate}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onApply(job.id)}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Apply Now
        </button>
        <button className="text-gray-400 hover:text-orange-500 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default JobCard;