import BusinessProblemsSection from "@/components/sections/BusinessProblemsSection";
import ContactSection from "@/components/sections/ContactSection";
import CustomSoftwareSection from "@/components/sections/CustomSoftwareSection";
import CybersecuritySection from "@/components/sections/CybersecuritySection";
import DedicatedSupportSection from "@/components/sections/DedicatedSupportSection";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import IntroSection from "@/components/sections/IntroSection";
import PrivateAISection from "@/components/sections/PrivateAISection";
import ServicesSection from "@/components/sections/ServicesSection";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col">
      <Hero />
      <BusinessProblemsSection />
      <ServicesSection />
      <PrivateAISection />
      <CustomSoftwareSection />
      <CybersecuritySection />
      <DedicatedSupportSection />
      <IntroSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
