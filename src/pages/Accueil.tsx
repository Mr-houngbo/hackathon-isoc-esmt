import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/landing/HeroSection";
import HackathonExplained from "@/components/landing/HackathonExplained";
import WhyParticipate from "@/components/landing/WhyParticipate";
import PrizesSection from "@/components/landing/PrizesSection";
import ProgrammePreview from "@/components/landing/ProgrammePreview";
import CTASection from "@/components/landing/CTASection";

const Accueil = () => (
  <Layout>
    <HeroSection />
    <HackathonExplained />
    <WhyParticipate />
    <PrizesSection />
    <ProgrammePreview />
    <CTASection />
    
      </Layout>
);

export default Accueil;
