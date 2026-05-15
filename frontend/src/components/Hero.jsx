import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

/* ── Bokeh particle canvas ── */
const BokehCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['rgba(0,242,255,', 'rgba(112,0,255,', 'rgba(225,0,255,'];

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 80 + 20,
      alpha: Math.random() * 0.18 + 0.04,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `${p.color}${p.alpha})`);
        grad.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < -p.r) p.x = canvas.width + p.r;
        else if (p.x > canvas.width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = canvas.height + p.r;
        else if (p.y > canvas.height + p.r) p.y = -p.r;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bokeh-canvas" />;
};

/* ── Animation variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const lineVariants = {
  hidden: { opacity: 0, y: 60, skewY: 3 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

/* ── Hero Component ── */
const Hero = () => (
  <section id="hero" className="hero">
    <BokehCanvas />

    <div className="hero__content">
      {/* Eyebrow */}
      <motion.p
        className="hero__eyebrow"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <span className="hero__eyebrow-line" />
        Available for Projects
      </motion.p>

      {/* Main Headline */}
      <motion.h1
        className="hero__headline"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {['Motion.', 'Story.', 'Art.'].map((word, i) => (
          <span key={i} className="hero__line-wrap" aria-hidden={i > 0}>
            <motion.span
              className={`hero__line ${i === 1 ? 'hero__line--accent' : ''}`}
              variants={lineVariants}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      {/* Name + Title */}
      <motion.div
        className="hero__identity"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9 }}
      >
        <span className="hero__name">Chidera Uwannah</span>
        <span className="hero__separator">·</span>
        <span className="hero__role">Videographer · Editor · Animator</span>
      </motion.div>

      {/* Description */}
      <motion.p
        className="hero__desc"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.1 }}
      >
        Crafting cinematic stories and high-impact visuals that move audiences.
        Every frame is a deliberate choice.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="hero__actions"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.25 }}
      >
        <a href="#work" className="btn-primary">
          View My Work
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href="#contact" className="btn-secondary">
          Get in Touch
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="hero__scroll-line" />
        <span className="hero__scroll-label">Scroll</span>
      </motion.div>
    </div>

    {/* Stats strip */}
    <motion.div
      className="hero__stats"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      {[
        { value: '50+', label: 'Projects Delivered' },
        { value: '5+', label: 'Years Experience' },
        { value: '3', label: 'Disciplines' },
        { value: '∞', label: 'Frames of Passion' },
      ].map((stat) => (
        <div key={stat.label} className="hero__stat">
          <span className="hero__stat-value gradient-text">{stat.value}</span>
          <span className="hero__stat-label">{stat.label}</span>
        </div>
      ))}
    </motion.div>
  </section>
);

export default Hero;
