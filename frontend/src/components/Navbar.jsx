import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="nav-container">
        {/* Logo */}
        <motion.div 
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
        >
          <span className="logo-text">Style</span>
          <span className="logo-accent">Weave</span>
          <div className="logo-underline"></div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="nav-menu">
          {['Home', 'Gallery', 'Try-On', 'About'].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -2 }}
            >
              {item}
              <span className="link-dot"></span>
            </motion.a>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          className="nav-cta"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Get Started</span>
          <div className="cta-glow"></div>
        </motion.button>

        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        initial={false}
        animate={{ height: menuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        {['Home', 'Gallery', 'Try-On', 'About'].map((item) => (
            <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
        <button className="mobile-cta">Get Started</button>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;