import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';

const SERVICES = [
  {
    id: 'videography',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="2" y="8" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20 13l8-4v14l-8-4V13z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="11" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Videography',
    tagline: 'Every shot tells a truth.',
    description:
      'From concept to camera — I direct, shoot, and light scenes that carry narrative weight. Specialising in brand films, documentaries, and event coverage.',
    capabilities: ['4K / 6K Production', 'Drone Aerial Shots', 'Color Science & Grading', 'Sound Design Briefing'],
    accent: '#00f2ff',
    glowVar: 'var(--glow-cyan)',
  },
  {
    id: 'editing',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="6" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="3" y1="12" x2="29" y2="12" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="3" y1="18" x2="29" y2="18" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="7" y="9" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.5"/>
        <rect x="13" y="15" width="6" height="3" rx="0.5" fill="currentColor" opacity="0.5"/>
        <rect x="20" y="9" width="5" height="3" rx="0.5" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    title: 'Video Editing',
    tagline: 'Where raw footage becomes art.',
    description:
      'Precision cuts, rhythm-driven pacing, and meticulous color grades. I turn hours of footage into lean, impactful stories that hold attention.',
    capabilities: ['Narrative & Commercial Cuts', 'VFX Compositing', 'LUT & Color Grading', 'Audio Mix & Sound Sync'],
    accent: '#7000ff',
    glowVar: 'var(--glow-purple)',
  },
  {
    id: 'animation',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 28L16 4l12 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 20h16" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Animation',
    tagline: 'Bringing stillness to life.',
    description:
      'Motion graphics, 3D logo animations, and kinetic typography — crafted to amplify brand identity across digital platforms.',
    capabilities: ['3D & 2D Animation', 'Motion Graphics', 'Kinetic Typography', 'Loop & Social Assets'],
    accent: '#e100ff',
    glowVar: 'var(--glow-magenta)',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

const Services = () => (
  <section id="services" className="services-section">
    {/* Heading */}
    <motion.div
      className="services-section__header"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <p className="section-label">What I Do</p>
      <h2 className="section-title">
        Three <span className="gradient-text">Disciplines</span>
      </h2>
      <p className="services-section__subtitle">
        A unified creative practice spanning the full spectrum of moving image.
      </p>
    </motion.div>

    {/* Cards */}
    <div className="services-grid">
      {SERVICES.map((svc, i) => (
        <motion.div
          key={svc.id}
          className="service-card glass-panel"
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ '--card-accent': svc.accent }}
        >
          {/* Top accent line */}
          <div
            className="service-card__accent-line"
            style={{ background: svc.accent, boxShadow: `0 0 12px ${svc.accent}88` }}
          />

          {/* Icon */}
          <div
            className="service-card__icon"
            style={{ color: svc.accent, background: `${svc.accent}12` }}
          >
            {svc.icon}
          </div>

          {/* Text */}
          <h3 className="service-card__title">{svc.title}</h3>
          <p
            className="service-card__tagline"
            style={{ color: svc.accent }}
          >
            {svc.tagline}
          </p>
          <p className="service-card__desc">{svc.description}</p>

          {/* Capabilities */}
          <ul className="service-card__capabilities">
            {svc.capabilities.map((cap) => (
              <li key={cap} className="service-card__cap-item">
                <span
                  className="service-card__cap-bullet"
                  style={{ background: svc.accent }}
                />
                {cap}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#contact"
            className="service-card__link"
            style={{ color: svc.accent, borderColor: `${svc.accent}44` }}
          >
            Enquire about {svc.title}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Services;
