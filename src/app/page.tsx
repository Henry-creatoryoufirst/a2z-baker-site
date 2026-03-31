import Nav from '@/components/homepage/Nav';
import Hero from '@/components/homepage/Hero';
import Gallery from '@/components/homepage/Gallery';
import About from '@/components/homepage/About';
import Menu from '@/components/homepage/Menu';
import OrderForm from '@/components/homepage/OrderForm';
import Reviews from '@/components/homepage/Reviews';
import FloatingCTA from '@/components/homepage/FloatingCTA';
import Footer from '@/components/homepage/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Gallery />
      <About />
      <Menu />
      <OrderForm />
      <Reviews />
      <FloatingCTA />
      <Footer />
    </>
  );
}
