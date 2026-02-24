import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import Footer from "../components/home/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}