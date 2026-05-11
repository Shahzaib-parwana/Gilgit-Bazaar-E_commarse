import { Users, Target, Award, Heart, MapPin, Calendar, Shield, Star, TrendingUp, Clock, Share2, ArrowRight, Quote, CheckCircle, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import aboutService from '../services/aboutService';

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
  }

  /* ── Base ── */
  .ab { background: var(--midnight); color: var(--white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  /* ── Animations ── */
  @keyframes ab-up   { from { opacity:0; transform:translateY(36px);  } to { opacity:1; transform:translateY(0); } }
  @keyframes ab-in   { from { opacity:0; }                               to { opacity:1; } }
  @keyframes ab-left { from { opacity:0; transform:translateX(-36px); } to { opacity:1; transform:translateX(0); } }
  @keyframes ab-right{ from { opacity:0; transform:translateX(36px);  } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes spin-slow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes counter-glow { 0%,100%{text-shadow:0 0 20px rgba(240,165,0,.3)} 50%{text-shadow:0 0 40px rgba(240,165,0,.65)} }
  @keyframes shimmer-line { from{background-position:-200% 0} to{background-position:200% 0} }
  @keyframes timeline-draw { from{width:0} to{width:100%} }

  .fade-up   { opacity:0; animation: ab-up   .72s cubic-bezier(.16,1,.3,1) forwards; }
  .fade-in   { opacity:0; animation: ab-in   .6s  ease forwards; }
  .fade-left { opacity:0; animation: ab-left .72s cubic-bezier(.16,1,.3,1) forwards; }
  .fade-right{ opacity:0; animation: ab-right .72s cubic-bezier(.16,1,.3,1) forwards; }
  .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.30s}
  .d4{animation-delay:.42s}.d5{animation-delay:.56s}.d6{animation-delay:.70s}

  /* ── Shared section helpers ── */
  .section { padding: 90px 0; }
  .section-inner { max-width: 1280px; margin: 0 auto; padding: 0 36px; }
  .section-head { text-align: center; margin-bottom: 56px; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: .72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: .12em; color: var(--gold); margin-bottom: 14px;
  }
  .eyebrow::before, .eyebrow::after {
    content: ''; width: 28px; height: 1px; background: var(--gold); opacity: .5;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 900;
    color: var(--white); line-height: 1.12; margin-bottom: 14px;
  }
  .section-title em { font-style: normal; color: var(--gold); }
  .section-sub { color: var(--muted); font-size: 1rem; max-width: 560px; margin: 0 auto; line-height: 1.7; }

  /* ══════════════════════════════
     HERO
  ══════════════════════════════ */
  .ab-hero {
    position: relative; overflow: hidden;
    min-height: 88vh; display: flex; align-items: center;
    background: radial-gradient(ellipse 90% 80% at 55% 45%, #17225a 0%, var(--midnight) 68%);
  }
  /* grid texture */
  .ab-hero::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23f0a500' fill-opacity='0.035'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  /* decorative spinning ring */
  .ab-hero-ring {
    position: absolute; right: -120px; top: 50%; transform: translateY(-50%);
    width: 640px; height: 640px; border-radius: 50%;
    border: 1px solid rgba(240,165,0,.07);
    pointer-events: none;
  }
  .ab-hero-ring::before {
    content: ''; position: absolute; inset: 40px; border-radius: 50%;
    border: 1px solid rgba(240,165,0,.05);
  }
  .ab-hero-ring::after {
    content: ''; position: absolute; inset: 100px; border-radius: 50%;
    border: 1px dashed rgba(240,165,0,.06);
    animation: spin-slow 40s linear infinite;
  }

  .ab-hero-inner {
    position: relative; z-index: 2;
    max-width: 1280px; margin: 0 auto; padding: 0 36px;
    display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: center;
  }
  .ab-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    color: var(--gold); padding: 6px 16px; border-radius: 100px;
    font-size: .78rem; font-weight: 700; letter-spacing: .06em;
    text-transform: uppercase; margin-bottom: 22px;
  }
  .ab-hero-badge .dot { width: 7px; height: 7px; background: var(--gold); border-radius: 50%; animation: pulse 1.6s ease infinite; }

  .ab-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 5.5vw, 4.8rem); font-weight: 900;
    line-height: 1.07; color: var(--white); margin-bottom: 22px;
  }
  .ab-hero h1 em { font-style: italic; color: var(--gold); }
  .ab-hero-sub { color: var(--muted); font-size: 1.08rem; line-height: 1.75; margin-bottom: 36px; max-width: 500px; }

  .ab-hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 44px; }
  .btn-gold {
    display: inline-flex; align-items: center; gap: 9px;
    background: var(--gold); color: #000; padding: 13px 26px;
    border-radius: 12px; font-weight: 700; font-size: .95rem;
    text-decoration: none; transition: all .25s;
  }
  .btn-gold:hover { background: var(--gold-lt); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(240,165,0,.35); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 9px;
    border: 1.5px solid rgba(255,255,255,.15); color: var(--white);
    padding: 13px 26px; border-radius: 12px; font-weight: 600;
    font-size: .95rem; text-decoration: none; transition: all .25s;
  }
  .btn-ghost:hover { border-color: var(--gold-bdr); color: var(--gold); }

  /* trust pills */
  .ab-trust-pills { display: flex; gap: 10px; flex-wrap: wrap; }
  .trust-pill {
    display: flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.05); border: 1px solid var(--border);
    border-radius: 100px; padding: 6px 14px; font-size: .8rem;
    color: var(--muted); font-weight: 500;
  }
  .trust-pill svg { color: var(--gold); }

  /* hero image stack */
  .ab-hero-visual { position: relative; animation: float 5s ease-in-out infinite; }
  .ab-hero-img-main {
    width: 100%; border-radius: 24px; object-fit: cover;
    aspect-ratio: 4/3;
    border: 1.5px solid rgba(240,165,0,.15);
    box-shadow: 0 32px 72px rgba(0,0,0,.55);
  }
  .ab-hero-img-wrap::before {
    content: ''; position: absolute; inset: -2px; border-radius: 26px;
    background: linear-gradient(135deg, rgba(240,165,0,.3), transparent 55%); z-index: -1;
  }
  .ab-hero-img-wrap { position: relative; }
  .ab-float-card {
    position: absolute;
    background: rgba(13,22,53,.88); backdrop-filter: blur(16px);
    border: 1px solid rgba(240,165,0,.18); border-radius: 16px;
    padding: 14px 18px;
  }
  .ab-float-card.tl { top: -18px; left: -18px; }
  .ab-float-card.br { bottom: -18px; right: -18px; }
  .ab-float-card .val { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: var(--gold); line-height: 1; }
  .ab-float-card .lbl { font-size: .72rem; color: var(--muted); margin-top: 3px; }

  /* ══════════════════════════════
     STORY
  ══════════════════════════════ */
  .story-bg { background: var(--navy); }
  .story-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .story-img-wrap { position: relative; }
  .story-img {
    width: 100%; border-radius: 22px; object-fit: cover; aspect-ratio: 4/3;
    display: block; transition: transform .5s ease;
  }
  .story-img-wrap:hover .story-img { transform: scale(1.02); }
  .story-img-border {
    position: absolute; inset: -3px; border-radius: 24px;
    background: linear-gradient(135deg, var(--gold), transparent 60%); z-index: -1;
  }
  .story-img-badge {
    position: absolute; bottom: 20px; left: 20px;
    background: rgba(10,15,30,.9); backdrop-filter: blur(12px);
    border: 1px solid var(--gold-bdr); border-radius: 14px;
    padding: 12px 18px;
  }
  .story-img-badge .sv { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--gold); font-weight: 700; }
  .story-img-badge .sl { font-size: .73rem; color: var(--muted); margin-top: 2px; }

  .story-text { }
  .story-text h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.9rem, 3.5vw, 2.6rem); font-weight: 700;
    color: var(--white); margin-bottom: 24px; line-height: 1.2;
  }
  .story-text h2 em { font-style: italic; color: var(--gold); }
  .story-text p { color: rgba(255,255,255,.75); line-height: 1.8; margin-bottom: 18px; font-size: .97rem; }

  /* quote block */
  .story-quote {
    border-left: 2px solid var(--gold); padding-left: 20px; margin: 28px 0;
    position: relative;
  }
  .story-quote p { font-style: italic; color: rgba(255,255,255,.85); margin: 0; font-size: 1rem; }
  .story-quote svg { position: absolute; top: -8px; left: -12px; color: var(--gold); opacity: .5; }

  /* checkmarks */
  .story-checks { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
  .story-check { display: flex; align-items: center; gap: 10px; font-size: .9rem; color: rgba(255,255,255,.8); }
  .story-check svg { color: var(--gold); flex-shrink: 0; }

  /* ══════════════════════════════
     VALUES
  ══════════════════════════════ */
  .values-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }
  .value-card {
    background: var(--navy-2); border: 1.5px solid var(--border);
    border-radius: 22px; padding: 36px 26px; text-align: center;
    transition: all .35s cubic-bezier(.34,1.1,.64,1);
    position: relative; overflow: hidden;
  }
  .value-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(240,165,0,.07), transparent 70%);
    opacity: 0; transition: opacity .35s ease;
  }
  .value-card:hover::before { opacity: 1; }
  .value-card:hover {
    border-color: var(--gold-bdr); transform: translateY(-8px);
    box-shadow: 0 20px 44px rgba(0,0,0,.4), 0 0 0 1px var(--gold-bdr);
  }
  .value-icon {
    width: 68px; height: 68px; border-radius: 18px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 22px; transition: all .3s ease;
    position: relative; z-index: 1;
  }
  .value-card:hover .value-icon {
    background: var(--gold); box-shadow: 0 8px 24px rgba(240,165,0,.35);
  }
  .value-icon svg { color: var(--gold); width: 28px; height: 28px; transition: color .3s; }
  .value-card:hover .value-icon svg { color: #000; }
  .value-card h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: var(--white); margin-bottom: 12px; position: relative; z-index: 1; }
  .value-card p { color: var(--muted); font-size: .88rem; line-height: 1.6; position: relative; z-index: 1; }

  /* ══════════════════════════════
     TIMELINE
  ══════════════════════════════ */
  .tl-wrap {
    background: var(--navy); border-radius: 28px;
    padding: 56px 48px; position: relative; overflow: hidden;
  }
  .tl-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0a500' fill-opacity='0.025'%3E%3Cpath d='M0 0h4v4H0V0zm8 0h4v4H8V0zm8 0h4v4h-4V0zm8 0h4v4h-4V0zm8 0h4v4h-4V0zM0 8h4v4H0V8zm8 0h4v4H8V8zm8 0h4v4h-4V8zm8 0h4v4h-4V8zm8 0h4v4h-4V8z'/%3E%3C/g%3E%3C/svg%3E");
  }
  /* connecting line */
  .tl-line {
    position: relative; display: flex; justify-content: space-between;
    align-items: flex-start; gap: 0;
  }
  .tl-line::before {
    content: ''; position: absolute; top: 22px; left: 10%; right: 10%; height: 2px;
    background: linear-gradient(to right, var(--gold-bdr), var(--gold-bdr));
    background-size: 200% 100%;
    animation: shimmer-line 3s linear infinite;
  }
  .tl-item { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 12px; position: relative; z-index: 1; }
  .tl-dot {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--gold-dim); border: 2px solid var(--gold-bdr);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 22px; transition: all .3s;
    flex-shrink: 0;
  }
  .tl-item:hover .tl-dot {
    background: var(--gold); border-color: var(--gold);
    box-shadow: 0 0 0 6px rgba(240,165,0,.15);
  }
  .tl-dot-inner { width: 10px; height: 10px; border-radius: 50%; background: var(--gold); }
  .tl-item:hover .tl-dot-inner { background: #000; }
  .tl-year {
    font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 800;
    color: var(--gold); line-height: 1; margin-bottom: 10px;
    animation: counter-glow 3s ease infinite;
  }
  .tl-title { font-weight: 700; font-size: 1rem; color: var(--white); margin-bottom: 8px; }
  .tl-desc { color: var(--muted); font-size: .83rem; line-height: 1.55; }

  /* ══════════════════════════════
     STATS
  ══════════════════════════════ */
  .stats-band {
    background: linear-gradient(135deg, var(--navy-2) 0%, var(--slate) 100%);
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    padding: 72px 36px; position: relative; overflow: hidden;
  }
  .stats-band::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(240,165,0,.05), transparent 70%);
    pointer-events: none;
  }
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; }
  .stat-card {
    text-align: center; padding: 32px 20px;
    background: rgba(255,255,255,.03); border: 1px solid var(--border);
    border-radius: 20px; transition: all .3s ease;
  }
  .stat-card:hover { border-color: var(--gold-bdr); background: var(--gold-dim); transform: translateY(-4px); }
  .stat-val {
    font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 900;
    color: var(--gold); line-height: 1; margin-bottom: 10px;
    animation: counter-glow 3s ease infinite;
  }
  .stat-icon { color: var(--gold); margin-bottom: 12px; opacity: .6; }
  .stat-lbl { color: rgba(255,255,255,.65); font-size: .82rem; text-transform: uppercase; letter-spacing: .1em; font-weight: 600; }

  /* ══════════════════════════════
     TEAM
  ══════════════════════════════ */
  .team-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }
  .team-card {
    background: var(--navy-2); border: 1.5px solid var(--border);
    border-radius: 22px; overflow: hidden;
    transition: all .35s cubic-bezier(.34,1.1,.64,1);
  }
  .team-card:hover { transform: translateY(-8px); border-color: var(--gold-bdr); box-shadow: 0 20px 44px rgba(0,0,0,.45); }
  .team-img-wrap { position: relative; overflow: hidden; }
  .team-img-wrap img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; transition: transform .5s ease; }
  .team-card:hover .team-img-wrap img { transform: scale(1.06); }
  .team-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,22,53,.9) 0%, transparent 55%);
    opacity: 0; transition: opacity .35s ease;
    display: flex; align-items: flex-end; padding: 16px;
  }
  .team-card:hover .team-img-overlay { opacity: 1; }
  .team-social { display: flex; gap: 8px; }
  .team-social-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(240,165,0,.15); border: 1px solid var(--gold-bdr);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); font-size: .7rem; font-weight: 700;
    transition: background .2s;
  }
  .team-social-btn:hover { background: var(--gold); color: #000; }
  .team-info { padding: 20px; text-align: center; }
  .team-info h3 { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; color: var(--white); margin-bottom: 5px; }
  .team-role { color: var(--gold); font-weight: 600; font-size: .8rem; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
  .team-bio { color: var(--muted); font-size: .8rem; line-height: 1.5; }
  .team-divider { height: 1px; background: linear-gradient(to right, transparent, var(--border), transparent); margin: 10px 0; }

  /* ══════════════════════════════
     ARTISAN SPOTLIGHT
  ══════════════════════════════ */
  .spotlight {
    background: linear-gradient(120deg, var(--navy-2) 0%, var(--slate) 100%);
    border: 1px solid var(--border); border-radius: 28px;
    padding: 56px; display: grid; grid-template-columns: 1fr auto; gap: 56px; align-items: center;
    position: relative; overflow: hidden;
  }
  .spotlight::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 50% 80% at 0% 50%, rgba(240,165,0,.06), transparent 60%);
    pointer-events: none;
  }
  .spotlight-eyebrow { color: var(--gold); font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .spotlight-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--gold); }
  .spotlight h3 { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700; color: var(--white); margin-bottom: 18px; line-height: 1.2; }
  .spotlight h3 em { font-style: italic; color: var(--gold); }
  .spotlight p { color: rgba(255,255,255,.72); line-height: 1.75; margin-bottom: 24px; font-size: .97rem; max-width: 500px; }
  .spotlight-features { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
  .spotlight-feat {
    display: flex; align-items: center; gap: 6px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
    border-radius: 100px; padding: 5px 13px;
    font-size: .78rem; color: var(--gold); font-weight: 600;
  }
  .spotlight-feat svg { width: 12px; height: 12px; }
  .spotlight-imgs { display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; }
  .spotlight-imgs-row { display: flex; gap: 12px; }
  .spotlight-img-main { width: 220px; height: 220px; border-radius: 18px; object-fit: cover; border: 1.5px solid var(--gold-bdr); box-shadow: 0 16px 36px rgba(0,0,0,.45); transition: transform .4s ease; }
  .spotlight-img-main:hover { transform: scale(1.03); }
  .spotlight-img-sm { width: 100px; height: 100px; border-radius: 14px; object-fit: cover; border: 1px solid var(--border); transition: transform .4s ease; }
  .spotlight-img-sm:hover { transform: scale(1.05); }

  /* ══════════════════════════════
     NEWSLETTER
  ══════════════════════════════ */
  .ab-nl {
    background: linear-gradient(135deg, var(--navy-2) 0%, var(--slate) 100%);
    border-top: 1px solid var(--border); padding: 80px 36px; text-align: center;
  }
  .ab-nl-inner { max-width: 580px; margin: 0 auto; }
  .ab-nl h2 { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 900; color: var(--white); margin-bottom: 12px; line-height: 1.15; }
  .ab-nl h2 em { font-style: normal; color: var(--gold); }
  .ab-nl p { color: var(--muted); margin-bottom: 32px; line-height: 1.7; }
  .nl-form {
    display: flex; gap: 10px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
    border-radius: 16px; padding: 7px;
  }
  .nl-form input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--white); font-size: .93rem; padding: 8px 14px;
    font-family: 'DM Sans', sans-serif;
  }
  .nl-form input::placeholder { color: var(--muted); }
  .nl-form button {
    background: var(--gold); color: #000; border: none;
    padding: 11px 24px; border-radius: 10px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: .9rem;
    transition: background .2s; white-space: nowrap;
  }
  .nl-form button:hover { background: var(--gold-lt); }
  .nl-socials { display: flex; justify-content: center; gap: 12px; margin-top: 28px; }
  .nl-social {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--navy); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); transition: all .25s; cursor: pointer;
    font-size: .72rem; font-weight: 700;
  }
  .nl-social:hover { border-color: var(--gold-bdr); color: var(--gold); background: var(--gold-dim); }

  /* ══════════════════════════════
     RESPONSIVE
  ══════════════════════════════ */
  @media(max-width:1100px) {
    .ab-hero-inner { grid-template-columns: 1fr; gap: 48px; text-align: center; }
    .ab-hero-visual { display: none; }
    .ab-hero-sub { margin: 0 auto 32px; }
    .ab-hero-ctas { justify-content: center; }
    .ab-trust-pills { justify-content: center; }
    .story-grid { grid-template-columns: 1fr; gap: 40px; }
    .spotlight { grid-template-columns: 1fr; }
    .spotlight-imgs { flex-direction: row; justify-content: center; }
  }
  @media(max-width:860px) {
    .values-grid { grid-template-columns: repeat(2,1fr); }
    .team-grid { grid-template-columns: repeat(2,1fr); }
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .tl-line { flex-direction: column; gap: 32px; }
    .tl-line::before { display: none; }
    .tl-item { flex-direction: row; text-align: left; gap: 20px; }
    .tl-dot { margin-bottom: 0; flex-shrink: 0; }
  }
  @media(max-width:560px) {
    .values-grid, .team-grid, .stats-grid { grid-template-columns: 1fr; }
    .section-inner { padding: 0 20px; }
    .ab-hero-inner { padding: 0 20px; }
    .tl-wrap { padding: 36px 24px; }
    .spotlight { padding: 32px 24px; }
    .spotlight-imgs { flex-wrap: wrap; }
  }
