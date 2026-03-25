import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, CheckCircle, Mail } from 'lucide-react';
import { supabase } from '../supabaseClient';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function MarketplaceLeads() {
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await axios.get('/api/marketplace/leads', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, status, notes = '') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await axios.put(`/api/marketplace/leads/${leadId}`, 
        { status, notes },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Error updating lead status');
    }
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  const statusColors = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    negotiating: 'bg-purple-100 text-purple-700',
    closed: 'bg-green-100 text-green-700',
    lost: 'bg-gray-100 text-gray-700'
  };

  const statusIcons = {
    new: Clock,
    contacted: Mail,
    negotiating: TrendingUp,
    closed: CheckCircle,
    lost: Users
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Lead Management</h1>
        <p className="text-lg text-gray-600">
          Track and manage buyer inquiries for your listings
        </p>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-100">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({leads.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            New ({leads.filter(l => l.status === 'new').length})
          </button>
          <button
            onClick={() => setFilter('contacted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'contacted'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Contacted ({leads.filter(l => l.status === 'contacted').length})
          </button>
          <button
            onClick={() => setFilter('negotiating')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'negotiating'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            Negotiating ({leads.filter(l => l.status === 'negotiating').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'closed'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Closed ({leads.filter(l => l.status === 'closed').length})
          </button>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads yet</h3>
          <p className="text-gray-600">Buyer inquiries will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const StatusIcon = statusIcons[lead.status] || Users;
            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {lead.marketplace_listings?.title}
                      </h3>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${statusColors[lead.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Buyer:</span> {lead.buyer?.company_name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Contact:</span> {lead.buyer?.contact_email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Product Price:</span> {lead.marketplace_listings?.currency} {lead.marketplace_listings?.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Inquiry received: {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                      {lead.notes && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-2">
                          <span className="font-medium">Notes:</span> {lead.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap pt-4 border-t border-gray-200">
                  {lead.status === 'new' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'contacted')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      Mark as Contacted
                    </button>
                  )}
                  {lead.status === 'contacted' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'negotiating')}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                    >
                      Start Negotiation
                    </button>
                  )}
                  {(lead.status === 'contacted' || lead.status === 'negotiating') && (
                    <button
                      onClick={() => {
                        const notes = prompt('Add closing notes (optional):');
                        updateLeadStatus(lead.id, 'closed', notes || '');
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Mark as Closed
                    </button>
                  )}
                  {lead.status !== 'lost' && lead.status !== 'closed' && (
                    <button
                      onClick={() => {
                        const notes = prompt('Reason for marking as lost (optional):');
                        updateLeadStatus(lead.id, 'lost', notes || '');
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      Mark as Lost
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const notes = prompt('Add notes:', lead.notes || '');
                      if (notes !== null) updateLeadStatus(lead.id, lead.status, notes);
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Add/Edit Notes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
