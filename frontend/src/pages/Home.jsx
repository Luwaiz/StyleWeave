import React from 'react';
import Navbar from '../components/Navbar';
import '../assets/styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <Navbar />
      
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">
              <span className="title-line">Visualize Your</span>
              <span className="title-line gold-gradient">Ankara Dreams</span>
              <span className="title-line">Before You Sew</span>
            </h1>
            <p className="hero-description">
              Transform your fabric selection with intelligent AI. See exactly how 
              your chosen Ankara will look on any design—from elegant gowns to 
              trendy tops—all before cutting a single thread.
            </p>
            <div className="hero-buttons">
              <button className="primary-btn">
                Try It Now ✨
              </button>
              <button className="secondary-btn">
                Watch Demo ▶
              </button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Style<span className="gold-text">Weave</span></h3>
              <p>Weaving tradition with innovation</p>
            </div>
            <div className="footer-social">
              <p>© 2024 StyleWeave. Crafted with ❤️ in Nigeria</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;