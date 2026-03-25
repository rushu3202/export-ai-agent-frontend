import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms & Conditions - ExportAgent"
        description="Terms and conditions for using ExportAgent's AI-powered export documentation platform."
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms & Conditions</h1>
            </div>
            
            <p className="text-gray-600 mb-8">Last updated: October 13, 2025</p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
                <p className="mb-3">
                  By accessing and using ExportAgent ("the Service"), you agree to be bound by these Terms and Conditions. 
                  If you do not agree to these terms, please do not use the Service.
                </p>
                <p>
                  ExportAgent is operated by ExportAgent Ltd, a company registered in England and Wales.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
                <p className="mb-3">
                  ExportAgent provides AI-powered tools for export documentation, compliance automation, 
                  and international trade facilitation, including:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Commercial invoice generation</li>
                  <li>HS code classification</li>
                  <li>Export forms and documentation</li>
                  <li>Shipment tracking</li>
                  <li>AI chat assistant for export compliance</li>
                  <li>B2B marketplace for exporters</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
                <p className="mb-3">
                  To access certain features, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Subscription Plans</h2>
                <p className="mb-3">
                  ExportAgent offers both free and paid subscription plans:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Free Plan:</strong> Limited monthly usage (5 documents, 5 HS searches, 5 AI queries, 20 contacts)</li>
                  <li><strong>Pro Plan:</strong> Unlimited usage of all features</li>
                  <li>All subscriptions renew automatically until cancelled</li>
                  <li>You may cancel your subscription at any time from your account settings</li>
                  <li>Refunds are handled on a case-by-case basis within 14 days of purchase</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Acceptable Use</h2>
                <p className="mb-3">
                  You agree NOT to:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Violate any laws, including export control and sanctions regulations</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Transmit viruses, malware, or harmful code</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Scrape, copy, or redistribute our content without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. AI-Generated Content</h2>
                <p className="mb-3">
                  Our Service uses AI to assist with export documentation. Please note:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>AI suggestions are for guidance only and may contain errors</li>
                  <li>You are solely responsible for verifying all information</li>
                  <li>We do not guarantee accuracy of HS codes, duties, or compliance advice</li>
                  <li>Always consult with customs brokers and legal professionals for critical decisions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
                <p className="mb-3">
                  All content, features, and functionality of ExportAgent are owned by ExportAgent Ltd 
                  and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  Documents you generate using the Service belong to you, but you grant us permission 
                  to use anonymized data to improve our AI models.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
                <p className="mb-3">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>The Service is provided "AS IS" without warranties of any kind</li>
                  <li>We are not liable for any customs penalties, delays, or compliance issues</li>
                  <li>We are not responsible for losses resulting from use of AI-generated content</li>
                  <li>Our total liability shall not exceed the amount you paid in the last 12 months</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Data and Privacy</h2>
                <p>
                  Your use of the Service is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. 
                  We process your data in accordance with UK GDPR and data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Termination</h2>
                <p className="mb-3">
                  We reserve the right to suspend or terminate your access to the Service:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>For violation of these Terms</li>
                  <li>For fraudulent or illegal activity</li>
                  <li>If you fail to pay subscription fees</li>
                  <li>At our discretion with reasonable notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
                <p>
                  We may update these Terms from time to time. We will notify you of material changes 
                  via email or through the Service. Continued use after changes constitutes acceptance of new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
                <p>
                  These Terms are governed by the laws of England and Wales. Any disputes shall be 
                  subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Contact Us</h2>
                <p>
                  For questions about these Terms, please contact us at{' '}
                  <a href="mailto:hello@exportagent.com" className="text-primary hover:underline">
                    hello@exportagent.com
                  </a>
                </p>
              </section>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200">
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
