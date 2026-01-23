import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import SlotAvailability from "../components/home/SlotAvailability";
import HowItWorks from "../components/home/HowItWorks";
import Footer from "../components/home/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content pushed below header */}
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <SlotAvailability />
        <HowItWorks />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
