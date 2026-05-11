import { useState, useEffect } from 'react';
import { Cookie, Info, Settings, Shield, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cookies = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      setCookiePreferences(JSON.parse(saved));
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="text-emerald-500 w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Cookie <span className="text-emerald-500">Policy</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">What Are Cookies?</h2>
            </div>
            <p className="text-gray-400">
              Cookies are small text files stored on your device when you visit websites. They help us 
              provide you with a better browsing experience, remember your preferences, and understand 
              how you interact with our site.
            </p>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">Manage Cookie Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Necessary Cookies</h3>
                  <p className="text-sm text-gray-400">Required for website functionality</p>
                </div>
                <span className="text-emerald-500 text-sm">Always Active</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Functional Cookies</h3>
                  <p className="text-sm text-gray-400">Remember your preferences</p>
                </div>
                <button
                  onClick={() => setCookiePreferences({...cookiePreferences, functional: !cookiePreferences.functional})}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    cookiePreferences.functional 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {cookiePreferences.functional ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Analytics Cookies</h3>
                  <p className="text-sm text-gray-400">Help us improve our website</p>
                </div>
                <button
                  onClick={() => setCookiePreferences({...cookiePreferences, analytics: !cookiePreferences.analytics})}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    cookiePreferences.analytics 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {cookiePreferences.analytics ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Marketing Cookies</h3>
                  <p className="text-sm text-gray-400">Personalized advertisements</p>
                </div>
                <button
                  onClick={() => setCookiePreferences({...cookiePreferences, marketing: !cookiePreferences.marketing})}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    cookiePreferences.marketing 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {cookiePreferences.marketing ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <button
                onClick={savePreferences}
                className="w-full mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">How to Delete Cookies</h2>
            </div>
            <p className="text-gray-400 mb-4">
              You can delete cookies already stored on your device through your browser settings:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Chrome: Settings → Privacy → Clear browsing data</li>
              <li>Firefox: Options → Privacy & Security → Clear Data</li>
              <li>Safari: Preferences → Privacy → Manage Website Data</li>
              <li>Edge: Settings → Privacy → Clear browsing data</li>
            </ul>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">Third-Party Cookies</h2>
            </div>
            <p className="text-gray-400">
              We use trusted third-party services that may set cookies on our behalf:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mt-4 ml-4">
              <li>Google Analytics - Website analytics</li>
              <li>Stripe - Payment processing</li>
              <li>Social media platforms (Facebook, Instagram, etc.)</li>
            </ul>
          </section>

          <section className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-emerald-500" />
              <h2 className="text-xl font-bold text-white">Your Consent</h2>
            </div>
            <p className="text-gray-300">
              By using our website, you consent to our use of cookies as described in this policy. 
              You can change your preferences at any time using the controls above.
            </p>
            <Link to="/privacy-policy" className="inline-block mt-4 text-emerald-500 hover:text-emerald-400">
              View our Privacy Policy →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;