import Header from './components/Header';
import HeroSection from './components/HeroSection';
import WhySection from './components/WhySection';
import SandboxSection from './components/SandboxSection';
import DeepDiveSection from './components/DeepDiveSection';
import TechStackSection from './components/TechStackSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="selection:bg-brand-surface selection:text-brand-text">
      <Header />
      <HeroSection />
      <WhySection />
      <SandboxSection />
      <DeepDiveSection />
      <TechStackSection />
      <Footer />
    </div>
  )
}

export default App
