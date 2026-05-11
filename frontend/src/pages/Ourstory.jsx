import { useState, useEffect, useRef } from 'react';
import { Play, ArrowRight, Heart, Mountain, Users, Award, ChevronDown } from 'lucide-react';
import ourstoryService from '../services/ourstoryService';

/* ─────────────────────────────────────────────
   STYLES (Same as your original CSS)
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --os-midnight: #0a0f1e;
  --os-navy: #0d1635;
  --os-navy-2: #131c42;
  --os-slate: #1e2a4a;
  --os-gold: #f0a500;
  --os-gold-lt: #fbbf24;
  --os-gold-dim: rgba(240,165,0,0.12);
  --os-gold-bdr: rgba(240,165,0,0.28);
  --os-muted: #8892aa;
  --os-border: rgba(255,255,255,0.07);
  --os-white: #ffffff;
  --os-green: #4ade80;
  --os-spring: cubic-bezier(0.34,1.56,0.64,1);
  --os-ease: cubic-bezier(0.25,0.46,0.45,0.94);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.xos {
  background: var(--os-midnight);
  font-family: 'DM Sans', sans-serif;
  color: var(--os-white);
  overflow-x: hidden;
}

/* ══ HERO SECTION ══ */
.xos-hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.xos-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.xos-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4);
  animation: xos-zoom 20s ease-in-out infinite alternate;
}

@keyframes xos-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.xos-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10,15,30,0.3) 0%,
    rgba(10,15,30,0.8) 100%
  );
}

.xos-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  padding: 0 32px;
  animation: xos-fade-up 1s var(--os-ease) forwards;
  opacity: 0;
}

@keyframes xos-fade-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.xos-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--os-gold-dim);
  border: 1px solid var(--os-gold-bdr);
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--os-gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
  animation: xos-pulse 2s ease-in-out infinite;
}

@keyframes xos-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.xos-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--os-white) 0%, var(--os-gold-lt) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.xos-hero-subtitle {
  font-size: 1.4rem;
  color: var(--os-muted);
  line-height: 1.6;
  margin-bottom: 40px;
}

.xos-scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--os-muted);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  animation: xos-bounce 2s ease-in-out infinite;
}

@keyframes xos-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

/* ══ CONTAINER ══ */
.xos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

/* ══ INTRO SECTION ══ */
.xos-intro {
  padding: 120px 0;
  position: relative;
}

.xos-intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.xos-intro-content h2 {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
}

.xos-intro-content h2 span {
  color: var(--os-gold);
}

.xos-intro-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--os-muted);
  margin-bottom: 16px;
}

.xos-intro-highlight {
  background: var(--os-navy-2);
  border-left: 4px solid var(--os-gold);
  padding: 24px 28px;
  border-radius: 12px;
  margin-top: 32px;
}

.xos-intro-highlight p {
  font-size: 1.15rem;
  font-style: italic;
  color: var(--os-white);
  line-height: 1.7;
}

.xos-intro-img-wrap {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.xos-intro-img {
  width: 100%;
  height: 600px;
  object-fit: cover;
  display: block;
  transition: transform 0.6s var(--os-ease);
}

.xos-intro-img-wrap:hover .xos-intro-img {
  transform: scale(1.05);
}

/* ══ STATS ══ */
.xos-stats {
  padding: 80px 0;
  background: var(--os-navy-2);
}

.xos-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.xos-stat-card {
  text-align: center;
  padding: 32px 24px;
  background: var(--os-navy);
  border: 1px solid var(--os-border);
  border-radius: 20px;
  transition: all 0.3s var(--os-spring);
}

.xos-stat-card:hover {
  transform: translateY(-8px);
  border-color: var(--os-gold-bdr);
  box-shadow: 0 12px 40px rgba(240,165,0,0.15);
}

.xos-stat-icon {
  width: 60px;
  height: 60px;
  background: var(--os-gold-dim);
  border: 1px solid var(--os-gold-bdr);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--os-gold);
}

.xos-stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  color: var(--os-gold);
  margin-bottom: 5px;
}

.xos-stat-label {
  font-size: 0.95rem;
  color: var(--os-muted);
  font-weight: 600;
}

