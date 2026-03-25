import { useState, useEffect } from 'react';
import { FileText, Download, Loader, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { FormSkeleton } from '../components/LoadingSkeleton';
import UpgradePrompt from '../components/UpgradePrompt';
import axios from 'axios';
import { useToast } from '../components/Toast';

export default function ExportForms() {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [formData, setFormData] = useState({});
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(null);

  const forms = [
    { value: 'shipping_bill', label: 'Shipping Bill', description: 'Required for customs clearance' },
    { value: 'bill_of_lading', label: 'Bill of Lading', description: 'Document for cargo shipment' },
    { value: 'packing_list', label: 'Packing List', description: 'Detailed list of packed goods' },
    { value: 'certificate_of_origin', label: 'Certificate of Origin', description: 'Certifies country of manufacture' },
  ];

  const formQuestions = {
    shipping_bill: [
      { id: 'exporter_name', label: 'Exporter Name', type: 'text' },
      { id: 'exporter_address', label: 'Exporter Address', type: 'textarea' },
      { id: 'consignee_name', label: 'Consignee Name', type: 'text' },
      { id: 'consignee_country', label: 'Destination Country', type: 'text' },
      { id: 'goods_description', label: 'Description of Goods', type: 'textarea' },
      { id: 'invoice_value', label: 'Invoice Value', type: 'number' },
      { id: 'port_of_loading', label: 'Port of Loading', type: 'text' },
      { id: 'port_of_discharge', label: 'Port of Discharge', type: 'text' },
    ],
    bill_of_lading: [
      { id: 'shipper_name', label: 'Shipper Name', type: 'text' },
      { id: 'consignee_name', label: 'Consignee Name', type: 'text' },
      { id: 'vessel_name', label: 'Vessel Name', type: 'text' },
      { id: 'voyage_number', label: 'Voyage Number', type: 'text' },
      { id: 'goods_description', label: 'Description of Goods', type: 'textarea' },
      { id: 'number_of_packages', label: 'Number of Packages', type: 'number' },
      { id: 'gross_weight', label: 'Gross Weight (kg)', type: 'number' },
    ],
    packing_list: [
      { id: 'shipper_name', label: 'Shipper Name', type: 'text' },
      { id: 'consignee_name', label: 'Consignee Name', type: 'text' },
      { id: 'invoice_number', label: 'Invoice Number', type: 'text' },
      { id: 'goods_description', label: 'Description of Goods', type: 'textarea' },
      { id: 'number_of_packages', label: 'Number of Packages', type: 'number' },
      { id: 'net_weight', label: 'Net Weight (kg)', type: 'number' },
      { id: 'gross_weight', label: 'Gross Weight (kg)', type: 'number' },
    ],
    certificate_of_origin: [
      { id: 'exporter_name', label: 'Exporter Name', type: 'text' },
      { id: 'consignee_name', label: 'Consignee Name', type: 'text' },
      { id: 'country_of_origin', label: 'Country of Origin', type: 'text' },
      { id: 'goods_description', label: 'Description of Goods', type: 'textarea' },
      { id: 'hs_code', label: 'HS Code', type: 'text' },
    ],
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleContactSelect = (contactId) => {
    setSelectedContact(contactId);
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      const mapping = {
        exporter_name: contact.company_name,
        shipper_name: contact.company_name,
        consignee_name: contact.company_name,
        exporter_address: contact.address,
        consignee_country: contact.country,
        country_of_origin: contact.country
      };
      setFormData(prev => ({ ...prev, ...mapping }));
    }
  };

  const handleFormSelect = (formValue) => {
    setSelectedForm(formValue);
    setFormData({});
    setCurrentStep(0);
    setAiResponse('');
    setSelectedContact('');
  };

  const handleInputChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const getAIAssistance = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAiResponse('Please sign in to use AI assistance.');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/export-forms/assist', {
        formType: selectedForm,
        formData: formData
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      setAiResponse(response.data.suggestion || 'Please fill in the form fields above.');
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 402) {
        setShowUpgradePrompt('quota_exceeded');
      } else {
        setAiResponse('AI assistance is currently unavailable. Please fill the form manually.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateFormPDF = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to generate documents');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/export-forms/generate', {
        formType: selectedForm,
        formData: formData
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedForm}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 402) {
        setShowUpgradePrompt('quota_exceeded');
      } else {
        toast.error('Error generating form: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentQuestions = selectedForm ? formQuestions[selectedForm] || [] : [];
  const isFormComplete = currentQuestions.length > 0 && currentQuestions.every(q => formData[q.id]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Export Forms Assistant</h1>
        <p className="text-lg text-gray-600">
          AI-guided form filling for standard export documentation with professional PDF generation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Select Form Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {forms.map((form) => (
              <button
                key={form.value}
                onClick={() => handleFormSelect(form.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedForm === form.value
                    ? 'border-primary bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-primary hover:shadow-md'
                }`}
              >
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{form.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedForm && (
            <>
              {contacts.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Quick Fill from Contacts</h4>
                  </div>
                  <select
                    value={selectedContact}
                    onChange={(e) => handleContactSelect(e.target.value)}
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a contact to auto-fill...</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.company_name} - {contact.country}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fill Form Details</h3>
              <div className="space-y-4 mb-6">
                {currentQuestions.map((question, index) => (
                  <div key={question.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {question.label}
                    </label>
                    {question.type === 'textarea' ? (
                      <textarea
                        value={formData[question.id] || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={question.type}
                        value={formData[question.id] || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={getAIAssistance}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  {loading ? 'Loading...' : '✨ Get AI Assistance'}
                </button>
                <button
                  onClick={generateFormPDF}
                  disabled={!isFormComplete || loading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Generate PDF
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span> AI Assistance
          </h3>
          {loading ? (
            <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : aiResponse ? (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 leading-relaxed">{aiResponse}</p>
            </div>
          ) : (
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                💡 Select a form and click <strong>"Get AI Assistance"</strong> to receive expert guidance on filling out the form correctly.
              </p>
            </div>
          )}
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
