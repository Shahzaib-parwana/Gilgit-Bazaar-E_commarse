import { Link } from 'react-router-dom';
import { Shield, Eye, Database, Cookie, Mail, Phone, MapPin } from 'lucide-react';

const Privacy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy <span className="text-emerald-500">Policy</span>
          </h1>
          <p className="text-gray-400 text-lg">Last updated: {currentYear}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
            </div>
            <p className="text-gray-400 mb-4">
              At Gilgit Bazaar, we collect information to provide better services to our customers. We collect:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Personal information (name, email, phone number, address)</li>
              <li>Order history and preferences</li>
              <li>Payment information (processed securely via Stripe)</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate about your purchases and updates</li>
              <li>Improve our products and services</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">Data Security</h2>
            </div>
            <p className="text-gray-400">
              We implement industry-standard security measures to protect your personal information. 
              All transactions are encrypted using SSL technology, and we never store complete payment 
              details on our servers.
            </p>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">Cookies & Tracking</h2>
            </div>
            <p className="text-gray-400 mb-4">
              We use cookies to enhance your browsing experience. For more details, please see our 
              <Link to="/cookies" className="text-emerald-500 hover:text-emerald-400 mx-1">Cookie Policy</Link>.
            </p>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p className="text-gray-400 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-400 mb-4">
              For any privacy-related questions, contact us at:
            </p>
            <div className="space-y-2">
              <a href="mailto:iamkhan6056@gmail.com" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400">
                <Mail size={18} /> iamkhan6056@gmail.com
              </a>
              <a href="tel:+923129455315" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400">
                <Phone size={18} /> +92-3129455315
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} /> Gilgit-Baltistan, Pakistan
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;