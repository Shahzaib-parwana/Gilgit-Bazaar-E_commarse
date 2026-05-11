import { Link } from 'react-router-dom';
import { FileText, CreditCard, Truck, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const Terms = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of <span className="text-emerald-500">Service</span>
          </h1>
          <p className="text-gray-400 text-lg">Effective Date: {currentYear}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            </div>
            <p className="text-gray-400">
              By accessing or using Gilgit Bazaar's website and services, you agree to be bound by these 
              Terms of Service. If you disagree with any part, please do not use our services.
            </p>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">2. Products & Pricing</h2>
            </div>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>All product descriptions are accurate to the best of our knowledge</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to modify or discontinue products</li>
              <li>Colors and sizes may vary slightly from images shown</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">3. Orders & Shipping</h2>
            </div>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Orders are processed within 1-3 business days</li>
              <li>Shipping times vary based on location</li>
              <li>You will receive a tracking number once shipped</li>
              <li>International shipping may incur additional customs fees</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">4. Returns & Refunds</h2>
            </div>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Returns accepted within 14 days of delivery</li>
              <li>Products must be unused and in original packaging</li>
              <li>Refunds processed within 5-7 business days</li>
              <li>Customer responsible for return shipping costs</li>
            </ul>
            <Link to="/shiping-info" className="inline-block mt-4 text-emerald-500 hover:text-emerald-400">
              Learn more about our return policy →
            </Link>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">5. User Responsibilities</h2>
            </div>
            <p className="text-gray-400 mb-4">You agree to:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Provide accurate account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not use our services for illegal purposes</li>
              <li>Not interfere with website functionality</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">6. Limitation of Liability</h2>
            </div>
            <p className="text-gray-400">
              Gilgit Bazaar shall not be liable for any indirect, incidental, or consequential damages 
              arising from the use of our products or services. Our total liability shall not exceed the 
              amount paid for the product in question.
            </p>
          </section>

          <section className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">Need Help?</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about these terms, please contact us:
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-semibold">
              Contact Support →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;