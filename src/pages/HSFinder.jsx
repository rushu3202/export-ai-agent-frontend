import { useState, useEffect } from 'react';
import { Search, History, MapPin, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { SearchResultSkeleton } from '../components/LoadingSkeleton';
import UpgradePrompt from '../components/UpgradePrompt';
import axios from 'axios';

export default function HSFinder() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [usage, setUsage] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(null);

  useEffect(() => {
    fetchSearchHistory();
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const token = session.access_token;
      const response = await axios.get('/api/usage', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsage(response.data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('hs_searches')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setSearchHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a product description');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please log in to search HS codes');
        return;
      }

      const token = session.access_token;
      const response = await axios.post('/api/hs-search', 
        { query, country: country || null },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setResult(response.data);
      setQuery('');
      setCountry('');
      fetchSearchHistory();
      fetchUsage();
    } catch (err) {
      console.error('HS Search error:', err);
      if (err.response?.status === 402) {
        setShowUpgradePrompt('quota_exceeded');
      } else {
        setError(err.response?.data?.error || 'Failed to search HS code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const confidenceText = (confidence) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">HS Code Finder</h1>
        <p className="text-lg text-gray-600">AI-powered Harmonized System code lookup for export products</p>
      </div>

      {usage && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Monthly HS Searches: <span className="font-bold text-blue-600">{usage.hs_searches} / {usage.plan === 'free' ? '5' : '∞'}</span>
              </span>
            </div>
            {usage.plan === 'free' && usage.hs_searches >= 5 && (
              <a href="/pricing" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Search HS Code</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., cotton t-shirts, organic honey, laptop computers"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Country (Optional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., USA, Germany, China"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find HS Code
                  </>
                )}
              </button>
            </form>
          </div>

          {loading && !result && (
            <SearchResultSkeleton count={1} />
          )}

          {result && (
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Search Result</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${confidenceColor(result.confidence)}`}>
                  {confidenceText(result.confidence)} Confidence ({(result.confidence * 100).toFixed(0)}%)
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-4">
                <p className="text-sm text-gray-600 mb-2">HS Code</p>
                <p className="text-4xl font-bold text-gray-900 mb-2">{result.hs_code}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Query:</span> {result.query}
                </p>
                {result.country && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Country:</span> {result.country}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">💡 Tip</p>
                <p className="text-sm text-gray-700">
                  Always verify HS codes with customs authorities for your specific product and destination. 
                  This AI-generated code is a suggestion based on the provided description.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Recent Searches</h3>
            </div>

            {searchHistory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No search history yet</p>
            ) : (
              <div className="space-y-3">
                {searchHistory.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      setQuery(item.query);
                      setCountry(item.country || '');
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.query}</p>
                      <span className="text-lg font-bold text-primary">{item.hs_code}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      {item.country && (
                        <p className="text-xs text-gray-600">📍 {item.country}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">About HS Codes</h3>
            <p className="text-sm text-gray-600 mb-3">
              The Harmonized System (HS) is an internationally standardized system of names and numbers 
              to classify traded products.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Required for customs clearance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Determines import duties & taxes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Used in trade statistics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showUpgradePrompt && (
        <UpgradePrompt
          reason={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(null)}
        />
      )}
    </div>
  );
}
