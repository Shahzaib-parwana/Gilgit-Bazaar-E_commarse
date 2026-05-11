import { useState, useEffect } from 'react';
import {
  Mail, Phone, MapPin, Send, Clock, MessageCircle,
  Share2, Users, CheckCircle, ArrowRight, Zap,
  ChevronDown, Star, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import contactService from '../services/contactService';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter
} from "react-icons/fa";

/* ─── Styles ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --midnight: #0a0f1e;
    --navy:     #0d1635;
    --navy-2:   #131c42;
    --slate:    #1e2a4a;
    --gold:     #f0a500;
    --gold-lt:  #fbbf24;
    --gold-dim: rgba(240,165,0,0.11);
    --gold-bdr: rgba(240,165,0,0.24);
    --muted:    #8892aa;
    --border:   rgba(255,255,255,0.07);
    --white:    #fff;
    --green:    #4ade80;
  }

  /* ── Base ── */
  .ct { background: var(--midnight); color: var(--white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  /* ── Animations ── */
  @keyframes ct-up    { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ct-left  { from { opacity:0; transform:translateX(-32px);} to { opacity:1; transform:translateX(0); } }
  @keyframes ct-right { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
  @keyframes ct-in    { from { opacity:0; }                              to { opacity:1; } }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ring-grow{ 0%{transform:scale(1); opacity:.5} 100%{transform:scale(1.7); opacity:0} }
  @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

  .u { opacity:0; animation: ct-up   .7s cubic-bezier(.16,1,.3,1) forwards; }
  .l { opacity:0; animation: ct-left .7s cubic-bezier(.16,1,.3,1) forwards; }
  .r { opacity:0; animation: ct-right .7s cubic-bezier(.16,1,.3,1) forwards; }
  .fi{ opacity:0; animation: ct-in   .6s ease forwards; }
  .d1{animation-delay:.06s}.d2{animation-delay:.16s}.d3{animation-delay:.28s}
  .d4{animation-delay:.40s}.d5{animation-delay:.54s}.d6{animation-delay:.68s}

  /* ── Shared ── */
  .section { padding: 88px 0; }
  .si { max-width: 1280px; margin: 0 auto; padding: 0 36px; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: .72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: .12em; color: var(--gold); margin-bottom: 14px;
  }
  .eyebrow::before, .eyebrow::after { content:''; width:24px; height:1px; background:var(--gold); opacity:.5; }

  /* ════════════════════════════
     HERO
  ════════════════════════════ */
  .ct-hero {
    position: relative; overflow: hidden; min-height: 72vh;
    display: flex; align-items: center;
    background: radial-gradient(ellipse 90% 80% at 55% 45%, #17225a 0%, var(--midnight) 68%);
  }
  .ct-hero::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23f0a500' fill-opacity='0.035'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* decorative arcs */
  .ct-arcs {
    position: absolute; right: -80px; bottom: -80px;
    width: 500px; height: 500px; pointer-events: none;
  }
  .ct-arc {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(240,165,0,.07);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
  }

  .ct-hero-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto; padding: 0 36px;
    display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: center; width: 100%;
  }

  /* hero left */
  .ct-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    color: var(--gold); padding: 6px 16px; border-radius: 100px;
    font-size: .78rem; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; margin-bottom: 22px;
  }
  .ct-hero-badge .dot { width: 7px; height: 7px; background: var(--gold); border-radius: 50%; animation: pulse 1.6s ease infinite; }

  .ct-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 5.5vw, 4.6rem); font-weight: 900;
    line-height: 1.08; color: var(--white); margin-bottom: 20px;
  }
  .ct-hero h1 em { font-style: italic; color: var(--gold); }
  .ct-hero-sub { color: var(--muted); font-size: 1.06rem; line-height: 1.75; margin-bottom: 36px; max-width: 500px; }

  /* response-time pills */
  .ct-response-pills { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }
  .ct-rpill {
    display: flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.05); border: 1px solid var(--border);
    border-radius: 100px; padding: 7px 15px;
    font-size: .8rem; color: var(--muted); font-weight: 500;
  }
  .ct-rpill svg { color: var(--gold); }

  /* quick contact anchors */
  .ct-quick-links { display: flex; gap: 12px; flex-wrap: wrap; }
  .ct-qlink {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--navy); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 10px 18px;
    color: var(--muted); font-size: .87rem; font-weight: 600;
    text-decoration: none; transition: all .25s;
  }
  .ct-qlink:hover { border-color: var(--gold-bdr); color: var(--gold); background: var(--gold-dim); }
  .ct-qlink svg { flex-shrink: 0; }

  /* hero visual */
  .ct-hero-visual { display: flex; flex-direction: column; gap: 14px; animation: float 4.5s ease-in-out infinite; }
  .ct-vis-card {
    background: rgba(13,22,53,.88); backdrop-filter: blur(18px);
    border: 1.5px solid var(--border); border-radius: 20px;
    padding: 22px; transition: border-color .3s;
  }
  .ct-vis-card:hover { border-color: var(--gold-bdr); }
  .ct-vis-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .ct-vis-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ct-vis-icon svg { color: var(--gold); }
  .ct-vis-card-header h4 { font-weight: 700; font-size: .92rem; color: var(--white); }
  .ct-vis-card-header span { font-size: .73rem; color: var(--muted); margin-top: 1px; }
  .ct-vis-detail { color: var(--gold); font-size: .88rem; font-weight: 600; }
  .ct-vis-sub { color: var(--muted); font-size: .75rem; margin-top: 3px; }

  /* online indicator */
  .ct-online {
    display: flex; align-items: center; gap: 8px;
    background: rgba(74,222,128,.08); border: 1px solid rgba(74,222,128,.2);
    border-radius: 12px; padding: 12px 16px;
  }
  .ct-online-dot { position: relative; flex-shrink: 0; }
  .ct-online-dot-inner { width: 10px; height: 10px; background: var(--green); border-radius: 50%; position: relative; z-index: 1; }
  .ct-online-ring {
    position: absolute; inset: -3px; border-radius: 50%;
    border: 1.5px solid var(--green); opacity: .5;
    animation: ring-grow 1.8s ease infinite;
  }
  .ct-online-text { font-size: .82rem; color: rgba(255,255,255,.75); font-weight: 500; }
  .ct-online-text strong { color: var(--green); }

  /* ════════════════════════════
     MAIN CONTENT GRID
  ════════════════════════════ */
  .ct-main { max-width: 1280px; margin: 0 auto; padding: 64px 36px 0; display: grid; grid-template-columns: 1fr 1.55fr; gap: 40px; }

  /* ── INFO COLUMN ── */
  .ct-info-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700; color: var(--white); margin-bottom: 10px;
  }
  .ct-info-title em { font-style: italic; color: var(--gold); }
  .ct-info-sub { color: var(--muted); line-height: 1.7; font-size: .95rem; margin-bottom: 32px; }

  /* contact channel cards */
  .ct-channel {
    display: flex; align-items: flex-start; gap: 16px;
    background: var(--navy-2); border: 1.5px solid var(--border);
    border-radius: 18px; padding: 20px;
    margin-bottom: 14px; text-decoration: none;
    transition: all .32s cubic-bezier(.34,1.1,.64,1);
    position: relative; overflow: hidden;
  }
  .ct-channel::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 0% 50%, rgba(240,165,0,.06), transparent 65%);
    opacity: 0; transition: opacity .35s ease;
  }
  .ct-channel:hover::before { opacity: 1; }
  .ct-channel:hover {
    border-color: var(--gold-bdr); transform: translateX(6px);
    box-shadow: 0 8px 28px rgba(0,0,0,.35);
  }
  .ct-ch-icon {
    width: 52px; height: 52px; border-radius: 15px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all .3s ease; position: relative; z-index: 1;
  }
  .ct-channel:hover .ct-ch-icon { background: var(--gold); }
  .ct-ch-icon svg { color: var(--gold); transition: color .3s; }
  .ct-channel:hover .ct-ch-icon svg { color: #000; }
  .ct-ch-body { position: relative; z-index: 1; }
  .ct-ch-body h3 { font-weight: 700; font-size: .93rem; color: var(--white); margin-bottom: 4px; }
  .ct-ch-detail { color: var(--gold); font-weight: 600; font-size: .88rem; margin-bottom: 3px; }
  .ct-ch-sub { color: var(--muted); font-size: .75rem; }
  .ct-ch-arrow {
    margin-left: auto; color: var(--muted); flex-shrink: 0;
    opacity: 0; transform: translateX(-6px);
    transition: all .25s; position: relative; z-index: 1; align-self: center;
  }
  .ct-channel:hover .ct-ch-arrow { opacity: 1; transform: translateX(0); color: var(--gold); }

  /* hours card */
  .ct-hours {
    background: var(--navy-2); border: 1.5px solid var(--border);
    border-radius: 18px; padding: 24px; margin-bottom: 14px;
  }
  .ct-hours-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
  }
  .ct-hours-header .ico {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    display: flex; align-items: center; justify-content: center;
  }
  .ct-hours-header .ico svg { color: var(--gold); }
  .ct-hours-header h3 { font-weight: 700; font-size: .93rem; color: var(--white); }
  .ct-hours-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.05);
    font-size: .87rem;
  }
  .ct-hours-row:last-child { border: none; padding-bottom: 0; }
  .ct-hours-row .day { color: var(--muted); font-weight: 500; }
  .ct-hours-row .time { color: rgba(255,255,255,.8); font-weight: 600; }
  .ct-hours-row .closed { color: #f87171; font-weight: 600; }
  .ct-hours-row .badge {
    font-size: .65rem; background: rgba(74,222,128,.12); color: var(--green);
    border: 1px solid rgba(74,222,128,.2); border-radius: 100px; padding: 2px 8px; font-weight: 700;
  }

  /* socials */
  .ct-social-row { display: flex; gap: 10px; margin-top: 4px; }
  .ct-soc {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--navy-2); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); text-decoration: none;
    transition: all .25s cubic-bezier(.34,1.2,.64,1);
  }
  .ct-soc:hover {
    border-color: var(--gold-bdr); color: var(--gold);
    background: var(--gold-dim); transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(240,165,0,.2);
  }

  /* ── FORM COLUMN ── */
  .ct-form-card {
    background: var(--navy-2); border: 1.5px solid var(--border);
    border-radius: 24px; padding: 36px;
    position: relative; overflow: hidden;
  }
  .ct-form-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--gold-lt), var(--gold));
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  .ct-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; font-weight: 700; color: var(--white); margin-bottom: 6px;
  }
  .ct-form-title em { font-style: italic; color: var(--gold); }
  .ct-form-sub { color: var(--muted); font-size: .87rem; margin-bottom: 28px; line-height: 1.6; }

  /* subject type selector */
  .ct-type-selector { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 26px; }
  .ct-type-btn {
    padding: 7px 16px; border-radius: 100px;
    border: 1.5px solid var(--border); background: none;
    color: var(--muted); font-size: .8rem; font-weight: 600;
    cursor: pointer; transition: all .2s; font-family: 'DM Sans', sans-serif;
  }
  .ct-type-btn:hover { border-color: var(--gold-bdr); color: var(--gold); }
  .ct-type-btn.active { border-color: var(--gold); color: #000; background: var(--gold); }

  /* form grid */
  .ct-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ct-fgroup { margin-bottom: 20px; }
  .ct-fgroup label {
    display: flex; align-items: center; gap: 4px;
    font-size: .82rem; font-weight: 600; color: var(--white);
    margin-bottom: 8px;
  }
  .ct-fgroup label .req { color: var(--gold); }
  .ct-input, .ct-textarea, .ct-select {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,.05); border: 1.5px solid var(--border);
    border-radius: 12px; color: var(--white);
    font-family: 'DM Sans', sans-serif; font-size: .9rem; outline: none;
    transition: all .22s ease;
    box-sizing: border-box;
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color: var(--muted); }
  .ct-input:focus, .ct-textarea:focus, .ct-select:focus {
    border-color: var(--gold-bdr);
    background: rgba(240,165,0,.05);
    box-shadow: 0 0 0 3px rgba(240,165,0,.08);
  }
  .ct-select { -webkit-appearance: none; appearance: none; cursor: pointer; }
  .ct-select option { background: var(--navy-2); color: var(--white); }
  .ct-textarea { resize: vertical; min-height: 130px; }

  /* character count */
  .ct-char { font-size: .72rem; color: var(--muted); text-align: right; margin-top: 4px; }

  /* privacy note */
  .ct-privacy {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,.03); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 14px; margin-bottom: 20px;
    font-size: .78rem; color: var(--muted);
  }
  .ct-privacy svg { color: var(--gold); flex-shrink: 0; }

  /* submit button */
  .ct-submit {
    width: 100%; padding: 14px 24px;
    background: var(--gold); color: #000; border: none;
    border-radius: 14px; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 1rem;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: all .28s cubic-bezier(.34,1.2,.64,1);
  }
  .ct-submit::after {
    content: ''; position: absolute; inset: 0;
    background: var(--gold-lt); transform: scaleX(0); transform-origin: left;
    transition: transform .35s ease; z-index: 0;
  }
  .ct-submit:not(:disabled):hover::after { transform: scaleX(1); }
  .ct-submit:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(240,165,0,.38);
  }
  .ct-submit:not(:disabled):active { transform: scale(.98); }
  .ct-submit span, .ct-submit svg { position: relative; z-index: 1; }
  .ct-submit:disabled { opacity: .55; cursor: not-allowed; }
  .ct-spinner { animation: spin 1s linear infinite; }

  /* ════════════════════════════
     MAP
  ════════════════════════════ */
  .ct-map-wrap { max-width: 1280px; margin: 48px auto 0; padding: 0 36px 80px; }
  .ct-map-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
  .ct-map-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: var(--white); }
  .ct-map-title em { font-style: italic; color: var(--gold); }
  .ct-map-sub { color: var(--muted); font-size: .87rem; margin-top: 4px; }
  .ct-map-link {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    color: var(--gold); padding: 8px 18px; border-radius: 10px;
    font-size: .83rem; font-weight: 700; text-decoration: none;
    transition: all .2s;
  }
  .ct-map-link:hover { background: var(--gold); color: #000; }
  .ct-map-card {
    background: var(--navy-2); border: 1.5px solid var(--border);
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 24px 56px rgba(0,0,0,.45);
  }
  .ct-map-card iframe { width: 100%; height: 400px; display: block; border: none; filter: invert(90%) hue-rotate(190deg) saturate(.8); }
  .ct-map-footer {
    display: flex; gap: 20px; padding: 18px 24px; flex-wrap: wrap;
    border-top: 1px solid var(--border);
  }
  .ct-map-info {
    display: flex; align-items: center; gap: 8px;
    font-size: .83rem; color: var(--muted);
  }
  .ct-map-info svg { color: var(--gold); }
  .ct-map-info strong { color: var(--white); }

  /* ════════════════════════════
     RESPONSIVE
  ════════════════════════════ */
  @media(max-width:1100px) {
    .ct-hero-inner { grid-template-columns: 1fr; text-align: center; }
    .ct-hero-visual { display: none; }
    .ct-hero-sub { margin: 0 auto 32px; }
    .ct-response-pills, .ct-quick-links { justify-content: center; }
    .ct-main { grid-template-columns: 1fr; }
  }
  @media(max-width:720px) {
    .ct-form-row { grid-template-columns: 1fr; }
    .si { padding: 0 20px; }
    .ct-main { padding: 40px 20px 0; }
    .ct-map-wrap { padding: 0 20px 60px; }
    .ct-form-card { padding: 24px; }
    .ct-hero-inner { padding: 0 20px; }
  }
`;

/* Icon mapping */
const iconMap = {
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  Send: Send,
  Clock: Clock,
  MessageCircle: MessageCircle,
  Share2: Share2,
  Users: Users,
  CheckCircle: CheckCircle,
  ArrowRight: ArrowRight,
  Zap: Zap,
  ChevronDown: ChevronDown,
  Star: Star,
  Shield: Shield
};

const Contact = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [type, setType] = useState('General Inquiry');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // Fetch contact data from backend
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

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    const formData = {
      ...form,
      subject_type: type,
      subject: form.subject || `${type} inquiry`
    };
    
    const result = await contactService.submitContactForm(formData);
    
    if (result.success) {
      toast.success(contactData?.form_settings?.success_toast_message || "Message sent! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } else {
      toast.error(result.error || "Failed to send message. Please try again.");
    }
    
    setFormSubmitting(false);
  };

  const getIconComponent = (iconName) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon /> : <Phone />;
  };

    const getSocialIcon = (platform) => {
      const icons = {
        fafacebook: FaFacebook,
        fainstagram: FaInstagram,
        falinkedin: FaLinkedin,
        fayoutube: FaYoutube,
        fatwitter: FaTwitter,
      };
      const IconComponent = icons[platform?.toLowerCase()];
      return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
    };

  if (loading) {
    return (
      <div className="ct">
        <style>{CSS}</style>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--midnight)'
        }}>
          <div style={{ textAlign: 'center', color: 'var(--gold)' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="ct">
        <style>{CSS}</style>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--midnight)'
        }}>
          <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
            <p style={{ marginBottom: '20px' }}>{error || 'Failed to load content'}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '10px 20px', 
                background: 'var(--gold)', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#000',
                fontWeight: 'bold'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { hero, channels, hours, social_links, form_settings, map_settings, settings } = contactData;

  const maxMessageLength = form_settings?.max_message_length || 500;
  const charsLeft = maxMessageLength - form.message.length;
  const subjectTypes = form_settings?.subject_types || ['General Inquiry', 'Order Support', 'Partnership', 'Artisan Program', 'Press'];

  return (
    <div className="ct">
      <style>{CSS}</style>

      {/* ══ HERO ══ */}
      <section className="ct-hero">
        <div className="ct-arcs" aria-hidden="true">
          {[120, 220, 320, 420].map(s => (
            <div key={s} className="ct-arc" style={{ width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2 }} />
          ))}
        </div>

        <div className="ct-hero-inner">
          <div>
            {hero?.badge_text && (
              <div className="ct-hero-badge u d1">
                <span className="dot" /> {hero.badge_text}
              </div>
            )}
            <h1 className="u d2">
              {hero?.title_line_1 || "Let's"} <em>{hero?.title_highlight || "Start<br />a Conversation"}</em>
            </h1>
            <p className="ct-hero-sub u d3">
              {hero?.subtitle || "Questions about an order, a product, or want to become an artisan partner? Our dedicated team is ready to help — fast, friendly, and from the heart."}
            </p>

            {hero?.response_pills && hero.response_pills.length > 0 && (
              <div className="ct-response-pills u d4">
                {hero.response_pills.map((pill, idx) => {
                  const iconMap = { 'Avg. reply': Zap, 'satisfaction': CheckCircle, 'Secure': Shield };
                  const Icon = idx === 0 ? Zap : idx === 1 ? CheckCircle : Shield;
                  return (
                    <span className="ct-rpill" key={idx}>
                      <Icon size={12} /> {pill}
                    </span>
                  );
                })}
              </div>
            )}

            {hero?.quick_links && hero.quick_links.length > 0 && (
              <div className="ct-quick-links u d5">
                {hero.quick_links.map((link, idx) => {
                  const LinkIcon = iconMap[link.icon] || Send;
                  return (
                    <a href={link.link} className="ct-qlink" key={idx}>
                      <LinkIcon size={14} /> {link.text}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="ct-hero-visual fi d3">
            {hero?.hero_cards && hero.hero_cards.map((card, idx) => {
              const CardIcon = iconMap[card.icon] || Phone;
              return (
                <div className="ct-vis-card" key={idx}>
                  <div className="ct-vis-card-header">
                    <div className="ct-vis-icon"><CardIcon size={18} /></div>
                    <div>
                      <h4>{card.title}</h4>
                      <span>{card.sub}</span>
                    </div>
                  </div>
                  <div className="ct-vis-detail">{card.detail}</div>
                </div>
              );
            })}
            <div className="ct-online">
              <div className="ct-online-dot">
                <div className="ct-online-dot-inner" />
                <div className="ct-online-ring" />
              </div>
              <div className="ct-online-text">
                {hero?.online_indicator_text?.split(hero?.online_indicator_highlight || "online now")[0]}
                <strong>{hero?.online_indicator_highlight || "online now"}</strong>
                {hero?.online_indicator_text?.split(hero?.online_indicator_highlight || "online now")[1]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAIN GRID ══ */}
      <div className="ct-main">
        <div className="l d1">
          <div className="eyebrow" style={{ marginBottom: 14 }}>{settings?.info_column_eyebrow || "Contact"}</div>
          <h2 className="ct-info-title">
            {settings?.info_column_title_prefix || "Get in"} <em>{settings?.info_column_title_highlight || "Touch"}</em>
          </h2>
          <p className="ct-info-sub">
            {settings?.info_column_subtitle || "Whether it's a question, feedback, or a fresh partnership idea — pick the channel that works best for you."}
          </p>

          {channels && channels.map((channel) => (
            <a href={channel.href} className="ct-channel" key={channel.id}>
              <div className="ct-ch-icon">{getIconComponent(channel.icon_name)}</div>
              <div className="ct-ch-body">
                <h3>{channel.title}</h3>
                <div className="ct-ch-detail">{channel.detail}</div>
                <div className="ct-ch-sub">{channel.subtitle}</div>
              </div>
              <ArrowRight size={16} className="ct-ch-arrow" />
            </a>
          ))}

          <div className="ct-hours">
            <div className="ct-hours-header">
              <div className="ico"><Clock size={16} /></div>
              <h3>{settings?.hours_section_title || "Business Hours"}</h3>
            </div>
            {hours && hours.map((hour, idx) => (
              <div className="ct-hours-row" key={hour.id || idx}>
                <span className="day">{hour.day}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {hour.status === 'open'
                    ? <><span className="time">{hour.time}</span><span className="badge">Open</span></>
                    : <span className="closed">{hour.time}</span>
                  }
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <p style={{ fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', fontWeight: 700, marginBottom: 12 }}>
              {settings?.social_section_title || "Follow Us"}
            </p>
            <div className="ct-social-row">
              {social_links && social_links.map((social) => (
                <a href={social.url} className="ct-soc" key={social.id} target="_blank" rel="noopener noreferrer">
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="r d2" id="form">
          <div className="eyebrow" style={{ marginBottom: 14 }}>{form_settings?.section_eyebrow || "Message Us"}</div>
          <div className="ct-form-card">
            <h2 className="ct-form-title">
              {form_settings?.title_prefix || "Send a"} <em>{form_settings?.title_highlight || "Message"}</em>
            </h2>
            <p className="ct-form-sub">
              {form_settings?.subtitle || "Fill out the form below and our team will get back to you within 24 hours."}
            </p>

            <div className="ct-type-selector">
              {subjectTypes.map((t) => (
                <button
                  key={t}
                  className={`ct-type-btn${type === t ? ' active' : ''}`}
                  onClick={() => setType(t)}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit}>
              <div className="ct-form-row">
                <div className="ct-fgroup">
                  <label>{form_settings?.name_label || "Full Name"} <span className="req">*</span></label>
                  <input 
                    className="ct-input" 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={onChange} 
                    required 
                    placeholder={form_settings?.name_placeholder || "e.g. Ahmed Raza"} 
                  />
                </div>
                <div className="ct-fgroup">
                  <label>{form_settings?.email_label || "Email Address"} <span className="req">*</span></label>
                  <input 
                    className="ct-input" 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={onChange} 
                    required 
                    placeholder={form_settings?.email_placeholder || "hello@example.com"} 
                  />
                </div>
              </div>

              <div className="ct-fgroup">
                <label>{form_settings?.subject_label || "Subject"} <span className="req">*</span></label>
                <input 
                  className="ct-input" 
                  type="text" 
                  name="subject" 
                  value={form.subject} 
                  onChange={onChange} 
                  required 
                  placeholder={form_settings?.subject_placeholder?.replace('{type}', type) || `${type} — describe briefly`} 
                />
              </div>

              <div className="ct-fgroup">
                <label>{form_settings?.message_label || "Message"} <span className="req">*</span></label>
                <textarea
                  className="ct-textarea" 
                  name="message" 
                  value={form.message}
                  onChange={onChange} 
                  required
                  maxLength={maxMessageLength}
                  placeholder={form_settings?.message_placeholder || "Tell us exactly how we can help you…"}
                />
                <div className="ct-char" style={{ color: charsLeft < 50 ? '#f87171' : 'var(--muted)' }}>
                  {charsLeft} characters remaining
                </div>
              </div>

              <div className="ct-privacy">
                <Shield size={14} />
                {form_settings?.privacy_text || "Your data is protected and will never be shared with third parties."}
              </div>

              <button type="submit" className="ct-submit" disabled={formSubmitting}>
                {formSubmitting ? (
                  <>
                    <svg className="ct-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    <span>{form_settings?.button_loading_text || "Sending your message…"}</span>
                  </>
                ) : sent ? (
                  <><CheckCircle size={18} /><span>{form_settings?.button_sent_text || "Message Sent! ✓"}</span></>
                ) : (
                  <><Send size={17} /><span>{form_settings?.button_default_text || "Send Message"}</span><ArrowRight size={15} style={{ opacity: .7 }} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ══ MAP ══ */}
      <div className="ct-map-wrap u d3" id="map">
        <div className="ct-map-header">
          <div>
            <h2 className="ct-map-title">
              {map_settings?.title_prefix || "Find"} <em>{map_settings?.title_highlight || "Us"}</em>
            </h2>
            <p className="ct-map-sub">{map_settings?.subtitle || "Operating from the stunning highlands of northern Pakistan"}</p>
          </div>
          <a
            href={map_settings?.map_link_url || "https://maps.google.com/?q=Gilgit-Baltistan,Pakistan"}
            target="_blank"
            rel="noopener noreferrer"
            className="ct-map-link"
          >
            <MapPin size={14} /> {map_settings?.map_link_text || "Open in Maps"}
          </a>
        </div>

        <div className="ct-map-card">
          <iframe
            src={map_settings?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211174.78!2d74.3!3d35.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e649c0aa418e67%3A0x87b2ed80018aa1e8!2sGilgit-Baltistan%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Gilgit-Baltistan Map"
          />
          <div className="ct-map-footer">
            {map_settings?.map_footer_items && map_settings.map_footer_items.map((item, idx) => {
              const FooterIcon = iconMap[item.icon] || MapPin;
              return (
                <div className="ct-map-info" key={idx}>
                  <FooterIcon size={14} />
                  {item.location && <strong>{item.location}</strong>}
                  {item.label && ` · ${item.label}`}
                  {item.hours && `${item.hours} `}
                  {item.label2 && <strong>{item.label2}</strong>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;