/* ══ VIDEO SECTION ══ */
.xos-video {
  padding: 120px 0;
}

.xos-video-header {
  text-align: center;
  margin-bottom: 60px;
}

.xos-video-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.xos-video-header h2 span {
  color: var(--os-gold);
}

.xos-video-header p {
  font-size: 1.2rem;
  color: var(--os-muted);
  max-width: 700px;
  margin: 0 auto;
}

.xos-video-player {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: transform 0.4s var(--os-ease);
}

.xos-video-player:hover {
  transform: scale(1.02);
}

.xos-video-thumbnail {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
}

.xos-video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.2) 0%,
    rgba(0,0,0,0.6) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.xos-video-player:hover .xos-video-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.3) 0%,
    rgba(0,0,0,0.7) 100%
  );
}

.xos-play-btn {
  width: 100px;
  height: 100px;
  background: var(--os-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  transition: all 0.3s var(--os-spring);
  box-shadow: 0 10px 40px rgba(240,165,0,0.4);
}

.xos-video-player:hover .xos-play-btn {
  transform: scale(1.15);
  box-shadow: 0 15px 50px rgba(240,165,0,0.6);
}

.xos-play-btn svg {
  margin-left: 4px;
}

.xos-video-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: xos-modal-in 0.3s ease;
}

@keyframes xos-modal-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.xos-video-modal-content {
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 16/9;
  position: relative;
}

.xos-video-modal-close {
  position: absolute;
  top: -50px;
  right: 0;
  background: transparent;
  border: none;
  color: var(--os-white);
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.xos-video-modal-close:hover {
  color: var(--os-gold);
}

.xos-video-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
}

/* ══ ARTISAN STORIES ══ */
.xos-stories {
  padding: 120px 0;
  background: var(--os-navy-2);
}

.xos-section-header {
  text-align: center;
  margin-bottom: 80px;
}

.xos-section-eyebrow {
  display: inline-block;
  background: var(--os-gold-dim);
  border: 1px solid var(--os-gold-bdr);
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--os-gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.xos-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.xos-section-title span {
  color: var(--os-gold);
}

.xos-section-subtitle {
  font-size: 1.2rem;
  color: var(--os-muted);
  max-width: 700px;
  margin: 0 auto;
}

.xos-story-card {
  background: var(--os-navy);
  border: 1px solid var(--os-border);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 80px;
  transition: all 0.4s var(--os-ease);
  animation: xos-story-in 0.6s var(--os-ease) forwards;
  opacity: 0;
}

@keyframes xos-story-in {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.xos-story-card:hover {
  border-color: var(--os-gold-bdr);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  transform: translateY(-4px);
}

.xos-story-grid {
  display: grid;
  grid-template-columns: 45% 55%;
  min-height: 500px;
}

.xos-story-grid.reverse {
  grid-template-columns: 55% 45%;
}

.xos-story-img-wrap {
  position: relative;
  overflow: hidden;
}

.xos-story-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--os-ease);
}

.xos-story-card:hover .xos-story-img {
  transform: scale(1.08);
}

.xos-story-badge {
  position: absolute;
  top: 24px;
  left: 24px;
  background: var(--os-gold);
  color: #000;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  box-shadow: 0 4px 16px rgba(240,165,0,0.4);
}

.xos-story-content {
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.xos-story-tag {
  color: var(--os-gold);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.xos-story-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.xos-story-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--os-muted);
  margin-bottom: 24px;
}

.xos-story-quote {
  background: rgba(240,165,0,0.05);
  border-left: 4px solid var(--os-gold);
  padding: 20px 24px;
  border-radius: 8px;
  font-style: italic;
  color: var(--os-white);
  margin-bottom: 24px;
}

.xos-story-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--os-border);
}

.xos-story-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--os-gold);
}

.xos-story-author {
  flex: 1;
}

.xos-story-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--os-white);
  margin-bottom: 4px;
}

.xos-story-role {
  font-size: 0.85rem;
  color: var(--os-muted);
}

/* ══ PROCESS SECTION ══ */
.xos-process {
  padding: 120px 0;
}

.xos-process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;
}

