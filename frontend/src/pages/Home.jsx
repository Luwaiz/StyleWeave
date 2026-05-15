import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WorkGrid from '../components/WorkGrid';
import Services from '../components/Services';
import Contact from '../components/Contact';

const Home = () => (
  <div className="home">
    {/* Background layers */}
    <div className="bg-grid" aria-hidden="true" />
    <div className="bg-vignette" aria-hidden="true" />
    <div className="bg-orb bg-orb--cyan" aria-hidden="true" />
    <div className="bg-orb bg-orb--purple" aria-hidden="true" />

    <Navbar />

    <main>
      <Hero />
      <WorkGrid />
      <Services />
      <Contact />
    </main>
  </div>
);

export default Home;
