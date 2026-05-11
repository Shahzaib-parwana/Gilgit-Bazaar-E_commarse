import { useState } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  ChevronDown,
  CreditCard,
  Home,
  Building2
} from 'lucide-react';

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --ship-midnight: #0a0f1e;
  --ship-navy: #0d1635;
  --ship-navy-2: #131c42;
  --ship-slate: #1e2a4a;
  --ship-gold: #f0a500;
  --ship-gold-lt: #fbbf24;
  --ship-gold-dim: rgba(240,165,0,0.12);
  --ship-gold-bdr: rgba(240,165,0,0.28);
  --ship-muted: #8892aa;
  --ship-border: rgba(255,255,255,0.07);
  --ship-white: #ffffff;
  --ship-green: #4ade80;
  --ship-blue: #3b82f6;
  --ship-red: #ef4444;
  --ship-spring: cubic-bezier(0.34,1.56,0.64,1);
  --ship-ease: cubic-bezier(0.25,0.46,0.45,0.94);
}

.xship {
  background: var(--ship-midnight);
  font-family: 'DM Sans', sans-serif;
  color: var(--ship-white);
  min-height: 100vh;
  padding: 100px 0 80px;
}

.xship-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

/* ══ HEADER ══ */
.xship-header {
  text-align: center;
  margin-bottom: 80px;
  animation: xship-fade-up 0.8s var(--ship-ease) forwards;
}

@keyframes xship-fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.xship-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--ship-gold-dim);
  border: 1px solid var(--ship-gold-bdr);
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ship-gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}

.xship-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1.1;
}

.xship-title span {
  color: var(--ship-gold);
}

.xship-subtitle {
  font-size: 1.25rem;
  color: var(--ship-muted);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ══ QUICK INFO CARDS ══ */
.xship-quick {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 80px;
}

.xship-quick-card {
  background: var(--ship-navy-2);
  border: 1px solid var(--ship-border);
  border-radius: 20px;
  padding: 32px 28px;
  text-align: center;
  transition: all 0.3s var(--ship-spring);
}

.xship-quick-card:hover {
  transform: translateY(-8px);
  border-color: var(--ship-gold-bdr);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}

.xship-quick-icon {
  width: 64px;
  height: 64px;
  background: var(--ship-gold-dim);
  border: 1px solid var(--ship-gold-bdr);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--ship-gold);
}

.xship-quick-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--ship-white);
}

.xship-quick-text {
  font-size: 0.95rem;
  color: var(--ship-muted);
  line-height: 1.5;
}

.xship-quick-highlight {
  display: inline-block;
  color: var(--ship-gold);
  font-weight: 700;
  margin-top: 8px;
}

/* ══ MAIN CONTENT ══ */
.xship-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

/* Sidebar Navigation */
.xship-nav {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.xship-nav-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ship-muted);
  margin-bottom: 16px;
}

.xship-nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.xship-nav-item {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ship-muted);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.xship-nav-item:hover {
  color: var(--ship-white);
  background: var(--ship-navy-2);
}

.xship-nav-item.active {
  background: var(--ship-gold-dim);
  border-color: var(--ship-gold-bdr);
  color: var(--ship-gold);
}

/* Sections */
.xship-sections {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.xship-section {
  scroll-margin-top: 100px;
}

.xship-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.xship-section-title svg {
  color: var(--ship-gold);
}

.xship-section-intro {
  font-size: 1.1rem;
  color: var(--ship-muted);
  line-height: 1.7;
  margin-bottom: 32px;
}

/* ══ DELIVERY ZONES ══ */
.xship-zones {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 32px;
}

.xship-zone-card {
  background: var(--ship-navy-2);
  border: 1px solid var(--ship-border);
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s ease;
}

.xship-zone-card:hover {
  border-color: var(--ship-gold-bdr);
  transform: translateY(-4px);
}

.xship-zone-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.xship-zone-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--ship-white);
  margin-bottom: 4px;
}

.xship-zone-badge {
  background: var(--ship-gold-dim);
  border: 1px solid var(--ship-gold-bdr);
  color: var(--ship-gold);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.xship-zone-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.xship-zone-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
}

