import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './WorkGrid.css';

const NICHES = ['Videography', 'Video Editing', 'Animation'];
const NICHE_COLORS = {
  Videography: '#00f2ff',
  'Video Editing': '#7000ff',
  Animation: '#e100ff',
};

function getEmbedUrl(url) {
  if (!url) return '';
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/\s]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return url;
}

function getAutoThumbnail(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?]+)/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  return null;
}

/* ── Video Modal ── */
const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const accent = video.accentColor || '#00f2ff';

  return (
    <motion.div
      className="vmodal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="vmodal"
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--accent': accent }}
      >
        <button className="vmodal__close" onClick={onClose}>✕</button>
        <div className="vmodal__frame">
          <iframe
            src={getEmbedUrl(video.videoUrl)}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="vmodal__info">
          <h3 className="vmodal__title" style={{ color: accent }}>{video.title}</h3>
          {video.description && <p className="vmodal__desc">{video.description}</p>}
          {video.tags?.length > 0 && (
            <div className="vmodal__tags">
              {video.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Video Card (inside niche dropdown) ── */
const VideoCard = ({ video, onClick }) => {
  const thumb = video.thumbnailUrl || getAutoThumbnail(video.videoUrl);
  const accent = video.accentColor || '#00f2ff';

  return (
    <motion.button
      className="niche-card"
      onClick={() => onClick(video)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="niche-card__thumb"
        style={thumb
          ? { backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: `linear-gradient(135deg, #0a0a0a, #001a1f 60%, ${accent}22)` }
        }
      >
        <div className="niche-card__play" style={{ borderColor: accent }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 2l8 5-8 5V2z" fill={accent} />
          </svg>
        </div>
      </div>
      <div className="niche-card__info">
        <p className="niche-card__title">{video.title}</p>
        {video.description && (
          <p className="niche-card__desc">{video.description}</p>
        )}
      </div>
    </motion.button>
  );
};

/* ── Niche Accordion Section ── */
const NicheSection = ({ name, videos, accentColor, onVideoClick }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="niche-section">
      <button
        className={`niche-header ${open ? 'niche-header--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        style={{ '--niche-accent': accentColor }}
      >
        <span className="niche-header__dot" style={{ background: accentColor }} />
        <span className="niche-header__name">{name}</span>
        <span className="niche-header__count">{videos.length}</span>
        <motion.span
          className="niche-header__arrow"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            className="niche-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="niche-body__inner">
              {videos.length === 0 ? (
                <p className="niche-empty">No videos in this category yet.</p>
              ) : (
                <div className="niche-cards-row">
                  {videos.map((v) => (
                    <VideoCard key={v.id} video={v} onClick={onVideoClick} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── WorkGrid ── */
const WorkGrid = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chidera_portfolio_videos'), (snap) => {
      setVideos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const grouped = NICHES.map((name) => ({
    name,
    color: NICHE_COLORS[name],
    videos: videos.filter((v) => v.category === name),
  }));

  return (
    <section id="work" className="work-section">
      <motion.div
        className="work-section__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="section-label">Selected Work</p>
        <h2 className="section-title">
          The <span className="gradient-text">Reel</span>
        </h2>
        <p className="work-section__subtitle">
          A curated selection of videography, editing, and animation projects.
        </p>
      </motion.div>

      {loading ? (
        <div className="work-loading">
          <span /><span /><span />
        </div>
      ) : (
        <motion.div
          className="niche-list"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
        >
          {grouped.map((n) => (
            <NicheSection
              key={n.name}
              name={n.name}
              videos={n.videos}
              accentColor={n.color}
              onVideoClick={setActiveVideo}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        className="work-section__cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
      >
        <p className="work-section__cta-text">Want to see more? Let's talk.</p>
        <a href="#contact" className="btn-primary">
          Start a Project
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorkGrid;
