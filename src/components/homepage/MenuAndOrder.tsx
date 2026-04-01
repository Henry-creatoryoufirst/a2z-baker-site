'use client';

import { useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';

const CATEGORIES = [
  {
    name: 'Fan Favorites',
    icon: '★',
    items: [
      { name: 'Bagels', price: '6 for $15', desc: 'Plain, asiago, everything, sesame, cinnamon sugar, blueberry' },
      { name: 'Mini Cheesecakes', price: '12 for $30', desc: 'Plain, strawberry, Oreo. Crust options: graham cracker, Biscoff, Oreo' },
      { name: 'Cookie Cake', price: '$24 / double $48', desc: 'Chocolate chip with vanilla or chocolate frosting' },
      { name: 'Coffee Cake', price: '$24', desc: 'Buttery base with brown sugar crumb topping' },
    ],
  },
  {
    name: 'Baked Beauties',
    icon: '✦',
    items: [
      { name: 'Cookies', price: '12 for $24–$38', desc: 'Chocolate chip, brown butter chocolate chip, double chocolate, peanut butter, frosted butter cookies. Sandwich style: 12 for $38' },
      { name: 'Cupcakes', price: '12 for $30', desc: 'Red velvet, cookie butter, chocolate, vanilla, peanut butter, lemon blueberry' },
      { name: 'Cake & Pie', price: '$35–$50', desc: 'Cake: chocolate, vanilla, funfetti, red velvet. Pie: Oreo, peanut butter, chocolate silk, pumpkin, apple. Cake pops: 12 for $15' },
      { name: 'Bread & Muffins', price: '$26 / 12 for $30', desc: 'Zucchini, banana nut, blueberry, pumpkin. Pumpkin bars w/ cream cheese frosting' },
      { name: 'Cinnamon Rolls', price: '12 for $36', desc: 'Sold ready to bake with vanilla bean icing' },
    ],
  },
];

export default function MenuAndOrder() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dateInput = document.getElementById('orderDate') as HTMLInputElement | null;
    if (dateInput) {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      dateInput.min = minDate.toISOString().split('T')[0];
    }
  }, []);

  return (
    <section className="mo-section" id="menu">
      <div className="mo-container">
        <ScrollReveal>
          <div className="mo-header">
            <span className="mo-label">What We Bake</span>
            <h2 className="mo-title">Menu & Order</h2>
            <div className="mo-divider" />
            <p className="mo-subtitle">Browse our menu, then place your order — all in one spot.</p>
          </div>
        </ScrollReveal>

        <div className="mo-layout" id="order">
          {/* LEFT: Menu */}
          <div className="mo-menu-side">
            {/* Category Tabs */}
            <div className="mo-tabs">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.name}
                  className={`mo-tab ${activeCategory === i ? 'active' : ''}`}
                  onClick={() => setActiveCategory(i)}
                >
                  <span className="mo-tab-icon">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Scrollable Menu Items */}
            <div className="mo-menu-scroll">
              {CATEGORIES[activeCategory].items.map((item, i) => (
                <div key={item.name} className="mo-item" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="mo-item-top">
                    <span className="mo-item-name">{item.name}</span>
                    <span className="mo-item-dots" />
                    <span className="mo-item-price">{item.price}</span>
                  </div>
                  <p className="mo-item-desc">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Menu Notes */}
            <div className="mo-notes">
              <p><strong>Custom orders always welcome</strong> — just ask!</p>
              <p>Allergy-friendly: GF, egg-free, dairy-free options available</p>
              <p>$5 delivery in Cincinnati · 1 week lead time</p>
            </div>
          </div>

          {/* RIGHT: Order Form */}
          <div className="mo-order-side">
            <div className="mo-order-card">
              <div className="mo-order-header">
                <h3>Place Your Order</h3>
                <p>Tell us what you&apos;d like and we&apos;ll get back to you within 24 hours.</p>
              </div>

              {submitted ? (
                <div className="mo-success">
                  <div className="mo-success-icon">✓</div>
                  <h4>Order Submitted!</h4>
                  <p>Thanks! Ann will text or email you within 24 hours to confirm details and pricing.</p>
                  <button className="mo-reset-btn" onClick={() => setSubmitted(false)}>
                    Place Another Order
                  </button>
                </div>
              ) : (
                <form
                  action="https://formsubmit.co/Achristinez90@gmail.com"
                  method="POST"
                  onSubmit={() => setTimeout(() => setSubmitted(true), 100)}
                >
                  <input type="hidden" name="_subject" value="New A2Z Bakerie Order!" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_next" value="https://a2zbakerie.com/#order" />
                  <input type="text" name="_honey" style={{ display: 'none' }} />

                  <div className="mo-field">
                    <label>Name <span className="req">*</span></label>
                    <input type="text" name="name" required placeholder="Your name" />
                  </div>
                  <div className="mo-field-row">
                    <div className="mo-field">
                      <label>Email <span className="req">*</span></label>
                      <input type="email" name="email" required placeholder="your@email.com" />
                    </div>
                    <div className="mo-field">
                      <label>Phone</label>
                      <input type="tel" name="phone" placeholder="(555) 555-5555" />
                    </div>
                  </div>
                  <div className="mo-field">
                    <label>What would you like? <span className="req">*</span></label>
                    <textarea name="order" required placeholder="Include items, flavors, quantities, and any special requests..." rows={4} />
                  </div>
                  <div className="mo-field-row">
                    <div className="mo-field">
                      <label>Date Needed</label>
                      <input type="date" name="date" id="orderDate" />
                    </div>
                    <div className="mo-field">
                      <label>Allergies</label>
                      <input type="text" name="allergies" placeholder="GF, dairy-free, etc." />
                    </div>
                  </div>
                  <button type="submit" className="mo-submit-btn">
                    Send My Order
                  </button>
                  <p className="mo-form-note">Orders require at least 1 week lead time.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mo-section {
          padding: 100px 0;
          position: relative;
          z-index: 2;
          background: var(--white, #fff);
        }

        .mo-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ─── Header ─── */
        .mo-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .mo-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rose, #C4907C);
          display: block;
          margin-bottom: 12px;
        }
        .mo-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          color: var(--brown, #3D2B1F);
          font-weight: 600;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        .mo-divider {
          width: 60px;
          height: 2px;
          background: var(--gold, #C9A96E);
          margin: 0 auto;
        }
        .mo-subtitle {
          font-size: 1rem;
          color: var(--brown-light, #5a4638);
          margin-top: 16px;
          line-height: 1.7;
        }

        /* ─── Layout ─── */
        .mo-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        /* ─── Menu Side ─── */
        .mo-menu-side {
          background: var(--cream, #FBF7F2);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(61, 43, 31, 0.06);
          box-shadow: 0 4px 24px rgba(61, 43, 31, 0.04);
        }

        .mo-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .mo-tab {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid rgba(61, 43, 31, 0.08);
          border-radius: 12px;
          background: transparent;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--brown-light, #5a4638);
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .mo-tab:hover {
          border-color: var(--rose, #C4907C);
          color: var(--brown, #3D2B1F);
        }
        .mo-tab.active {
          background: var(--brown, #3D2B1F);
          color: white;
          border-color: var(--brown, #3D2B1F);
        }
        .mo-tab-icon { font-size: 0.9rem; }

        .mo-menu-scroll {
          max-height: 420px;
          overflow-y: auto;
          padding-right: 8px;
          scrollbar-width: thin;
          scrollbar-color: rgba(196, 144, 124, 0.3) transparent;
        }
        .mo-menu-scroll::-webkit-scrollbar { width: 5px; }
        .mo-menu-scroll::-webkit-scrollbar-track { background: transparent; }
        .mo-menu-scroll::-webkit-scrollbar-thumb { background: rgba(196, 144, 124, 0.3); border-radius: 4px; }
        .mo-menu-scroll::-webkit-scrollbar-thumb:hover { background: rgba(196, 144, 124, 0.5); }

        @keyframes itemIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .mo-item {
          padding: 16px 0;
          border-bottom: 1px solid rgba(61, 43, 31, 0.06);
          animation: itemIn 0.3s ease forwards;
          opacity: 0;
        }
        .mo-item:last-child { border-bottom: none; }
        .mo-item-top {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
        }
        .mo-item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--brown, #3D2B1F);
          white-space: nowrap;
        }
        .mo-item-dots {
          flex: 1;
          border-bottom: 1.5px dotted rgba(61, 43, 31, 0.15);
          margin-bottom: 4px;
          min-width: 20px;
        }
        .mo-item-price {
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          color: var(--rose, #C4907C);
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .mo-item-desc {
          font-size: 0.85rem;
          color: var(--brown-light, #5a4638);
          line-height: 1.6;
        }

        .mo-notes {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(61, 43, 31, 0.08);
        }
        .mo-notes p {
          font-size: 0.82rem;
          color: var(--brown-light, #5a4638);
          margin-bottom: 4px;
          line-height: 1.6;
          text-align: center;
        }
        .mo-notes strong {
          color: var(--brown, #3D2B1F);
          font-weight: 500;
        }

        /* ─── Order Side ─── */
        .mo-order-side {
          position: sticky;
          top: 88px;
        }
        .mo-order-card {
          background: var(--cream, #FBF7F2);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid rgba(61, 43, 31, 0.06);
          box-shadow: 0 4px 24px rgba(61, 43, 31, 0.04);
        }
        .mo-order-header {
          margin-bottom: 24px;
        }
        .mo-order-header h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--brown, #3D2B1F);
          margin-bottom: 6px;
          line-height: 1.2;
        }
        .mo-order-header p {
          font-size: 0.88rem;
          color: var(--brown-light, #5a4638);
          line-height: 1.5;
        }

        /* Fields */
        .mo-field {
          margin-bottom: 16px;
        }
        .mo-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .mo-field label {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brown, #3D2B1F);
          margin-bottom: 6px;
        }
        .req { color: var(--rose, #C4907C); }
        .mo-field input,
        .mo-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid rgba(61, 43, 31, 0.08);
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          background: white;
          color: var(--brown, #3D2B1F);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .mo-field input::placeholder,
        .mo-field textarea::placeholder {
          color: rgba(61, 43, 31, 0.25);
        }
        .mo-field input:focus,
        .mo-field textarea:focus {
          outline: none;
          border-color: var(--rose, #C4907C);
          box-shadow: 0 0 0 3px rgba(196, 144, 124, 0.12);
        }
        .mo-field textarea { resize: vertical; }

        .mo-submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--rose, #C4907C) 0%, #b37d6a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(196, 144, 124, 0.25);
          margin-top: 4px;
        }
        .mo-submit-btn:hover {
          background: linear-gradient(135deg, var(--brown, #3D2B1F) 0%, #2a1d14 100%);
          box-shadow: 0 4px 20px rgba(61, 43, 31, 0.25);
          transform: translateY(-1px);
        }

        .mo-form-note {
          text-align: center;
          font-size: 0.78rem;
          color: rgba(61, 43, 31, 0.4);
          margin-top: 12px;
          line-height: 1.5;
        }

        /* Success State */
        .mo-success {
          text-align: center;
          padding: 32px 16px;
        }
        .mo-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .mo-success h4 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: var(--brown, #3D2B1F);
          margin-bottom: 8px;
        }
        .mo-success p {
          font-size: 0.9rem;
          color: var(--brown-light, #5a4638);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .mo-reset-btn {
          padding: 10px 24px;
          background: transparent;
          border: 1.5px solid var(--rose, #C4907C);
          color: var(--rose, #C4907C);
          border-radius: 50px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
        }
        .mo-reset-btn:hover {
          background: var(--rose, #C4907C);
          color: white;
        }

        /* ─── Mobile ─── */
        @media (max-width: 900px) {
          .mo-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .mo-order-side {
            position: static;
          }
          .mo-menu-scroll {
            max-height: 360px;
          }
        }

        @media (max-width: 600px) {
          .mo-section { padding: 72px 0; }
          .mo-menu-side { padding: 20px; border-radius: 16px; }
          .mo-order-card { padding: 24px; border-radius: 16px; }
          .mo-tabs { flex-direction: column; }
          .mo-field-row { grid-template-columns: 1fr; }
          .mo-field input, .mo-field textarea { font-size: 16px; }
        }
      `}</style>
    </section>
  );
}
