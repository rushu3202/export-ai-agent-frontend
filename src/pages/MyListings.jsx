import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function MyListings() {
  const toast = useToast();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/marketplace/my-listings', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put(`/api/marketplace/listings/${id}`, 
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      fetchMyListings();
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Error updating listing status');
    }
  };

  const deleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.delete(`/api/marketplace/listings/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      fetchMyListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Error deleting listing');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Listings</h1>
          <p className="text-lg text-gray-600">
            Manage your product listings and track performance
          </p>
        </div>
        <Link
          to="/app/marketplace/create"
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Listing
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Create your first product listing to start reaching buyers</p>
          <Link
            to="/app/marketplace/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {listing.image_url && (
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        listing.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {listing.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="font-semibold text-gray-900">
                        {listing.currency} {listing.price?.toLocaleString()}
                      </span>
                      <span className="text-gray-500">{listing.category}</span>
                      <span className="text-gray-500">{listing.country}</span>
                      {listing.moq && <span className="text-gray-500">MOQ: {listing.moq}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(listing.id, listing.is_active)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={listing.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {listing.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <Link
                    to={`/marketplace/listing/${listing.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => deleteListing(listing.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
