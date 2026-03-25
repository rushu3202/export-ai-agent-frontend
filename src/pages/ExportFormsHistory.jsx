import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, Search, Ship, Package } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from '../components/Toast';
import { TableSkeleton } from '../components/LoadingSkeleton';
import * as XLSX from 'xlsx';

export default function ExportFormsHistory() {
  const { showToast } = useToast();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchExportForms();
  }, []);

  const fetchExportForms = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        showToast('Please log in to view export forms history', 'error');
        return;
      }

      const exportFormTypes = ['shipping_bill', 'bill_of_lading', 'packing_list', 'certificate_of_origin'];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.user.id)
        .in('type', exportFormTypes)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedForms = (data || []).map(doc => {
        const formData = doc.data || {};
        return {
          id: doc.id,
          formType: doc.type?.replace(/_/g, ' ').toUpperCase() || 'Unknown',
          reference: formData.exporter_name || formData.shipper_name || formData.consignee_name || 'N/A',
          destination: formData.consignee_country || formData.destination_country || 'N/A',
          value: formData.invoice_value || formData.value || 'N/A',
          created_at: doc.created_at,
          pdf_url: doc.pdf_url
        };
      });

      setForms(formattedForms);
    } catch (error) {
      console.error('Error fetching export forms:', error);
      showToast('Failed to load export forms history. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.formType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || form.formType === filterType;
    
    return matchesSearch && matchesType;
  });

  const exportToExcel = () => {
    const data = filteredForms.map(form => ({
      'Form Type': form.formType,
      'Date': new Date(form.created_at).toLocaleDateString(),
      'Reference': form.reference,
      'Destination': form.destination,
      'Value': form.value
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Export Forms');
    XLSX.writeFile(wb, `export-forms-${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Export forms exported to Excel', 'success');
  };

  const formTypes = [...new Set(forms.map(f => f.formType).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Export Forms History</h1>
          <p className="text-lg text-gray-600">View and manage all your generated export documents</p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={forms.length === 0}
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
              <p className="text-sm text-blue-100 uppercase tracking-wide mb-1">Total Forms</p>
              <p className="text-4xl font-bold">{filteredForms.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <FileText className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 uppercase tracking-wide mb-1">This Month</p>
              <p className="text-4xl font-bold">
                {forms.filter(form => {
                  const formDate = new Date(form.created_at);
                  const now = new Date();
                  return formDate.getMonth() === now.getMonth() && formDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 uppercase tracking-wide mb-1">Form Types</p>
              <p className="text-4xl font-bold">{formTypes.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Ship className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by reference, destination, or form type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Form Types</option>
              {formTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={5} />
      ) : filteredForms.length === 0 ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 text-center">
          <Package className="w-20 h-20 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Export Forms Yet</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'No forms match your search criteria' 
              : 'Generate your first export form to see it here'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Form Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Destination</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Value</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredForms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{form.formType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(form.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{form.reference}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{form.destination}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{form.value}</td>
                    <td className="px-6 py-4 text-center">
                      {form.pdf_url ? (
                        <a
                          href={form.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No PDF</span>
                      )}
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
