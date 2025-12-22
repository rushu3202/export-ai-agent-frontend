import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, DollarSign, Filter, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from '../components/Toast';
import { TableSkeleton } from '../components/LoadingSkeleton';
import * as XLSX from 'xlsx';

export default function InvoiceHistory() {
  const toast = useToast();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to view invoice history');
        return;
      }

      // Fetch from both invoices table (old) and documents table (new)
      const [oldInvoices, newDocuments] = await Promise.all([
        supabase
          .from('invoices')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('documents')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('type', 'invoice')
          .order('created_at', { ascending: false })
      ]);

      const combinedInvoices = [
        ...(oldInvoices.data || []).map(inv => ({
          ...inv,
          invoice_number: inv.id?.toString().slice(0, 8) || 'N/A',
          invoice_date: inv.created_at,
          total_amount: inv.total_amount || 0
        })),
        ...(newDocuments.data || []).map(doc => ({
          ...doc,
          invoice_number: doc.data?.invoice_number || doc.id?.toString().slice(0, 8) || 'N/A',
          invoice_date: doc.data?.invoice_date || doc.created_at,
          seller_name: doc.data?.seller_name,
          buyer_name: doc.data?.buyer_name,
          currency: doc.data?.currency || 'USD',
          total_amount: doc.data?.total_amount || 0
        }))
      ];

      // Sort by created_at
      combinedInvoices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setInvoices(combinedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoice history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const data = filteredInvoices.map(invoice => ({
      'Invoice Number': invoice.invoice_number || 'N/A',
      'Date': new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString(),
      'Seller': invoice.seller_name || 'N/A',
      'Buyer': invoice.buyer_name || 'N/A',
      'Currency': invoice.currency || 'USD',
      'Total Amount': invoice.total_amount || 0,
      'Items': invoice.items?.length || invoice.data?.items?.length || 0
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, `ExportAgent_Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.seller_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCurrency = filterCurrency === 'all' || invoice.currency === filterCurrency;
    
    return matchesSearch && matchesCurrency;
  });

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const currencies = [...new Set(invoices.map(inv => inv.currency).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoice History</h1>
          <p className="text-lg text-gray-600">View and manage all your generated invoices</p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={invoices.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          Export Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 uppercase tracking-wide mb-1">Total Invoices</p>
              <p className="text-4xl font-bold">{filteredInvoices.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <FileText className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 uppercase tracking-wide mb-1">Total Revenue</p>
              <p className="text-4xl font-bold">{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 uppercase tracking-wide mb-1">This Month</p>
              <p className="text-4xl font-bold">
                {invoices.filter(inv => {
                  const invDate = new Date(inv.created_at);
                  const now = new Date();
                  return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by invoice number, seller, or buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Currencies</option>
            {currencies.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No invoices found</h3>
          <p className="text-gray-500 mb-4">Start by generating your first invoice</p>
          <a
            href="/invoice"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <FileText className="w-5 h-5" />
            Generate Invoice
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Buyer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number || invoice.id?.toString().slice(0, 8) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(invoice.invoice_date || invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.seller_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.buyer_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">
                        {invoice.currency || 'USD'} {(invoice.total_amount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {invoice.items?.length || invoice.data?.items?.length || 0} items
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
