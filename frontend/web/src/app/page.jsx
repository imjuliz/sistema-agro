//landing page
import CTA from "../components/Home/sections/cta/default";
import FAQ from "../components/Home/sections/faq/default";
import Footer from "../components/Home/sections/footer/default";
import Hero from "../components/Home/sections/hero/default";
import Items from "../components/Home/sections/items/default";
import Logos from "../components/Home/sections/logos/default";
import Navbar from "../components/Home/sections/navbar/default";
import Pricing from "../components/Home/sections/pricing/default";
import Stats from "../components/Home/sections/stats/default";
import ThreeDMarqueeDemo from '@/components/Home/sections/socialProof/default'
import { BentoSection } from "@/components/Home/sections/bentoGrid/default";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <Logos />
      <Items />
      <ThreeDMarqueeDemo />
      <BentoSection />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
