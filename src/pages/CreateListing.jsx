import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, MapPin, Hash, Image as ImageIcon, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function CreateListing() {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'USD',
    country: '',
    hs_code: '',
    moq: '',
    image_url: ''
  });

  const categories = [
    'Electronics', 'Textiles', 'Machinery', 'Chemicals', 
    'Agriculture', 'Automotive', 'Food & Beverages', 'Other'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CNY', 'JPY'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to create a listing');
        navigate('/login');
        return;
      }

      await axios.post('/api/marketplace/listings', formData, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      toast.success('Listing created successfully!');
      navigate('/marketplace/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Error creating listing: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Product</h1>
        <p className="text-lg text-gray-600">
          Reach global buyers by listing your export products
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4 mr-2" />
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Premium Cotton T-Shirts"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe your product, specifications, quality, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Country of Origin *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="e.g. India, China, USA"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2" />
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {currencies.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* HS Code & MOQ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Hash className="w-4 h-4 mr-2" />
                HS Code (Optional)
              </label>
              <input
                type="text"
                name="hs_code"
                value={formData.hs_code}
                onChange={handleChange}
                placeholder="e.g. 6109.10.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Harmonized System code for your product</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Order Quantity (Optional)
              </label>
              <input
                type="number"
                name="moq"
                value={formData.moq}
                onChange={handleChange}
                placeholder="e.g. 1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 mr-2" />
              Product Image URL (Optional)
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {formData.image_url && (
              <div className="mt-4">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="max-w-xs h-40 object-cover rounded-lg border border-gray-200"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
