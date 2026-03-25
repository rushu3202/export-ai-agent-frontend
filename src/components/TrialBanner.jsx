import { Clock, Zap, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const TrialBanner = ({ trialDaysLeft, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || trialDaysLeft === null || trialDaysLeft < 0) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const getVariant = () => {
    if (trialDaysLeft === 0) {
      return {
        bg: 'from-red-50 to-orange-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
        button: 'from-red-600 to-orange-600'
      };
    } else if (trialDaysLeft <= 2) {
      return {
        bg: 'from-amber-50 to-yellow-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        icon: 'text-amber-600',
        button: 'from-amber-600 to-orange-600'
      };
    } else {
      return {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        button: 'from-blue-600 to-purple-600'
      };
    }
  };

  const variant = getVariant();

  const getMessage = () => {
    if (trialDaysLeft === 0) {
      return 'Your trial ends today! Upgrade now to continue.';
    } else if (trialDaysLeft === 1) {
      return '1 day left in your free trial';
    } else {
      return `${trialDaysLeft} days left in your free trial`;
    }
  };

  return (
    <div className={`mb-6 bg-gradient-to-r ${variant.bg} border ${variant.border} rounded-2xl p-4 shadow-sm`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 ${variant.icon} bg-white rounded-xl flex items-center justify-center`}>
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className={`${variant.text} font-semibold`}>{getMessage()}</p>
            <p className="text-sm text-gray-600 mt-0.5">
              Unlock unlimited features with Pro
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to="/app/profile"
            className={`px-6 py-2 bg-gradient-to-r ${variant.button} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap`}
          >
            <Zap className="w-4 h-4" />
            Upgrade Now
          </Link>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
