import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, DollarSign, Package, Hash, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function ListingDetail() {
  const toast = useToast();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchListing();
    getCurrentUser();
  }, [id]);

  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setCurrentUserId(session.user.id);
  };

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/marketplace/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendInquiry = async () => {
    if (!message.trim()) {
      toast.warning('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to send inquiries');
        return;
      }

      await axios.post('/api/marketplace/messages', {
        listing_id: parseInt(id),
        receiver_id: listing.user_id,
        message: message.trim()
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      toast.success('Inquiry sent successfully! The seller will contact you soon.');
      setMessage('');
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Error sending inquiry: ' + (error.response?.data?.message || error.message));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Listing not found</p>
      </div>
    );
  }

  const isOwner = currentUserId === listing.user_id;
  const isPro = listing.user_profiles?.subscription_status !== 'free';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          {listing.image_url && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
              {isPro && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {listing.category}
              </span>
              {listing.hs_code && (
                <div className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  HS: {listing.hs_code}
                </div>
              )}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-line">
              {listing.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold text-gray-900">
                    {listing.currency} {listing.price?.toLocaleString()}
                  </p>
                </div>
              </div>

              {listing.moq && (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minimum Order</p>
                    <p className="text-xl font-bold text-gray-900">{listing.moq} units</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="text-xl font-bold text-gray-900">{listing.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Seller Info & Contact */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">Company:</span> {listing.user_profiles?.company_name || 'Private Seller'}
              </p>
              {isPro && (
                <div className="flex items-center gap-2 text-blue-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Verified Business Account</span>
                </div>
              )}
            </div>
          </div>

          {!isOwner && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Send Inquiry
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in your product..."
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent mb-4"
              />
              <button
                onClick={sendInquiry}
                disabled={sending || !message.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {sending ? 'Sending...' : 'Send Inquiry'}
              </button>
            </div>
          )}

          {isOwner && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <p className="text-amber-800 font-medium">
                This is your listing. Buyers will contact you directly through the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
