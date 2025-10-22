import { HeroSection } from '@/components/organisms/sections/HeroSection';
import { FocusStatsSection } from '@/components/organisms/sections/FocusStatsSection';
import { ProductivitySection } from '@/components/organisms/sections/ProductivitySection';
import { DepartmentsSection } from '@/components/organisms/sections/DepartmentsSection';
import { TestimonialSection } from '@/components/organisms/sections/TestimonialSection';
import { GreenStatsSection } from '@/components/organisms/sections/GreenStatsSection';
import { IntegrationsSection } from '@/components/organisms/sections/IntegrationsSection';
import { SecondTestimonialSection } from '@/components/organisms/sections/SecondTestimonialSection';
import { StructuredData } from '@/components/seo/StructuredData';

export default function Home() {
  return (
    <>
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="SoftwareApplication" />
      <main className="min-h-screen bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] font-sans overflow-x-hidden transition-colors duration-300">
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
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950/20 dark:via-blue-900/20 dark:to-blue-800/20 transition-colors duration-300">
          <GreenStatsSection />
        </div>
        <div className="bg-[#f6f6f6] dark:bg-[#3d3d3d] transition-colors duration-300">
          <IntegrationsSection />
        </div>
        <div className="bg-gradient-to-b from-[#f6f6f6] to-white dark:from-[#3d3d3d] dark:to-[#121212] transition-colors duration-300">
          <SecondTestimonialSection />
        </div>
      </div>
    </main>
    </>
  );
}
