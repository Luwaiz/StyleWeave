import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import FabricShowcase from '../components/FabricShowcase';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import '../assets/styles/Home.css';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* Animated background shapes */}
      <div className="bg-shapes">
        <motion.div 
          className="shape shape-1"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="shape shape-2"
          animate={{ 
            rotate: [360, 0],
            y: [0, 50, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="shape shape-3"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Navbar />
      
      <main className="main-content">
        <HeroSection scrollY={scrollY} />
        
        <section className="features-section">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <FeatureCards />
          </motion.div>
        </section>

        <section className="showcase-section">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <FabricShowcase />
          </motion.div>
        </section>

        {/* Call to action */}
        <section className="cta-section">
          <motion.div
            className="cta-container"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="cta-glow"></div>
            <h2 className="cta-title">Ready to Transform Your Vision?</h2>
            <p className="cta-text">
              Experience the future of Nigerian fashion design. 
              Visualize your Ankara dreams before they become reality.
            </p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating
              <span className="button-arrow">→</span>
            </motion.button>
          </motion.div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Style<span className="gold-text">Weave</span></h3>
            <p>Weaving tradition with innovation</p>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-social">
            <p>© 2024 StyleWeave. Crafted with ❤️ in Nigeria</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;