import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, Crown, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpgradePrompt = ({ reason, onClose, trialDaysLeft = null }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const reasons = {
    trial_expired: {
      title: 'Your 7-Day Trial Has Ended',
      subtitle: 'Continue growing your exports with unlimited access',
      icon: Clock,
      iconColor: 'from-amber-500 to-orange-500',
      benefits: [
        'Unlimited invoices & export documents',
        'Advanced AI features & smart suggestions',
        'Priority customer support',
        'B2B marketplace access'
      ]
    },
    quota_exceeded: {
      title: 'Monthly Limit Reached',
      subtitle: 'Upgrade to continue creating documents',
      icon: TrendingUp,
      iconColor: 'from-blue-500 to-purple-500',
      benefits: [
        'Unlimited document generation',
        'No monthly caps or restrictions',
        'Advanced export analytics',
        'API access for integrations'
      ]
    },
    feature_locked: {
      title: 'Premium Feature',
      subtitle: 'Unlock this feature with Pro',
      icon: Crown,
      iconColor: 'from-purple-500 to-pink-500',
      benefits: [
        'All premium features unlocked',
        'Advanced AI capabilities',
        'Priority processing',
        'Dedicated account manager'
      ]
    }
  };

  const config = reasons[reason] || reasons.feature_locked;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${config.iconColor} p-8 text-white relative`}>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">{config.title}</h2>
                  <p className="text-white/90">{config.subtitle}</p>
                </div>
              </div>

              {trialDaysLeft !== null && trialDaysLeft > 0 && (
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-sm font-medium">
                    ⏰ {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left in your free trial
                  </p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Benefits */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Pro Plan Includes:</h3>
                <div className="space-y-3">
                  {config.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Pro Plan</div>
                    <div className="text-4xl font-bold text-gray-900">
                      £9.99<span className="text-lg text-gray-600">/month</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold">
                    Best Value
                  </div>
                </div>
                <p className="text-sm text-gray-600">Cancel anytime. No hidden fees.</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/app/profile"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Upgrade to Pro
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleClose}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                30-day money-back guarantee • Secure payment via Stripe
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpgradePrompt;
