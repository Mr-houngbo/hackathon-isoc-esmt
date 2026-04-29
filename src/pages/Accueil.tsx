import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/landing/HeroSection";
import HackathonExplained from "@/components/landing/HackathonExplained";
import WhyParticipate from "@/components/landing/WhyParticipate";
import VideoRecapSection from "@/components/landing/VideoRecapSection";
import CTASection from "@/components/landing/CTASection";

const Accueil = () => (
  <Layout>
    <HeroSection />
    <VideoRecapSection />
    <HackathonExplained />
    <WhyParticipate />
    <CTASection />
  </Layout>
);

export default Accueil;
