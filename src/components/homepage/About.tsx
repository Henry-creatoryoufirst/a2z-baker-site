'use client';

import ScrollReveal from './ScrollReveal';

export default function About() {
  return (
    <section className="about-section-v2" id="about">
      <div className="about-container">
        <ScrollReveal>
          <div className="about-header">
            <span className="about-label">Our Story</span>
            <h2 className="about-title">A Little About Ann</h2>
            <div className="about-divider" />
          </div>
        </ScrollReveal>

        <div className="about-card">
          <div className="about-card-inner">
            <h3 className="about-subtitle">Where Science Meets Soul</h3>

            <div className="about-scroll-area">
              <p>Hi! I&apos;m Ann — a chemist by degree, baker by heart, and lifelong lover of sugar.</p>

              <p>I first fell in love with baking in my grandma&apos;s kitchen. From a young age, I watched her hand-make everything with care, patience, and intention. Every Valentine&apos;s Day, she baked heart-shaped butter cookies for more than 25 people, packaging each one in a little bag with their name on it. Every single year. Those moments left a lasting impression on me.</p>

              <p>Today, I still bake using her original KitchenAid mixer, and every time I turn it on, it feels like she&apos;s right there with me.</p>

              <p>My background in chemistry naturally finds its way into the kitchen, bringing precision and consistency to every recipe — balanced with a whole lot of love. What began as baking for friends and family quickly grew into something more.</p>

              <p>A2Z Bakerie is a made-to-order home bakery serving the Cincinnati area. Everything is baked fresh, never mass-produced, and never sitting on a shelf. Since 2025, I&apos;ve built a loyal local following through word of mouth and Instagram, one carefully crafted batch at a time. From cinnamon rolls to cheesecakes, every order gets the same care you&apos;d put into something made for your own family.</p>

              <p>My goal is simple: to bring you a little joy in every bite. Thanks so much for stopping by — I can&apos;t wait to bake something sweet for you. And I hope you&apos;re along for the experiment.</p>

              <p className="about-fun">Bonus points if you say bagel correctly... if you know, you know.</p>
            </div>

            <div className="about-signature">— Ann, A2Z Bakerie</div>
          </div>

          <div className="about-scroll-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            <span>Scroll to read more</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-section-v2 {
          padding: 100px 0;
          position: relative;
          z-index: 2;
          background: var(--cream, #FBF7F2);
        }
        .about-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .about-header { text-align: center; margin-bottom: 40px; }
        .about-label {
          font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose, #C4907C);
          display: block; margin-bottom: 12px;
        }
        .about-title {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 5vw, 3.2rem);
          color: var(--brown, #3D2B1F); font-weight: 600; margin-bottom: 16px; line-height: 1.2;
        }
        .about-divider { width: 60px; height: 2px; background: var(--gold, #C9A96E); margin: 0 auto; }

        /* Card */
        .about-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(61, 43, 31, 0.06);
          border: 1px solid rgba(61, 43, 31, 0.05);
          position: relative;
        }
        .about-card-inner {
          padding: 36px 40px 24px;
        }

        .about-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--brown, #3D2B1F);
          margin-bottom: 20px;
          text-align: center;
        }

        /* Scrollable area */
        .about-scroll-area {
          max-height: 280px;
          overflow-y: auto;
          padding-right: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(196, 144, 124, 0.25) transparent;
          mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
        }
        .about-scroll-area::-webkit-scrollbar { width: 4px; }
        .about-scroll-area::-webkit-scrollbar-track { background: transparent; }
        .about-scroll-area::-webkit-scrollbar-thumb { background: rgba(196, 144, 124, 0.25); border-radius: 4px; }
        .about-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(196, 144, 124, 0.5); }

        .about-scroll-area p {
          font-size: 1rem;
          color: var(--brown-light, #5a4638);
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .about-fun {
          font-style: italic;
          color: var(--rose, #C4907C) !important;
        }

        .about-signature {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-style: italic;
          color: var(--rose, #C4907C);
          text-align: center;
          padding: 12px 0 8px;
        }

        .about-scroll-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%);
          color: rgba(61, 43, 31, 0.3);
          font-size: 0.72rem;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation: bobDown 2s ease-in-out infinite;
        }
        @keyframes bobDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        @media (max-width: 600px) {
          .about-section-v2 { padding: 72px 0; }
          .about-card-inner { padding: 28px 24px 20px; }
          .about-scroll-area { max-height: 240px; }
        }
      `}</style>
    </section>
  );
}
