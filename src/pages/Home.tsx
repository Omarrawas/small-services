import Hero from "@/sections/Hero";
import CategoriesSection from "@/sections/CategoriesSection";
import FeaturedServices from "@/sections/FeaturedServices";
import HowItWorks from "@/sections/HowItWorks";
import TopSellers from "@/sections/TopSellers";
import TrustGuarantees from "@/sections/TrustGuarantees";
import CTABanner from "@/sections/CTABanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <CategoriesSection />
        <FeaturedServices />
        <HowItWorks />
        <TopSellers />
        <TrustGuarantees />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
