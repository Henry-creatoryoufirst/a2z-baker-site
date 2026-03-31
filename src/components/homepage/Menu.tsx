import ScrollReveal from './ScrollReveal';

export default function Menu() {
  return (
    <section className="section menu-section" id="menu">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-label">What We Bake</span>
            <h2 className="section-title">The Menu</h2>
            <div className="section-divider"></div>
          </div>
        </ScrollReveal>
        <div className="menu-categories">
          {/* Fan Favorites */}
          <ScrollReveal>
            <div className="menu-category">
              <h3 className="menu-category-title">
                <span className="menu-category-icon">&#9733;</span>
                Fan Favorites
              </h3>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Bagels</span>
                  <span className="menu-item-price">6 for $15</span>
                </div>
                <p className="menu-item-desc">Plain, asiago, everything, sesame, cinnamon sugar, blueberry</p>
              </div>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Mini Cheesecakes</span>
                  <span className="menu-item-price">12 for $30</span>
                </div>
                <p className="menu-item-desc">Plain, strawberry, Oreo. Crust options: graham cracker, Biscoff, Oreo</p>
              </div>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Cookie Cake</span>
                  <span className="menu-item-price">$24 / double $48</span>
                </div>
                <p className="menu-item-desc">Chocolate chip with vanilla or chocolate frosting</p>
              </div>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Coffee Cake</span>
                  <span className="menu-item-price">$24</span>
                </div>
                <p className="menu-item-desc">Buttery base with brown sugar crumb topping</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Baked Beauties */}
          <ScrollReveal>
            <div className="menu-category">
              <h3 className="menu-category-title">
                <span className="menu-category-icon">&#10022;</span>
                Baked Beauties
              </h3>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Cookies</span>
                  <span className="menu-item-price">12 for $24-$38</span>
                </div>
                <p className="menu-item-desc">Chocolate chip, brown butter chocolate chip, double chocolate, peanut butter, frosted butter cookies. Sandwich style: 12 for $38</p>
              </div>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Cupcakes</span>
                  <span className="menu-item-price">12 for $30</span>
                </div>
                <p className="menu-item-desc">Red velvet, cookie butter, chocolate, vanilla, peanut butter, lemon blueberry</p>
              </div>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Cake &amp; Pie</span>
                  <span className="menu-item-price">$35-$50</span>
                </div>
                <p className="menu-item-desc">Cake: chocolate, vanilla, funfetti, red velvet, other upon request. Pie: Oreo, peanut butter, chocolate silk, pumpkin, apple, other upon request. Cake pops: 12 for $15</p>
              </div>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Bread &amp; Muffins</span>
                  <span className="menu-item-price">$26 / 12 for $30</span>
                </div>
                <p className="menu-item-desc">Zucchini, banana nut, blueberry, pumpkin. Pumpkin bars w/ cream cheese frosting</p>
              </div>
              <div className="menu-item">
                <div className="menu-item-header">
                  <span className="menu-item-name">Cinnamon Rolls</span>
                  <span className="menu-item-price">12 for $36</span>
                </div>
                <p className="menu-item-desc">Sold ready to bake with vanilla bean icing</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="menu-notes">
            <p><strong>Custom orders always welcome</strong> - just ask!</p>
            <p>Allergy-friendly options available: gluten-free, egg-free, dairy-free</p>
            <p>$5 delivery within Cincinnati &bull; 1 week lead time &bull; Prices subject to change</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
