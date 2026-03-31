'use client';

import { useState, useEffect } from 'react';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      const orderEl = document.getElementById('order');
      if (!heroEl || !orderEl) return;

      const pastHero = window.scrollY > heroEl.offsetHeight;
      const nearOrder = orderEl.getBoundingClientRect().top < window.innerHeight * 1.2;
      setVisible(pastHero && !nearOrder);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector('#order');
    if (target) {
      const offset = 72;
      const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#order"
      className={`floating-cta${visible ? ' visible' : ''}`}
      id="floatingCta"
      onClick={handleClick}
    >
      Make an Order
    </a>
  );
}
