import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter
} from "react-icons/fa";
import contactService from '../../services/contactService';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Footer = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [type, setType] = useState('General Inquiry');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchContactData = async () => {
      setLoading(true);
      const result = await contactService.getAllContactData();
      
      if (result.success) {
        setContactData(result.data);
        setError(null);
        // Set default subject type from backend if available
        if (result.data?.form_settings?.subject_types?.length > 0) {
          setType(result.data.form_settings.subject_types[0]);
        }
      } else {
        setError(result.error);
        console.error('Failed to fetch contact data:', result.error);
      }
      
      setLoading(false);
    };

    fetchContactData();
  }, []);

  // Newsletter subscription states
  const [subEmail, setSubEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!subEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setSubscribing(true);
    
    try {
      const response = await api.post('newsletter/subscribe/', { email: subEmail });
      
      if (response.data.success) {
        toast.success(response.data.message || 'Verification email sent! Please check your inbox.');
        setSubEmail(''); // Clear the input field
      } else {
        toast.error(response.data.error || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error.response?.data?.error || 'Network error. Please check your connection.';
      toast.error(errorMessage);
    } finally {
      setSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Story', path: '/our-story' },
    ],
    shop: [
      { name: 'All Products', path: '/products' },
      { name: 'New Arrivals', path: '/products?featured=true' },
      { name: 'Best Sellers', path: '/products?sort=-sold' },
      { name: 'Gift Cards', path: '/gift-hampers' },
    ],
    support: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'Shipping Info', path: '/shipping-info' },
      { name: 'FAQ', path: '/faq' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
    ],
  };

  // Fix: Extract social links from contactData properly
  const socialLinks = contactData?.social_links || [];

  // Helper function to get icon component based on platform
  const getSocialIcon = (platform) => {
    const icons = {
      facebook: FaFacebook,
      instagram: FaInstagram,
      linkedin: FaLinkedin,
      youtube: FaYoutube,
      twitter: FaTwitter,
      fafacebook: FaFacebook,
      fainstagram: FaInstagram,
      falinkedin: FaLinkedin,
      fayoutube: FaYoutube,
      fatwitter: FaTwitter,
    };
    const IconComponent = icons[platform?.toLowerCase()];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Connected
              </h3>
              <p className="text-gray-400">
                Subscribe to get special offers, free giveaways, and updates.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500"
                disabled={subscribing}
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-r-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={subscribing}
              >
                {subscribing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-white">
                Gilgit <span className="text-emerald-500">Bazaar</span>
              </h3>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Bringing you the finest artisan products and authentic flavors from the majestic valleys of Gilgit-Baltistan, Pakistan.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href={`mailto:${contactData?.contact_info?.email || 'iamkhan6056@gmail.com'}`} 
                className="flex items-center gap-3 text-gray-400 hover:text-emerald-500 transition-colors group"
              >
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{contactData?.contact_info?.email || 'iamkhan6056@gmail.com'}</span>
              </a>
              <a 
                href={`tel:${contactData?.contact_info?.phone || '+923129455315'}`} 
                className="flex items-center gap-3 text-gray-400 hover:text-emerald-500 transition-colors group"
              >
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{contactData?.contact_info?.phone || '+92-3129455315'}</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{contactData?.contact_info?.address || 'Gilgit-Baltistan, Pakistan'}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors text-sm block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Gilgit Bazaar. All rights reserved.
            </p>
            
            {/* Social Links - Fixed */}
            <div className="flex items-center gap-4">
              {Array.isArray(socialLinks) && socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <a 
                    key={social.id || social.platform} 
                    href={social.url} 
                    className="text-gray-400 hover:text-emerald-500 transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))
              ) : (
                // Default social links if none from API
                <>
                  <a href="https://facebook.com" className="text-gray-400 hover:text-emerald-500 transition-colors" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="h-5 w-5" />
                  </a>
                  <a href="https://instagram.com" className="text-gray-400 hover:text-emerald-500 transition-colors" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="h-5 w-5" />
                  </a>
                  <a href="https://linkedin.com" className="text-gray-400 hover:text-emerald-500 transition-colors" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="h-5 w-5" />
                  </a>
                </>
              )}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs mr-2">We accept:</span>
              <div className="flex gap-2">
                {['Cash', 'Stripe'].map((method) => (
                  <div
                    key={method}
                    className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;