.xos-process-step {
  position: relative;
  text-align: center;
  padding: 40px 28px;
  background: var(--os-navy-2);
  border: 1px solid var(--os-border);
  border-radius: 20px;
  transition: all 0.3s var(--os-spring);
}

.xos-process-step:hover {
  transform: translateY(-8px);
  border-color: var(--os-gold-bdr);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}

.xos-process-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: var(--os-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  color: #000;
  box-shadow: 0 4px 16px rgba(240,165,0,0.4);
}

.xos-process-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 16px;
  overflow: hidden;
}

.xos-process-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.xos-process-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.xos-process-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--os-muted);
}

/* ══ CTA SECTION ══ */
.xos-cta {
  padding: 120px 0;
  background: linear-gradient(135deg, var(--os-navy-2) 0%, var(--os-navy) 100%);
  position: relative;
  overflow: hidden;
}

.xos-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(ellipse 50% 40% at 50% 50%, rgba(240,165,0,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.xos-cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.xos-cta-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
}

.xos-cta-title span {
  color: var(--os-gold);
}

.xos-cta-text {
  font-size: 1.2rem;
  color: var(--os-muted);
  margin-bottom: 40px;
  line-height: 1.7;
}

.xos-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--os-gold);
  color: #000;
  padding: 18px 40px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  transition: all 0.3s var(--os-spring);
  box-shadow: 0 10px 30px rgba(240,165,0,0.3);
}

.xos-cta-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(240,165,0,0.5);
  background: var(--os-gold-lt);
}