.xship-zone-label {
  color: var(--ship-muted);
  font-weight: 500;
}

.xship-zone-value {
  color: var(--ship-white);
  font-weight: 700;
}

.xship-zone-cities {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--ship-border);
}

.xship-zone-cities-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ship-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.xship-zone-cities-list {
  font-size: 0.9rem;
  color: var(--ship-muted);
  line-height: 1.6;
}

/* ══ TIMELINE ══ */
.xship-timeline {
  position: relative;
  padding-left: 40px;
  margin-top: 32px;
}

.xship-timeline::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: var(--ship-border);
}

.xship-timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.xship-timeline-item::before {
  content: '';
  position: absolute;
  left: -34px;
  top: 6px;
  width: 12px;
  height: 12px;
  background: var(--ship-gold);
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--ship-navy-2), 0 0 0 6px var(--ship-gold-bdr);
}

.xship-timeline-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ship-white);
  margin-bottom: 8px;
}

.xship-timeline-desc {
  font-size: 0.95rem;
  color: var(--ship-muted);
  line-height: 1.6;
}

/* ══ FAQ ══ */
.xship-faq {
  margin-top: 32px;
}

.xship-faq-item {
  background: var(--ship-navy-2);
  border: 1px solid var(--ship-border);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.xship-faq-item.open {
  border-color: var(--ship-gold-bdr);
}

.xship-faq-question {
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s ease;
}

.xship-faq-question:hover {
  background: rgba(255,255,255,0.02);
}

.xship-faq-q-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ship-white);
}

.xship-faq-icon {
  color: var(--ship-gold);
  transition: transform 0.3s var(--ship-spring);
}

.xship-faq-item.open .xship-faq-icon {
  transform: rotate(180deg);
}

.xship-faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s var(--ship-ease);
}

.xship-faq-item.open .xship-faq-answer {
  max-height: 500px;
}

.xship-faq-a-content {
  padding: 0 28px 24px;
  font-size: 0.95rem;
  color: var(--ship-muted);
  line-height: 1.7;
}

/* ══ INFO BOXES ══ */
.xship-info-box {
  background: var(--ship-navy-2);
  border: 1px solid var(--ship-border);
  border-left: 4px solid var(--ship-gold);
  border-radius: 12px;
  padding: 24px 28px;
  margin: 24px 0;
  display: flex;
  gap: 16px;
}

.xship-info-box.alert {
  border-left-color: var(--ship-red);
}

.xship-info-box.success {
  border-left-color: var(--ship-green);
}

.xship-info-box-icon {
  flex-shrink: 0;
  color: var(--ship-gold);
}

.xship-info-box.alert .xship-info-box-icon {
  color: var(--ship-red);
}

.xship-info-box.success .xship-info-box-icon {
  color: var(--ship-green);
}

.xship-info-box-content {
  flex: 1;
}

.xship-info-box-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 8px;
  color: var(--ship-white);
}

.xship-info-box-text {
  font-size: 0.95rem;
  color: var(--ship-muted);
  line-height: 1.6;
}

/* ══ CONTACT CTA ══ */
.xship-cta {
  background: var(--ship-navy-2);
  border: 1px solid var(--ship-gold-bdr);
  border-radius: 24px;
  padding: 60px;
  text-align: center;
  margin-top: 80px;
  position: relative;
  overflow: hidden;
}

