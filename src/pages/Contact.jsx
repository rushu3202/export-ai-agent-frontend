import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Linkedin, Instagram, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
      <SEO 
        title="Contact Us - ExportAgent"
        description="Get in touch with ExportAgent for support, inquiries, or partnerships."
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h1>
            </div>
            
            <p className="text-gray-600 mb-8">
              We're here to help! Get in touch with our team for support, questions, or partnership opportunities.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/10 to-blue-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                  </div>
                  <p className="text-gray-700 mb-2">For general inquiries and support:</p>
                  <a 
                    href="mailto:hello@exportagent.com" 
                    className="text-primary hover:text-blue-700 font-medium text-lg"
                  >
                    hello@exportagent.com
                  </a>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <HelpCircle className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Technical Support</h3>
                  </div>
                  <p className="text-gray-700 mb-2">For technical issues and bugs:</p>
                  <a 
                    href="mailto:support@exportagent.com" 
                    className="text-purple-600 hover:text-purple-700 font-medium text-lg"
                  >
                    support@exportagent.com
                  </a>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Get instant help from our support team. Look for the chat widget in the bottom-right corner 
                    when logged into your account.
                  </p>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    Login to Chat →
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>ExportAgent Ltd</strong></p>
                    <p>Registered in England and Wales</p>
                    <p>Company No: {import.meta.env.VITE_COMPANY_NUMBER || 'TBC'}</p>
                    {import.meta.env.VITE_VAT_NUMBER && (
                      <p>VAT: {import.meta.env.VITE_VAT_NUMBER}</p>
                    )}
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Registered Address:</p>
                      <p className="text-sm">{import.meta.env.VITE_REGISTERED_ADDRESS || 'TBC'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                  <p className="text-gray-700 mb-4">
                    Stay updated with the latest export tips and platform updates:
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://linkedin.com/company/exportagent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                    <a
                      href="https://instagram.com/exportagent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email Support:</strong> 24/7</p>
                    <p><strong>Live Chat:</strong> Monday-Friday, 9am-6pm GMT</p>
                    <p className="text-sm text-gray-600 mt-3">
                      We typically respond to emails within 24 hours on business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
                <p className="text-gray-700 mb-4">
                  Before reaching out, check if your question is answered in our FAQ or documentation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    to="/app/chat" 
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    AI Chat Assistant
                  </Link>
                  <Link 
                    to="/terms" 
                    className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link 
                to="/" 
                className="inline-flex items-center text-primary hover:text-blue-700 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
