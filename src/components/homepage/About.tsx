import ScrollReveal from './ScrollReveal';

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-label">Our Story</span>
            <h2 className="section-title">A Little About Ann</h2>
            <div className="section-divider"></div>
          </div>
        </ScrollReveal>
        <div className="about-grid about-grid--no-image">
          <ScrollReveal>
            <div className="about-text">
              <h3>Where Science Meets Soul</h3>
              <p>Hi! I&apos;m Ann - a chemist by degree, baker by heart, and lifelong lover of sugar.</p>
              <p>I first fell in love with baking in my grandma&apos;s kitchen. From a young age, I watched her hand-make everything with care, patience, and intention. Every Valentine&apos;s Day, she baked heart-shaped butter cookies for more than 25 people, packaging each one in a little bag with their name on it. Every single year. Those moments left a lasting impression on me.</p>
              <p>Today, I still bake using her original KitchenAid mixer, and every time I turn it on, it feels like she&apos;s right there with me.</p>
              <p>My background in chemistry naturally finds its way into the kitchen, bringing precision and consistency to every recipe - balanced with a whole lot of love. What began as baking for friends and family quickly grew into something more.</p>
              <p>A2Z Bakerie is a made-to-order home bakery serving the Cincinnati area. Everything is baked fresh, never mass-produced, and never sitting on a shelf. Since 2025, I&apos;ve built a loyal local following through word of mouth and Instagram, one carefully crafted batch at a time. From cinnamon rolls to cheesecakes, every order gets the same care you&apos;d put into something made for your own family.</p>
              <p>My goal is simple: to bring you a little joy in every bite. Thanks so much for stopping by - I can&apos;t wait to bake something sweet for you. And I hope you&apos;re along for the experiment.</p>
              <p>Bonus points if you say bagel correctly... if you know, you know.</p>
              <p className="about-signature">- Ann, A2Z Bakerie</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
