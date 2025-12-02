import Hero from "@/components/Hero";
import MissionSection from "@/components/MissionSection";
import ProjectsSection from "@/components/ProjectsSection";
import NewsletterSection from "@/components/NewsletterSection";
import CTASection from "@/components/CTASection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <MissionSection />
      <ProjectsSection />
      {/* <NewsletterSection /> */}
      <CTASection />
    </div>
  );
};

export default Home;
