'use client';

import { useState, useEffect, useCallback } from 'react';

const galleryImages = [
  { src: '/images/gallery-01.jpg', alt: 'Red velvet cupcakes' },
  { src: '/images/gallery-02.jpg', alt: 'Cinnamon rolls' },
  { src: '/images/gallery-03.jpg', alt: 'Everything bagel' },
  { src: '/images/gallery-04.jpg', alt: 'Mini cheesecakes' },
  { src: '/images/gallery-05.jpg', alt: 'Pumpkin bars' },
  { src: '/images/gallery-06.jpg', alt: 'Cookie sandwiches' },
  { src: '/images/gallery-07.jpg', alt: 'Peanut butter pie' },
  { src: '/images/gallery-08.jpg', alt: 'Chocolate pie' },
  { src: '/images/gallery-09.jpg', alt: 'Swirl cupcakes' },
  { src: '/images/gallery-10.jpg', alt: 'Coffee cake' },
  { src: '/images/gallery-11.jpg', alt: 'Mini cheesecake box' },
  { src: '/images/gallery-12.jpg', alt: 'Cake pops' },
  { src: '/images/gallery-13.jpg', alt: 'Chocolate cake pops' },
  { src: '/images/gallery-14.jpg', alt: 'Sourdough bread' },
  { src: '/images/gallery-15.jpg', alt: 'Blueberry bagels' },
];

const row1 = galleryImages.slice(0, 5);
const row2 = galleryImages.slice(5, 10);
const row3 = galleryImages.slice(10, 15);

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const navLightbox = useCallback((dir: number) => {
    setCurrentIndex((prev) => (prev + dir + galleryImages.length) % galleryImages.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, navLightbox]);

  const renderRow = (images: typeof row1, startIndex: number) => {
    // Duplicate for infinite scroll
    const doubled = [...images, ...images];
    return doubled.map((img, i) => (
      <div
        key={`${startIndex}-${i}`}
        className="gallery-item"
        onClick={() => openLightbox(startIndex + (i % images.length))}
      >
        <img src={img.src} alt={img.alt} loading="lazy" />
      </div>
    ));
  };

  return (
    <>
      <section className="section gallery-section" id="gallery">
        <div className="container">
          <div className="gallery-rows">
            {/* Row 1: scrolls left */}
            <div className="gallery-row">
              {renderRow(row1, 0)}
            </div>
            {/* Row 2: scrolls right */}
            <div className="gallery-row">
              {renderRow(row2, 5)}
            </div>
            {/* Row 3: scrolls left (hidden on mobile) */}
            <div className="gallery-row gallery-row-desktop">
              {renderRow(row3, 10)}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div
        className={`lightbox${lightboxOpen ? ' active' : ''}`}
        id="lightbox"
        onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
      >
        <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">&times;</button>
        <button className="lightbox-nav lightbox-prev" onClick={() => navLightbox(-1)} aria-label="Previous">&#8249;</button>
        <img id="lightboxImg" src={galleryImages[currentIndex]?.src} alt="Gallery image" />
        <button className="lightbox-nav lightbox-next" onClick={() => navLightbox(1)} aria-label="Next">&#8250;</button>
      </div>
    </>
  );
}
