import Hero from "@/components/sections/Hero";
import IntroSection from "@/components/sections/IntroSection";
import ServicesSection from "@/components/sections/ServicesSection";

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col">
      <Hero />
      <ServicesSection />
      <IntroSection />
    </main>
  );
}
