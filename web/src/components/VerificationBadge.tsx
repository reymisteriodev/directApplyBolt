import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ isVerified, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (isVerified) {
    return (
      <span className={`inline-flex items-center space-x-1 bg-orange-100 text-orange-800 rounded-full font-medium ${sizeClasses[size]}`}>
        <CheckCircle className={iconSizes[size]} />
        <span>Verified</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center space-x-1 bg-yellow-100 text-yellow-800 rounded-full font-medium ${sizeClasses[size]}`}>
      <AlertCircle className={iconSizes[size]} />
      <span>Unverified</span>
    </span>
  );
};

export default VerificationBadge;