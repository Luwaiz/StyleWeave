import React from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = ({ scrollY }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-tag"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="tag-dot"></span>
              AI-Powered Fashion Visualization
            </motion.div>

            <h1 className="hero-title">
              <motion.span
                className="title-line"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Visualize Your
              </motion.span>
              <motion.span
                className="title-line gold-gradient"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Ankara Dreams
              </motion.span>
              <motion.span
                className="title-line"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                Before You Sew
              </motion.span>
            </h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              Transform your fabric selection with intelligent AI. See exactly how 
              your chosen Ankara will look on any design—from elegant gowns to 
              trendy tops—all before cutting a single thread.
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <motion.button
                className="primary-btn"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(212, 175, 55, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Try It Now
                <span className="btn-icon">✨</span>
              </motion.button>

              <motion.button
                className="secondary-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
                <span className="btn-icon">▶</span>
              </motion.button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Ankara Fabrics</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">9</span>
                <span className="stat-label">Design Templates</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered Matching</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{
              transform: `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.02}deg)`
            }}
          >
            <div className="visual-frame">
              <div className="frame-corner corner-tl"></div>
              <div className="frame-corner corner-tr"></div>
              <div className="frame-corner corner-bl"></div>
              <div className="frame-corner corner-br"></div>
            </div>

            <div className="fabric-preview-grid">
              {[1, 2, 3, 4].map((item, index) => (
                <motion.div
                  key={item}
                  className="preview-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    zIndex: 10,
                    rotate: index % 2 === 0 ? 5 : -5
                  }}
                >
                  <div className={`preview-pattern pattern-${item}`}></div>
                  <div className="preview-shimmer"></div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="floating-element element-1"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="element-icon">👗</div>
            </motion.div>

            <motion.div
              className="floating-element element-2"
              animate={{
                y: [0, 20, 0],
                rotate: [0, -10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="element-icon">✨</div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="scroll-line"
            animate={{ height: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="scroll-text">Scroll to explore</span>
        </motion.div>
      </div>

      <div className="diagonal-divider">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,0 L1200,100 L1200,100 L0,100 Z" fill="rgba(10, 25, 47, 0.5)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;