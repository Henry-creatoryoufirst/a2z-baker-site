'use client';

import { useEffect } from 'react';
import ScrollReveal from './ScrollReveal';

export default function OrderForm() {
  useEffect(() => {
    const dateInput = document.getElementById('orderDate') as HTMLInputElement | null;
    if (dateInput) {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      dateInput.min = minDate.toISOString().split('T')[0];
    }
  }, []);

  return (
    <section className="section order-section" id="order">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-label">Ready to Order?</span>
            <h2 className="section-title">Place Your Order</h2>
            <div className="section-divider"></div>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="order-form-wrap">
            <form action="https://formsubmit.co/Achristinez90@gmail.com" method="POST">
              {/* FormSubmit config */}
              <input type="hidden" name="_subject" value="New A2Z Bakerie Order!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="https://a2zbakerie.com/#order" />
              <input type="text" name="_honey" style={{ display: 'none' }} />

              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input type="text" name="name" required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" name="email" required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" placeholder="(555) 555-5555" />
              </div>
              <div className="form-group">
                <label>What would you like to order? <span className="required">*</span></label>
                <textarea name="order" required placeholder="Tell me what you'd like! Include flavors, quantities, and any special requests."></textarea>
              </div>
              <div className="form-group">
                <label>When do you need it?</label>
                <input type="date" name="date" id="orderDate" />
              </div>
              <div className="form-group">
                <label>Allergies / Special Requests</label>
                <textarea name="allergies" placeholder="Any allergies or dietary needs? (GF, egg-free, dairy-free options available)" rows={3}></textarea>
              </div>
              <button type="submit" className="btn-primary form-submit">Send My Order</button>
              <p className="form-note">Orders require at least 1 week lead time. I&apos;ll text or email you within 24 hours to confirm.</p>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