.xship-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(ellipse 50% 40% at 50% 50%, rgba(240,165,0,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.xship-cta-content {
  position: relative;
  z-index: 1;
}

.xship-cta-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.xship-cta-title span {
  color: var(--ship-gold);
}

.xship-cta-text {
  font-size: 1.1rem;
  color: var(--ship-muted);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.xship-cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.xship-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s var(--ship-spring);
  cursor: pointer;
}

.xship-cta-btn.primary {
  background: var(--ship-gold);
  color: #000;
  border: 2px solid var(--ship-gold);
}

.xship-cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(240,165,0,0.4);
}

.xship-cta-btn.secondary {
  background: transparent;
  color: var(--ship-white);
  border: 2px solid var(--ship-border);
}

.xship-cta-btn.secondary:hover {
  border-color: var(--ship-gold-bdr);
  background: var(--ship-gold-dim);
  color: var(--ship-gold);
}

/* ══ RESPONSIVE ══ */
@media (max-width: 1024px) {
  .xship-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .xship-nav {
    position: static;
  }
  
  .xship-nav-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .xship-zones {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .xship-title {
    font-size: 2.5rem;
  }
  
  .xship-quick {
    grid-template-columns: 1fr;
  }
  
  .xship-section-title {
    font-size: 2rem;
  }
  
  .xship-cta {
    padding: 40px 28px;
  }
  
  .xship-cta-title {
    font-size: 2rem;
  }
  
  .xship-cta-buttons {
    flex-direction: column;
  }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('xship-css')) {
  const el = document.createElement('style');
  el.id = 'xship-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const ShippingInfo = () => {
  const [activeSection, setActiveSection] = useState('delivery');
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Do you deliver to all cities in Pakistan?",
      a: "Yes! We deliver to all major cities and most towns across Pakistan through our courier partners TCS, Leopards, and Pakistan Post. Remote areas may take slightly longer."
    },
    {
      q: "How can I track my order?",
      a: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order on our website or directly on the courier's website."
    },
    {
      q: "What if I'm not available for delivery?",
      a: "Our courier partners will attempt delivery 2-3 times. If unsuccessful, they'll contact you to arrange a convenient time or you can collect from their nearest office."
    },
    {
      q: "Are there any hidden charges?",
      a: "No hidden charges! The price you see at checkout is final. Shipping is FREE on orders above PKR 5,000. For orders below that, standard shipping charges apply."
    },
    {
      q: "Can I change my delivery address after ordering?",
      a: "Yes, but only before the order is dispatched. Contact our support team immediately at +92-321-1234567 to update your address."
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes! COD is available for all orders across Pakistan. Simply select 'Cash on Delivery' at checkout."
    }
  ];

  return (
    <div className="xship">
      <div className="xship-container">
        {/* ════ HEADER ════ */}
        <div className="xship-header">
          <div className="xship-eyebrow">
            <Truck size={16} />
            Nationwide Delivery
          </div>
          <h1 className="xship-title">
            Shipping & <span>Delivery</span>
          </h1>
          <p className="xship-subtitle">
            Fast, reliable delivery across Pakistan. We bring the beauty of Gilgit-Baltistan straight to your doorstep.
          </p>
        </div>

        {/* ════ QUICK INFO ════ */}
        <div className="xship-quick">
          <div className="xship-quick-card">
            <div className="xship-quick-icon">
              <Package size={28} />
            </div>
            <h3 className="xship-quick-title">Free Shipping</h3>
            <p className="xship-quick-text">
              On all orders above
              <span className="xship-quick-highlight">PKR 5,000</span>
            </p>
          </div>
          
          <div className="xship-quick-card">
            <div className="xship-quick-icon">
              <Clock size={28} />
            </div>
            <h3 className="xship-quick-title">Fast Delivery</h3>
            <p className="xship-quick-text">
              2-5 business days in major cities
              <span className="xship-quick-highlight">Nationwide coverage</span>
            </p>
          </div>
          
          <div className="xship-quick-card">
            <div className="xship-quick-icon">
              <ShieldCheck size={28} />
            </div>
            <h3 className="xship-quick-title">Secure Packaging</h3>
            <p className="xship-quick-text">
              All items carefully packed
              <span className="xship-quick-highlight">100% safe delivery</span>
            </p>
          </div>
        </div>

        {/* ════ MAIN CONTENT ════ */}
        <div className="xship-content">
          {/* Sidebar Navigation */}
          <div className="xship-nav">
            <div className="xship-nav-title">Quick Navigation</div>
            <div className="xship-nav-list">
              <div 
                className={`xship-nav-item ${activeSection === 'delivery' ? 'active' : ''}`}
                onClick={() => scrollToSection('delivery')}
              >
                Delivery Zones
              </div>
              <div 
                className={`xship-nav-item ${activeSection === 'process' ? 'active' : ''}`}
                onClick={() => scrollToSection('process')}
              >
                Shipping Process
              </div>
              <div 
                className={`xship-nav-item ${activeSection === 'payment' ? 'active' : ''}`}
                onClick={() => scrollToSection('payment')}
              >
                Payment Options
              </div>
              <div 
                className={`xship-nav-item ${activeSection === 'tracking' ? 'active' : ''}`}
                onClick={() => scrollToSection('tracking')}
              >
                Order Tracking
              </div>
              <div 
                className={`xship-nav-item ${activeSection === 'faq' ? 'active' : ''}`}
                onClick={() => scrollToSection('faq')}
              >
                FAQ
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="xship-sections">
            {/* ════ DELIVERY ZONES ════ */}
            <section id="delivery" className="xship-section">
              <h2 className="xship-section-title">
                <MapPin size={36} />
                Delivery Zones & Timelines
              </h2>
              <p className="xship-section-intro">
                We partner with Pakistan's leading courier services (TCS, Leopards, Pakistan Post) to ensure your order reaches you safely and on time, no matter where you are in Pakistan.
              </p>

              <div className="xship-zones">
                {/* Zone 1 - Major Cities */}
                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">Zone 1 - Major Cities</h3>
                    </div>
                    <div className="xship-zone-badge">2-3 Days</div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Delivery Time:</span>
                      <span className="xship-zone-value">2-3 Business Days</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Shipping Cost:</span>
                      <span className="xship-zone-value">PKR 200</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Free Shipping:</span>
                      <span className="xship-zone-value">Orders above PKR 5,000</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <div className="xship-zone-cities-title">Covered Cities</div>
                    <p className="xship-zone-cities-list">
                      Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Gujranwala, Peshawar, Quetta, Sialkot
                    </p>
                  </div>
                </div>

                {/* Zone 2 - Other Cities */}
                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">Zone 2 - Other Cities</h3>
                    </div>
                    <div className="xship-zone-badge">3-5 Days</div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Delivery Time:</span>
                      <span className="xship-zone-value">3-5 Business Days</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Shipping Cost:</span>
                      <span className="xship-zone-value">PKR 250</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Free Shipping:</span>
                      <span className="xship-zone-value">Orders above PKR 5,000</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <div className="xship-zone-cities-title">Covered Cities</div>
                    <p className="xship-zone-cities-list">
                      Sargodha, Bahawalpur, Sukkur, Larkana, Mardan, Abbottabad, Gujrat, Sahiwal, Jhelum, Rahim Yar Khan, Dera Ghazi Khan
                    </p>
                  </div>
                </div>

                {/* Zone 3 - GB & Remote Areas */}
                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">Zone 3 - GB & AJK</h3>
                    </div>
                    <div className="xship-zone-badge">4-7 Days</div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Delivery Time:</span>
                      <span className="xship-zone-value">4-7 Business Days</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Shipping Cost:</span>
                      <span className="xship-zone-value">PKR 300</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Free Shipping:</span>
                      <span className="xship-zone-value">Orders above PKR 5,000</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <div className="xship-zone-cities-title">Covered Areas</div>
                    <p className="xship-zone-cities-list">
                      Gilgit, Skardu, Hunza, Muzaffarabad, Mirpur, Rawalakot, Chitral, and all Gilgit-Baltistan & AJK regions
                    </p>
                  </div>
                </div>

                {/* Zone 4 - Remote Towns */}
                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">Zone 4 - Remote Areas</h3>
                    </div>
                    <div className="xship-zone-badge">5-10 Days</div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Delivery Time:</span>
                      <span className="xship-zone-value">5-10 Business Days</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Shipping Cost:</span>
                      <span className="xship-zone-value">PKR 350</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Free Shipping:</span>
                      <span className="xship-zone-value">Orders above PKR 7,000</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <div className="xship-zone-cities-title">Covered Areas</div>
                    <p className="xship-zone-cities-list">
                      Remote villages, far-flung areas, and locations with limited courier access
                    </p>
                  </div>
                </div>
              </div>

              <div className="xship-info-box alert">
                <AlertCircle size={24} className="xship-info-box-icon" />
                <div className="xship-info-box-content">
                  <div className="xship-info-box-title">Important Note</div>
                  <p className="xship-info-box-text">
                    Delivery times are estimates and may vary due to weather conditions, public holidays, or courier delays. Remote mountain areas may experience longer delivery times during winter months.
                  </p>
                </div>
              </div>
            </section>

            {/* ════ SHIPPING PROCESS ════ */}
            <section id="process" className="xship-section">
              <h2 className="xship-section-title">
                <Package size={36} />
                Our Shipping Process
              </h2>
              <p className="xship-section-intro">
                From order confirmation to your doorstep, we ensure every step is handled with care.
              </p>

              <div className="xship-timeline">
                <div className="xship-timeline-item">
                  <h3 className="xship-timeline-title">1. Order Confirmation</h3>
                  <p className="xship-timeline-desc">
                    Once you place your order, you'll receive an instant confirmation email with your order details and estimated delivery date.
                  </p>
                </div>

                <div className="xship-timeline-item">
                  <h3 className="xship-timeline-title">2. Quality Check & Packaging</h3>
                  <p className="xship-timeline-desc">
                    Our team carefully inspects each product and packages it securely with bubble wrap and protective materials to ensure it reaches you in perfect condition.
                  </p>
                </div>

                <div className="xship-timeline-item">
                  <h3 className="xship-timeline-title">3. Dispatch & Tracking</h3>
                  <p className="xship-timeline-desc">
                    Your order is handed over to our courier partner (TCS/Leopards). You'll receive a tracking number via SMS and email to monitor your shipment in real-time.
                  </p>
                </div>

                <div className="xship-timeline-item">
                  <h3 className="xship-timeline-title">4. Out for Delivery</h3>
                  <p className="xship-timeline-desc">
                    Once your package reaches your city, the courier will contact you to schedule delivery at your convenience.
                  </p>
                </div>

                <div className="xship-timeline-item">
                  <h3 className="xship-timeline-title">5. Delivered!</h3>
                  <p className="xship-timeline-desc">
                    Your package is delivered to your doorstep. Please inspect the package before signing. If there are any issues, contact us immediately.
                  </p>
                </div>
              </div>

              <div className="xship-info-box success">
                <CheckCircle size={24} className="xship-info-box-icon" />
                <div className="xship-info-box-content">
                  <div className="xship-info-box-title">Quality Guarantee</div>
                  <p className="xship-info-box-text">
                    All products are carefully packed and insured. If your package arrives damaged, we'll replace it or issue a full refund—no questions asked!
                  </p>
                </div>
              </div>
            </section>

            {/* ════ PAYMENT OPTIONS ════ */}
            <section id="payment" className="xship-section">
              <h2 className="xship-section-title">
                <CreditCard size={36} />
                Payment Options
              </h2>
              <p className="xship-section-intro">
                We offer multiple secure payment methods for your convenience.
              </p>

              <div className="xship-zones">
                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">Cash on Delivery (COD)</h3>
                    </div>
                    <div className="xship-zone-badge">Most Popular</div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Availability:</span>
                      <span className="xship-zone-value">All Pakistan</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">COD Charges:</span>
                      <span className="xship-zone-value">PKR 50 (Orders below 3,000)</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <p className="xship-zone-cities-list" style={{marginTop: '12px'}}>
                      Pay in cash when your order is delivered. COD charges waived on orders above PKR 3,000.
                    </p>
                  </div>
                </div>

                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">Online Payment</h3>
                    </div>
                    <div className="xship-zone-badge">Instant</div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Accepted Cards:</span>
                      <span className="xship-zone-value">Visa, Mastercard</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Processing:</span>
                      <span className="xship-zone-value">Secure & Instant</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <p className="xship-zone-cities-list" style={{marginTop: '12px'}}>
                      Pay securely using your debit/credit card. All transactions are encrypted and PCI-DSS compliant.
                    </p>
                  </div>
                </div>

                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">Bank Transfer</h3>
                    </div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Banks:</span>
                      <span className="xship-zone-value">All Major Banks</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Processing:</span>
                      <span className="xship-zone-value">1-2 Business Days</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <p className="xship-zone-cities-list" style={{marginTop: '12px'}}>
                      Transfer to our bank account and share payment proof. Order ships after payment verification.
                    </p>
                  </div>
                </div>

                <div className="xship-zone-card">
                  <div className="xship-zone-header">
                    <div>
                      <h3 className="xship-zone-name">JazzCash / EasyPaisa</h3>
                    </div>
                  </div>
                  <div className="xship-zone-info">
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Mobile Wallets:</span>
                      <span className="xship-zone-value">JazzCash, EasyPaisa</span>
                    </div>
                    <div className="xship-zone-row">
                      <span className="xship-zone-label">Processing:</span>
                      <span className="xship-zone-value">Instant</span>
                    </div>
                  </div>
                  <div className="xship-zone-cities">
                    <p className="xship-zone-cities-list" style={{marginTop: '12px'}}>
                      Pay via your mobile wallet. Share transaction ID and we'll process your order immediately.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ════ ORDER TRACKING ════ */}
            <section id="tracking" className="xship-section">
              <h2 className="xship-section-title">
                <MapPin size={36} />
                Track Your Order
              </h2>
              <p className="xship-section-intro">
                Stay updated on your order status every step of the way.
              </p>

              <div className="xship-info-box">
                <ShieldCheck size={24} className="xship-info-box-icon" />
                <div className="xship-info-box-content">
                  <div className="xship-info-box-title">Real-Time Tracking</div>
                  <p className="xship-info-box-text">
                    Once shipped, you'll receive a tracking number via SMS and email. Track your order on our website or directly on TCS/Leopards tracking portals:
                  </p>
                  <ul style={{marginTop: '12px', paddingLeft: '20px', color: 'var(--ship-muted)'}}>
                    <li style={{marginBottom: '8px'}}>TCS: <a href="https://www.tcsexpress.com/track" target="_blank" rel="noopener noreferrer" style={{color: 'var(--ship-gold)'}}>tcsexpress.com/track</a></li>
                    <li style={{marginBottom: '8px'}}>Leopards: <a href="https://www.leopardscourier.com/track" target="_blank" rel="noopener noreferrer" style={{color: 'var(--ship-gold)'}}>leopardscourier.com/track</a></li>
                    <li>Pakistan Post: <a href="https://ep.gov.pk/track" target="_blank" rel="noopener noreferrer" style={{color: 'var(--ship-gold)'}}>ep.gov.pk/track</a></li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ════ FAQ ════ */}
            <section id="faq" className="xship-section">
              <h2 className="xship-section-title">
                <AlertCircle size={36} />
                Frequently Asked Questions
              </h2>
              
              <div className="xship-faq">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className={`xship-faq-item ${openFaq === index ? 'open' : ''}`}
                  >
                    <div 
                      className="xship-faq-question"
                      onClick={() => toggleFaq(index)}
                    >
                      <div className="xship-faq-q-text">{faq.q}</div>
                      <ChevronDown size={20} className="xship-faq-icon" />
                    </div>
                    <div className="xship-faq-answer">
                      <div className="xship-faq-a-content">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ════ CONTACT CTA ════ */}
        <div className="xship-cta">
          <div className="xship-cta-content">
            <h2 className="xship-cta-title">
              Still Have <span>Questions?</span>
            </h2>
            <p className="xship-cta-text">
              Our customer support team is here to help you with any shipping or delivery queries.
            </p>
            <div className="xship-cta-buttons">
              <a href="tel:+923129455315" className="xship-cta-btn primary">
                <Phone size={18} />
                Call: +92-312-9455315
              </a>
              <a href="mailto:iamkhan6056@gmail.com" className="xship-cta-btn secondary">
                <Mail size={18} />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;