/* ══ RESPONSIVE ══ */
@media (max-width: 1024px) {
  .xos-hero-title { font-size: 4rem; }
  .xos-intro-grid { grid-template-columns: 1fr; gap: 60px; }
  .xos-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .xos-story-grid { grid-template-columns: 1fr !important; }
  .xos-process-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .xos-hero-title { font-size: 3rem; }
  .xos-hero-subtitle { font-size: 1.1rem; }
  .xos-section-title { font-size: 2.5rem; }
  .xos-story-content { padding: 40px 28px; }
  .xos-story-title { font-size: 2rem; }
  .xos-cta-title { font-size: 2.5rem; }
  .xos-stats-grid { grid-template-columns: 1fr; }
}
`;

// Add styles to document
if (typeof document !== 'undefined' && !document.getElementById('xos-css')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'xos-css';
  styleElement.textContent = CSS;
  document.head.appendChild(styleElement);
}

const OurStory = () => {
  const [videoModal, setVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from backend
  useEffect(() => {
    const fetchStoryData = async () => {
      setLoading(true);
      const result = await ourstoryService.getAllStoryData();
      
      if (result.success) {
        setStoryData(result.data);
        setError(null);
      } else {
        setError(result.error);
        console.error('Failed to fetch story data:', result.error);
      }
      
      setLoading(false);
    };

    fetchStoryData();
  }, []);

  const handleVideoClick = (videoId) => {
    setCurrentVideo(videoId);
    setVideoModal(true);
  };

  const closeVideoModal = () => {
    setVideoModal(false);
    setTimeout(() => setCurrentVideo(''), 300);
  };

  // Intersection Observer for animations
  useEffect(() => {
    if (!storyData) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          }
        });
      },
      { threshold: 0.1 }
    );

    const storyCards = document.querySelectorAll('.xos-story-card');
    storyCards.forEach((card, idx) => {
      card.style.animationDelay = `${idx * 0.2}s`;
      card.style.animationPlayState = 'paused';
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [storyData]);

  const scrollToContent = () => {
    const introSection = document.querySelector('.xos-intro');
    if (introSection) {
      introSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    // Check if it's already a full URL
    if (imagePath.startsWith('http')) return imagePath;
    // Remove /api from base URL if present in imagePath
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'Users':
        return <Users size={28} />;
      case 'Mountain':
        return <Mountain size={28} />;
      case 'Heart':
        return <Heart size={28} />;
      case 'Award':
        return <Award size={28} />;
      default:
        return <Users size={28} />;
    }
  };

  if (loading) {
    return (
      <div className="xos" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--os-gold)', fontSize: '1.2rem' }}>Loading our story...</div>
        </div>
      </div>
    );
  }

  if (error || !storyData) {
    return (
      <div className="xos" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
          <p style={{ marginBottom: '20px' }}>{error || 'Failed to load content'}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '10px 20px', 
              background: 'var(--os-gold)', 
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
    );
  }

  const { hero, intro, stats, video, stories, process_steps, cta, settings } = storyData;

  return (
    <div className="xos">
      {/* ════ HERO SECTION ════ */}
      <section className="xos-hero">
        <div className="xos-hero-bg">
          <img
            src={hero?.background_image ? getImageUrl(hero.background_image) : "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1920&q=80"}
            alt="Gilgit Mountains"
            className="xos-hero-img"
            loading="eager"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1920&q=80";
            }}
          />
          <div className="xos-hero-overlay" />
        </div>
        
        <div className="xos-hero-content">
          {hero?.eyebrow_text && (
            <div className="xos-hero-eyebrow">
              <Mountain size={16} />
              {hero.eyebrow_text}
            </div>
          )}
          <h1 className="xos-hero-title">
            {hero?.title || "Crafted with Love,<br />Rooted in Tradition"}
          </h1>
          <p className="xos-hero-subtitle">
            {hero?.subtitle || "Every product tells a story of heritage, craftsmanship, and the breathtaking beauty of Gilgit-Baltistan"}
          </p>
        </div>

        <div className="xos-scroll-indicator" onClick={scrollToContent}>
          <span>Discover Our Journey</span>
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ════ INTRO SECTION ════ */}
      {intro && (
        <section className="xos-intro">
          <div className="xos-container">
            <div className="xos-intro-grid">
              <div className="xos-intro-content">
                <h2>
                  {intro.title?.split(intro.highlighted_word)[0]}
                  {intro.highlighted_word && <span>{intro.highlighted_word}</span>}
                  {intro.title?.split(intro.highlighted_word)[1]}
                </h2>
                <p className="xos-intro-text">{intro.text_paragraph_1}</p>
                <p className="xos-intro-text">{intro.text_paragraph_2}</p>
                <div className="xos-intro-highlight">
                  <p>{intro.quote_text}</p>
                </div>
              </div>
              <div className="xos-intro-img-wrap">
                <img
                  src={intro.image ? getImageUrl(intro.image) : "https://images.unsplash.com/photo-1534787238916-9ba6764f3d70?w=800&q=80"}
                  alt="Artisan at work"
                  className="xos-intro-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534787238916-9ba6764f3d70?w=800&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════ STATS SECTION ════ */}
      {stats && stats.length > 0 && (
        <section className="xos-stats">
          <div className="xos-container">
            <div className="xos-stats-grid">
              {stats.map((stat) => (
                <div key={stat.id} className="xos-stat-card">
                  <div className="xos-stat-icon">
                    {getIconComponent(stat.icon_name)}
                  </div>
                  <div className="xos-stat-value">{stat.value}</div>
                  <div className="xos-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ VIDEO SECTION ════ */}
      {video && (
        <section className="xos-video">
          <div className="xos-container">
            <div className="xos-video-header">
              <h2>
                {video.title?.split(video.highlighted_word)[0]}
                {video.highlighted_word && <span>{video.highlighted_word}</span>}
                {video.title?.split(video.highlighted_word)[1]}
              </h2>
              <p>{video.subtitle}</p>
            </div>
            
            <div 
              className="xos-video-player"
              onClick={() => handleVideoClick(video.youtube_video_id)}
            >
              <img
                src={video.thumbnail_image ? getImageUrl(video.thumbnail_image) : "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&q=80"}
                alt="Behind the scenes"
                className="xos-video-thumbnail"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&q=80";
                }}
              />
              <div className="xos-video-overlay">
                <div className="xos-play-btn">
                  <Play size={40} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════ ARTISAN STORIES ════ */}
      {stories && stories.length > 0 && (
        <section className="xos-stories">
          <div className="xos-container">
            <div className="xos-section-header">
              <div className="xos-section-eyebrow">{settings?.section_eyebrow_text || "Meet Our Makers"}</div>
              <h2 className="xos-section-title">
                {(settings?.section_title || "Stories of Passion and Pride").split(settings?.section_title_word_1 || "Passion")[0]}
                <span>{settings?.section_title_word_1 || "Passion"}</span>
                {(settings?.section_title || "Stories of Passion and Pride").split(settings?.section_title_word_1 || "Passion")[1]?.split(settings?.section_title_word_2 || "Pride")[0]}
                <span>{settings?.section_title_word_2 || "Pride"}</span>
                {(settings?.section_title || "Stories of Passion and Pride").split(settings?.section_title_word_2 || "Pride")[1]}
              </h2>
              <p className="xos-section-subtitle">{settings?.section_subtitle || "Behind every product is a person, a family, and a legacy of craftsmanship"}</p>
            </div>

            {stories.map((story) => (
              <div key={story.id} className="xos-story-card">
                <div className={`xos-story-grid ${story.reverse_layout ? 'reverse' : ''}`}>
                  <div className="xos-story-img-wrap">
                    <img
                      src={story.story_image ? getImageUrl(story.story_image) : "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80"}
                      alt={story.title}
                      className="xos-story-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80";
                      }}
                    />
                    <div className="xos-story-badge">{story.badge_text}</div>
                  </div>
                  <div className="xos-story-content">
                    <div className="xos-story-tag">{story.category}</div>
                    <h3 className="xos-story-title">{story.title}</h3>
                    <p className="xos-story-text">{story.story_text}</p>
                    <div className="xos-story-quote">
                      "{story.quote_text}"
                    </div>
                    <div className="xos-story-meta">
                      <img
                        src={story.author_avatar ? getImageUrl(story.author_avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(story.author_name)}&background=f0a500&color=000&bold=true&size=128`}
                        alt={story.author_name}
                        className="xos-story-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.author_name)}&background=f0a500&color=000&bold=true&size=128`;
                        }}
                      />
                      <div className="xos-story-author">
                        <div className="xos-story-name">{story.author_name}</div>
                        <div className="xos-story-role">{story.author_role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════ PROCESS SECTION ════ */}
      {process_steps && process_steps.length > 0 && (
        <section className="xos-process">
          <div className="xos-container">
            <div className="xos-section-header">
              <div className="xos-section-eyebrow">{settings?.process_eyebrow_text || "From Mountain to Market"}</div>
              <h2 className="xos-section-title">
                {(settings?.process_title || "Our Creation Process").split(settings?.process_title_word || "Creation")[0]}
                <span>{settings?.process_title_word || "Creation"}</span>
                {(settings?.process_title || "Our Creation Process").split(settings?.process_title_word || "Creation")[1]}
              </h2>
              <p className="xos-section-subtitle">{settings?.process_subtitle || "Every product goes through a careful journey of craftsmanship and quality assurance"}</p>
            </div>

            <div className="xos-process-grid">
              {process_steps.map((step) => (
                <div key={step.id} className="xos-process-step">
                  <div className="xos-process-number">{step.step_number}</div>
                  <div className="xos-process-icon">
                    <img 
                      src={step.icon_image ? getImageUrl(step.icon_image) : "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?w=200&q=80"} 
                      alt={step.title}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?w=200&q=80";
                      }}
                    />
                  </div>
                  <h3 className="xos-process-title">{step.title}</h3>
                  <p className="xos-process-desc">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ CTA SECTION ════ */}
      {cta && (
        <section className="xos-cta">
          <div className="xos-container">
            <div className="xos-cta-content">
              <h2 className="xos-cta-title">
                {(cta.title || "Become Part of Our Story").split(cta.highlighted_word || "Story")[0]}
                <span>{cta.highlighted_word || "Story"}</span>
                {(cta.title || "Become Part of Our Story").split(cta.highlighted_word || "Story")[1]}
              </h2>
              <p className="xos-cta-text">{cta.text}</p>
              <a href={cta.button_link || "/products"} className="xos-cta-btn">
                {cta.button_text || "Explore Our Collection"}
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ════ VIDEO MODAL ════ */}
      {videoModal && (
        <div className="xos-video-modal" onClick={closeVideoModal}>
          <div className="xos-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="xos-video-modal-close" onClick={closeVideoModal}>
              ×
            </button>
            <iframe
              className="xos-video-iframe"
              src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OurStory;