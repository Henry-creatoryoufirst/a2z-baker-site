'use client';

import { useState, useEffect } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const heroTagline = document.querySelector('.hero-tagline');
      if (heroTagline) {
        const taglineGone = heroTagline.getBoundingClientRect().bottom < 72;
        setTaglineVisible(taglineGone);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileToggle = () => {
    setMobileMenuOpen((prev) => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 72;
      const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="/images/logo.png" alt="A2Z Bakerie Logo" />
          </a>
          <span className={`nav-tagline${taglineVisible ? ' visible' : ''}`} id="navTagline">Chemist in the Kitchen</span>
          <div className="nav-links">
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a>
            <a href="#menu" onClick={(e) => handleNavClick(e, '#menu')}>Menu</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, '#gallery')}>Gallery</a>
            <a href="#reviews" onClick={(e) => handleNavClick(e, '#reviews')}>Reviews</a>
            <a href="#order" className="nav-order-btn" onClick={(e) => handleNavClick(e, '#order')}>Order</a>
          </div>
          <div
            className={`hamburger${mobileMenuOpen ? ' active' : ''}`}
            id="hamburger"
            aria-label="Toggle menu"
            onClick={handleMobileToggle}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${mobileMenuOpen ? ' active' : ''}`} id="mobileMenu">
        <a href="#about" className="mobile-link" onClick={(e) => handleNavClick(e, '#about')}>About</a>
        <a href="#menu" className="mobile-link" onClick={(e) => handleNavClick(e, '#menu')}>Menu</a>
        <a href="#gallery" className="mobile-link" onClick={(e) => handleNavClick(e, '#gallery')}>Gallery</a>
        <a href="#reviews" className="mobile-link" onClick={(e) => handleNavClick(e, '#reviews')}>Reviews</a>
        <a href="#order" className="mobile-link mobile-order-btn" onClick={(e) => handleNavClick(e, '#order')}>Order</a>
      </div>
    </>
  );
}
