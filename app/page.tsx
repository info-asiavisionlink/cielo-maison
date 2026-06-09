import MarbleBackground from "@/components/MarbleBackground";
import NoiseOverlay from "@/components/NoiseOverlay";
import CursorAmbient from "@/components/CursorAmbient";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import MaisonStatement from "@/components/MaisonStatement";
import MaterialsSection from "@/components/MaterialsSection";
import CollectionSection from "@/components/CollectionSection";
import RegistrySection from "@/components/RegistrySection";
import MembershipSection from "@/components/MembershipSection";
import ConsultationSection from "@/components/ConsultationSection";
import WorldSection from "@/components/WorldSection";
import MaisonStructureSection from "@/components/MaisonStructureSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Atmosphere layers — fixed, behind everything */}
      <MarbleBackground />
      <NoiseOverlay />
      <CursorAmbient />

      <Header />

      <main>
        <HeroSlider />
        <MaisonStatement />
        <MaterialsSection />
        <CollectionSection />
        <RegistrySection />
        <MembershipSection />
        <ConsultationSection />
        <WorldSection />
        <MaisonStructureSection />
      </main>

      <Footer />
    </>
  );
}