`;

/* Icon mapping for dynamic icons */
const iconMap = {
  Heart: Heart,
  Award: Award,
  Users: Users,
  Target: Target,
  Star: Star,
  TrendingUp: TrendingUp,
  Globe: Globe,
  Zap: Zap,
  MapPin: MapPin,
  Calendar: Calendar,
  Shield: Shield,
  Clock: Clock,
  Share2: Share2,
  CheckCircle: CheckCircle
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true);
      const result = await aboutService.getAllAboutData();
      
      if (result.success) {
        setAboutData(result.data);
        setError(null);
      } else {
        setError(result.error);
        console.error('Failed to fetch about data:', result.error);
      }
      
      setLoading(false);
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="ab">
        <style>{CSS}</style>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--midnight)'
        }}>
          <div style={{ textAlign: 'center', color: 'var(--gold)' }}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="ab">
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

  const { hero, story, values, timeline, stats, team, spotlight, newsletter, settings } = aboutData;

  // Get icon component function
  const getIconComponent = (iconName) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon /> : <Heart />;
  };

  return (
    <div className="ab">
      <style>{CSS}</style>

      {/* ══ HERO ══ */}
      <section className="ab-hero">
        <div className="ab-hero-ring" aria-hidden="true" />
        <div className="ab-hero-inner">
          <div>
            {hero?.badge_text && (
              <div className="ab-hero-badge fade-up d1">
                <span className="dot" /> {hero.badge_text}
              </div>
            )}
            <h1 className="fade-up d2">
              {hero?.title_line_1 || "The Heart Behind"}<br />
              <em>{hero?.title_highlight || "Gilgit Bazaar"}</em>
            </h1>
            <p className="ab-hero-sub fade-up d3">
              {hero?.subtitle || "We bridge the majestic highlands of Gilgit-Baltistan with the world — connecting skilled artisans, organic farmers, and centuries-old traditions directly to your doorstep."}
            </p>
            <div className="ab-hero-ctas fade-up d4">
              <Link to={hero?.cta_button_link || "/products"} className="btn-gold">
                {hero?.cta_button_text || "Explore Products"} <ArrowRight size={16} />
              </Link>
              <a href={hero?.secondary_cta_link || "#story"} className="btn-ghost">
                {hero?.secondary_cta_text || "Our Story"}
              </a>
            </div>
            {hero?.trust_pills && hero.trust_pills.length > 0 && (
              <div className="ab-trust-pills fade-up d5">
                {hero.trust_pills.map((pill, idx) => (
                  <span className="trust-pill" key={idx}>
                    <CheckCircle size={12} /> {pill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="ab-hero-img-wrap fade-in d3">
            <div className="ab-hero-visual">
              {hero?.floating_card_top_value && (
                <div className="ab-float-card tl">
                  <div className="val">{hero.floating_card_top_value}</div>
                  <div className="lbl">{hero.floating_card_top_label}</div>
                </div>
              )}
              <img
                src={hero?.hero_image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700"}
                alt="Gilgit Bazaar products"
                className="ab-hero-img-main"
              />
              {hero?.floating_card_bottom_value && (
                <div className="ab-float-card br">
                  <div className="val">{hero.floating_card_bottom_value}</div>
                  <div className="lbl">{hero.floating_card_bottom_label}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STORY ══ */}
      {story && (
        <section className="section story-bg" id="story">
          <div className="section-inner">
            <div className="story-grid">
              <div className="story-img-wrap fade-left d1">
                <div className="story-img-border" aria-hidden="true" />
                <img
                  src={story.story_image || "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800"}
                  alt="Artisan at work"
                  className="story-img"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800";
                  }}
                />
                {story.badge_year && (
                  <div className="story-img-badge">
                    <div className="sv">{story.badge_year}</div>
                    <div className="sl">{story.badge_label || "Year Founded"}</div>
                  </div>
                )}
              </div>

              <div className="fade-right d2">
                <div className="eyebrow">{story.eyebrow_text || "Our Story"}</div>
                <h2>
                  {story.title_prefix || "Roots in the"} <em>{story.title_highlight || "Mountains"}</em>
                  {story.title_suffix && <><br />{story.title_suffix}</>}
                </h2>
                <p>{story.paragraph_1}</p>

                {story.quote_text && (
                  <div className="story-quote">
                    <Quote size={16} />
                    <p>{story.quote_text}</p>
                  </div>
                )}

                <p>{story.paragraph_2}</p>

                {story.check_items && story.check_items.length > 0 && (
                  <div className="story-checks">
                    {story.check_items.map((item, idx) => (
                      <div className="story-check" key={idx}>
                        <CheckCircle size={16} /> {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ VALUES ══ */}
      {values && values.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <div className="section-head">
              <div className="eyebrow">{settings?.values_eyebrow || "What We Stand For"}</div>
              <h2 className="section-title">
                {settings?.values_title?.split(settings?.values_title_highlight || "Values")[0] || "Our Core "}
                <em>{settings?.values_title_highlight || "Values"}</em>
                {settings?.values_title?.split(settings?.values_title_highlight || "Values")[1] || ""}
              </h2>
              <p className="section-sub">{settings?.values_subtitle || "The principles that guide every decision, partnership, and product we offer"}</p>
            </div>
            <div className="values-grid">
              {values.map((value, idx) => (
                <div className={`value-card fade-up d${idx + 1}`} key={value.id}>
                  <div className="value-icon">{getIconComponent(value.icon_name)}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ TIMELINE ══ */}
      {timeline && timeline.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-inner">
            <div className="section-head">
              <div className="eyebrow">{settings?.timeline_eyebrow || "Milestones"}</div>
              <h2 className="section-title">
                {settings?.timeline_title?.split(settings?.timeline_title_highlight || "Journey")[0] || "Our "}
                <em>{settings?.timeline_title_highlight || "Journey"}</em>
                {settings?.timeline_title?.split(settings?.timeline_title_highlight || "Journey")[1] || ""}
              </h2>
              <p className="section-sub">{settings?.timeline_subtitle || "From a bold idea in 2020 to Pakistan's premier highland marketplace"}</p>
            </div>
            <div className="tl-wrap">
              <div className="tl-line">
                {timeline.map((item, idx) => (
                  <div className={`tl-item fade-up d${idx + 1}`} key={item.id}>
                    <div className="tl-dot"><div className="tl-dot-inner" /></div>
                    <div>
                      <div className="tl-year">{item.year}</div>
                      <div className="tl-title">{item.title}</div>
                      <div className="tl-desc">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ STATS ══ */}
      {stats && stats.length > 0 && (
        <div className="stats-band">
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div className={`stat-card fade-up d${idx + 1}`} key={stat.id}>
                <div className="stat-icon">{getIconComponent(stat.icon_name)}</div>
                <div className="stat-val">{stat.value}</div>
                <div className="stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TEAM ══ */}
      {team && team.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <div className="section-head">
              <div className="eyebrow">{settings?.team_eyebrow || "The People"}</div>
              <h2 className="section-title">
                {settings?.team_title?.split(settings?.team_title_highlight || "Team")[0] || "Meet the "}
                <em>{settings?.team_title_highlight || "Team"}</em>
                {settings?.team_title?.split(settings?.team_title_highlight || "Team")[1] || ""}
              </h2>
              <p className="section-sub">{settings?.team_subtitle || "Passionate individuals dedicated to sharing the magic of Gilgit-Baltistan"}</p>
            </div>
            <div className="team-grid">
              {team.map((member, idx) => (
                <div className={`team-card fade-up d${idx + 1}`} key={member.id}>
                  <div className="team-img-wrap">
                    <img 
                      src={member.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"} 
                      alt={member.name}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400";
                      }}
                    />
                    <div className="team-img-overlay">
                      <div className="team-social">
                        {['in', 'tw', 'ig'].map((s) => (
                          <div className="team-social-btn" key={s}>{s}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <div className="team-role">{member.role}</div>
                    <div className="team-divider" />
                    <div className="team-bio">{member.bio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ ARTISAN SPOTLIGHT ══ */}
      {spotlight && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-inner">
            <div className="spotlight fade-up d1">
              <div>
                <div className="spotlight-eyebrow">{spotlight.eyebrow_text || "Artisan Spotlight"}</div>
                <h3>
                  {spotlight.title_prefix || "The Hands That Create"} <em>{spotlight.title_highlight || "Magic"}</em>
                </h3>
                <p>{spotlight.description}</p>
                {spotlight.features && spotlight.features.length > 0 && (
                  <div className="spotlight-features">
                    {spotlight.features.map((feature, idx) => (
                      <span className="spotlight-feat" key={idx}>
                        <CheckCircle size={10} /> {feature}
                      </span>
                    ))}
                  </div>
                )}
                <Link to={spotlight.cta_link || "/products?category=handicrafts"} className="btn-gold">
                  {spotlight.cta_text || "Support Artisans"} <ArrowRight size={16} />
                </Link>
              </div>
              <div className="spotlight-imgs">
                {spotlight.main_image && (
                  <img
                    src={spotlight.main_image}
                    alt="Artisan crafting"
                    className="spotlight-img-main"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1602526212871-6b99f1dfac6a?w=400";
                    }}
                  />
                )}
                {(spotlight.secondary_image_1 || spotlight.secondary_image_2) && (
                  <div className="spotlight-imgs-row">
                    {spotlight.secondary_image_1 && (
                      <img 
                        src={spotlight.secondary_image_1} 
                        alt="Craft" 
                        className="spotlight-img-sm"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=200";
                        }}
                      />
                    )}
                    {spotlight.secondary_image_2 && (
                      <img 
                        src={spotlight.secondary_image_2} 
                        alt="Produce" 
                        className="spotlight-img-sm"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1563746924237-b35f38b94f6d?w=200";
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      
    </div>
  );
};

export default About;