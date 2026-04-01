import Nav from '@/components/homepage/Nav';
import Hero from '@/components/homepage/Hero';
import Gallery from '@/components/homepage/Gallery';
import About from '@/components/homepage/About';
import MenuAndOrder from '@/components/homepage/MenuAndOrder';
import Reviews from '@/components/homepage/Reviews';
import Shop from '@/components/homepage/Shop';
import FloatingCTA from '@/components/homepage/FloatingCTA';
import Footer from '@/components/homepage/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Gallery />
      <About />
      <MenuAndOrder />
      <Reviews />
      <Shop />
      <FloatingCTA />
      <Footer />
    </>
  );
}
