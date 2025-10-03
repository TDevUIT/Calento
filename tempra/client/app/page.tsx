import {
  Header,
  Footer,
  HeroSection,
  FocusStatsSection,
  ProductivitySection,
  DepartmentsSection,
  TestimonialSection,
  GreenStatsSection,
  IntegrationsSection,
  PlatformIntegrationSection,
  SecondTestimonialSection,
} from "@/components/organisms";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] font-sans overflow-x-hidden transition-colors duration-300">
      <Header />
      <div className="relative bg-white dark:bg-[#121212] transition-colors duration-300">
        <HeroSection />
        <div className="bg-[#f6f6f6] dark:bg-[#3d3d3d] transition-colors duration-300">
          <FocusStatsSection />
        </div>
        <div className="bg-white dark:bg-[#121212] transition-colors duration-300">
          <ProductivitySection />
        </div>
        <div className="bg-[#f6f6f6] dark:bg-[#3d3d3d] transition-colors duration-300">
          <DepartmentsSection />
        </div>
        <div className="bg-white dark:bg-[#121212] transition-colors duration-300">
          <TestimonialSection />
        </div>
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 transition-colors duration-300">
          <GreenStatsSection />
        </div>
        <div className="bg-[#f6f6f6] dark:bg-[#3d3d3d] transition-colors duration-300">
          <IntegrationsSection />
        </div>
        <div className="bg-white dark:bg-[#121212] transition-colors duration-300">
          <PlatformIntegrationSection />
        </div>
        <div className="bg-gradient-to-b from-[#f6f6f6] to-white dark:from-[#3d3d3d] dark:to-[#121212] transition-colors duration-300">
          <SecondTestimonialSection />
        </div>
      </div>
      <Footer />
    </main>
  );
}