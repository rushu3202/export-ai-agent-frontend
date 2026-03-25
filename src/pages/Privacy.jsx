import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Privacy Policy - ExportAgent"
        description="Privacy policy and data protection information for ExportAgent platform."
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            
            <p className="text-gray-600 mb-8">Last updated: October 13, 2025</p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p>
                  ExportAgent Ltd ("we", "our", "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.1 Information You Provide</h3>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                  <li><strong>Account Information:</strong> Email address, name, company details</li>
                  <li><strong>Company Information:</strong> Business name, address, VAT number, industry</li>
                  <li><strong>Contact Data:</strong> Buyer/supplier information you add to your CRM</li>
                  <li><strong>Document Data:</strong> Invoices, export forms, and shipment details you create</li>
                  <li><strong>Payment Information:</strong> Processed securely by Stripe (we don't store card details)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">2.2 Automatically Collected Information</h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Cookies:</strong> See our Cookie Policy section below</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>To provide and maintain our Service</li>
                  <li>To process your transactions and subscriptions</li>
                  <li>To generate AI-powered export documentation</li>
                  <li>To provide customer support</li>
                  <li>To send service updates and important notices</li>
                  <li>To improve our AI models (using anonymized data only)</li>
                  <li>To prevent fraud and ensure security</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Processing and AI</h2>
                <p className="mb-3">
                  Our Service uses AI (OpenAI GPT-4) to assist with:
                </p>
                <ul className="list-disc ml-6 space-y-2 mb-3">
                  <li>HS code classification</li>
                  <li>Export form assistance</li>
                  <li>Trade compliance advice</li>
                </ul>
                <p>
                  We share minimal necessary data with OpenAI for processing. OpenAI does not train models on your data. 
                  We may use anonymized, aggregated data to improve our own AI features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Sharing and Disclosure</h2>
                <p className="mb-3">We may share your information with:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Service Providers:</strong> Stripe (payments), Supabase (database), OpenAI (AI processing)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
                <p className="mt-3">
                  We DO NOT sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Data Storage and Security</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Your data is stored securely on Supabase (PostgreSQL) servers</li>
                  <li>Data is encrypted in transit (HTTPS/SSL) and at rest</li>
                  <li>We implement industry-standard security measures</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Your Rights (UK GDPR)</h2>
                <p className="mb-3">Under UK GDPR, you have the right to:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Object:</strong> Object to processing for certain purposes</li>
                  <li><strong>Withdraw Consent:</strong> At any time, where processing is based on consent</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, contact us at{' '}
                  <a href="mailto:privacy@exportagent.com" className="text-primary hover:underline">
                    privacy@exportagent.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Cookies and Tracking</h2>
                <p className="mb-3">We use cookies for:</p>
                <ul className="list-disc ml-6 space-y-2 mb-3">
                  <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
                  <li><strong>Analytics Cookies:</strong> Google Analytics 4 (with your consent only)</li>
                  <li><strong>Preference Cookies:</strong> To remember your settings</li>
                </ul>
                <p>
                  You can manage cookie preferences through our cookie consent banner. 
                  We respect your "Do Not Track" browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Data Retention</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Account data: Retained while your account is active</li>
                  <li>Documents & invoices: Retained for 7 years (tax/legal compliance)</li>
                  <li>Usage logs: Retained for 12 months</li>
                  <li>Marketing data: Until you unsubscribe or request deletion</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. International Transfers</h2>
                <p>
                  Your data may be transferred to and processed in countries outside the UK/EEA. 
                  We ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) 
                  and adequacy decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Children's Privacy</h2>
                <p>
                  Our Service is not intended for children under 18. We do not knowingly collect 
                  data from children. If you believe we have collected data from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of material changes 
                  via email or through the Service. The "Last updated" date will always reflect the latest version.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Contact Us</h2>
                <p className="mb-3">For privacy-related questions or to exercise your rights, contact:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">ExportAgent Ltd - Data Protection</p>
                  <p>Email: <a href="mailto:privacy@exportagent.com" className="text-primary hover:underline">privacy@exportagent.com</a></p>
                  <p>Address: [Registered Address from .env]</p>
                </div>
                <p className="mt-4">
                  You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO): 
                  <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    ico.org.uk
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
