import { useState, useEffect } from 'react';
import { Building, Globe, CreditCard, Save, Mail, MapPin, Briefcase, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from '../components/Toast';
import ValidatedInput, { ValidatedSelect } from '../components/ValidatedInput';
import { validators, useFormValidation } from '../utils/validation';
import axios from 'axios';

const companyValidationRules = {
  company_name: [validators.required, validators.minLength(2)],
  contact_email: [validators.required, validators.email],
  company_address: [validators.minLength(5)],
};

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
  { value: 'AUD', label: 'Australian Dollar ($)' },
  { value: 'CAD', label: 'Canadian Dollar ($)' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
];

const INDUSTRIES = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'trading', label: 'Trading' },
  { value: 'services', label: 'Services' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'technology', label: 'Technology' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'other', label: 'Other' },
];

const BUSINESS_TYPES = [
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'trader', label: 'Trader' },
  { value: 'service_provider', label: 'Service Provider' },
  { value: 'exporter', label: 'Exporter' },
  { value: 'importer', label: 'Importer' },
];

export default function Settings() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'en',
  });

  const {
    values: companyData,
    errors: companyErrors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
  } = useFormValidation({
    company_name: '',
    company_address: '',
    industry: '',
    business_type: '',
    contact_email: '',
  }, companyValidationRules);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to access settings');
        return;
      }

      const token = session.access_token;
      const response = await axios.get('/api/user-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const profile = response.data;
      setUserProfile(profile);
      
      setValues({
        company_name: profile.company_name || '',
        company_address: profile.company_address || '',
        industry: profile.industry || '',
        business_type: profile.business_type || '',
        contact_email: profile.contact_email || profile.email || '',
      });

      setPreferences({
        currency: profile.currency || 'USD',
        language: profile.language || 'en',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast.warning('Please fix validation errors before saving');
      return;
    }

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const token = session.access_token;
      await axios.put('/api/user-profile', companyData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Company information updated successfully!');
      fetchUserData();
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Failed to save company information');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const token = session.access_token;
      await axios.put('/api/user-profile', preferences, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Preferences updated successfully!');
      fetchUserData();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const token = session.access_token;
      const response = await axios.post('/create-customer-portal-session', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open billing portal');
    }
  };

  const getPlanDetails = (plan) => {
    const plans = {
      free: {
        name: 'Free Plan',
        price: '£0/month',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
      },
      pro: {
        name: 'Pro Plan',
        price: '£9.99/month',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      business: {
        name: 'Business Plan',
        price: '£29/month',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
      },
    };
    return plans[plan] || plans.free;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentPlan = getPlanDetails(userProfile?.subscription_status || 'free');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('company')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'company'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building className="w-5 h-5" />
                Company Info
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'preferences'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Globe className="w-5 h-5" />
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'subscription'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Subscription
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'company' && (
              <form onSubmit={handleSaveCompany} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Company Information</h2>
                  <p className="text-gray-600 mb-6">Update your business details</p>
                </div>

                <ValidatedInput
                  label="Company Name"
                  name="company_name"
                  value={companyData.company_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={companyErrors.company_name}
                  touched={touched.company_name}
                  required
                  placeholder="Enter your company name"
                />

                <ValidatedInput
                  label="Company Address"
                  name="company_address"
                  value={companyData.company_address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={companyErrors.company_address}
                  touched={touched.company_address}
                  placeholder="Enter your company address"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValidatedSelect
                    label="Industry"
                    name="industry"
                    value={companyData.industry}
                    onChange={handleChange}
                    options={INDUSTRIES}
                    placeholder="Select your industry"
                  />

                  <ValidatedSelect
                    label="Business Type"
                    name="business_type"
                    value={companyData.business_type}
                    onChange={handleChange}
                    options={BUSINESS_TYPES}
                    placeholder="Select business type"
                  />
                </div>

                <ValidatedInput
                  label="Contact Email"
                  name="contact_email"
                  type="email"
                  value={companyData.contact_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={companyErrors.contact_email}
                  touched={touched.contact_email}
                  required
                  placeholder="Enter contact email"
                />

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <form onSubmit={handleSavePreferences} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Preferences</h2>
                  <p className="text-gray-600 mb-6">Customize your experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Used for invoices and pricing</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {LANGUAGES.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Interface language</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Subscription & Billing</h2>
                  <p className="text-gray-600 mb-6">Manage your subscription and billing details</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                      <p className="text-gray-600 text-sm">Your active subscription</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${currentPlan.bgColor} ${currentPlan.color} font-semibold`}>
                      {currentPlan.name}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-gray-900">{currentPlan.price}</span>
                    <span className="text-gray-600">billed monthly</span>
                  </div>

                  {userProfile?.subscription_status === 'free' && (
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Upgrade to Pro</h4>
                      <p className="text-gray-600 text-sm mb-3">Get unlimited access to all features</p>
                      <ul className="space-y-2 text-sm text-gray-700 mb-4">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Unlimited invoices & documents
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Unlimited HS code searches
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Priority AI support
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          Advanced analytics
                        </li>
                      </ul>
                      <a
                        href="/app/pricing"
                        className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        View Plans
                      </a>
                    </div>
                  )}

                  {userProfile?.subscription_status !== 'free' && (
                    <button
                      onClick={handleManageSubscription}
                      className="w-full px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
                    >
                      Manage Subscription
                    </button>
                  )}
                </div>

                {userProfile?.trial_ends_at && new Date(userProfile.trial_ends_at) > new Date() && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-1">Free Trial Active</h4>
                    <p className="text-blue-700 text-sm">
                      Your trial ends on {new Date(userProfile.trial_ends_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Account Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className="text-gray-900 font-medium">{userProfile?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(userProfile?.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
