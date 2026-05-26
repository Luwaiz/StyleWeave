import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const SOCIALS = [
  {
    label: 'Instagram',
    handle: '@prodbychido_',
    href: 'https://www.instagram.com/prodbychido_?igsh=MTkwbjVqeHJ1NGt4Ng%3D%3D&utm_source=qr',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    handle: '@prodbychido',
    href: 'https://www.tiktok.com/@prodbychido?_r=1&_t=ZS-96NrtacIBM4',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'Chidera Uwannah',
    href: 'https://www.linkedin.com/in/chidera-uwannah-05a548297?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 10v7M7 7v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 17v-4c0-1.1.9-2 2-2s2 .9 2 2v4M11 10v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1], delay: i * 0.1 },
  }),
};

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Replace with real form submission (Formspree, EmailJS, etc.) */
    setSubmitted(true);
  };

  return (
    <section id="contact" className="contact-section">
      {/* Heading */}
      <motion.div
        className="contact-section__header"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className="section-label">Get in Touch</p>
        <h2 className="section-title">
          Let's <span className="gradient-text">Create</span>
        </h2>
        <p className="contact-section__subtitle">
          Have a project in mind? I'd love to hear about it. Send a message
          or reach out directly on any platform below.
        </p>
      </motion.div>

      <div className="contact-layout">
        {/* ── Form ── */}
        <motion.div
          className="contact-form-wrap glass-panel"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {submitted ? (
            <div className="contact-success">
              <span className="contact-success__icon">✓</span>
              <h3>Message received.</h3>
              <p>I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="you@email.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-input form-textarea"
                  placeholder="Tell me about your project..."
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn-primary contact-submit">
                Send Message
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          )}
        </motion.div>

        {/* ── Side Info ── */}
        <motion.div
          className="contact-info"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Direct email */}
          <div className="contact-direct">
            <p className="contact-direct__label">Direct Email</p>
            <a
              href="mailto:Freduwann@gmail.com"
              className="contact-direct__email"
            >
              Freduwann@gmail.com
            </a>
            <p className="contact-direct__note">
              Response within 24 hours on business days.
            </p>
          </div>

          {/* Socials */}
          <div className="contact-socials">
            <p className="contact-socials__label">Find Me Online</p>
            <div className="contact-socials__list">
              {SOCIALS.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link glass-panel"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 4 }}
                >
                  <span className="social-link__icon">{social.icon}</span>
                  <span className="social-link__info">
                    <span className="social-link__platform">{social.label}</span>
                    <span className="social-link__handle">{social.handle}</span>
                  </span>
                  <svg className="social-link__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <motion.footer
        className="site-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="site-footer__inner">
          <p className="site-footer__brand">
            <span className="footer-bracket">[</span>
            <span className="footer-initials">CU</span>
            <span className="footer-bracket">]</span>
          </p>
          <p className="site-footer__copy">
            © {new Date().getFullYear()} Chidera Uwannah. Crafted with intent.
          </p>
          <p className="site-footer__location">
            Lagos, Nigeria
          </p>
        </div>
      </motion.footer>
    </section>
  );
};

export default Contact;
