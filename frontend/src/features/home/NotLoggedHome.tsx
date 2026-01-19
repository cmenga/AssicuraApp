import Benefits from "./components/not-logged/Benefits";
import CoveragePlans from "./components/not-logged/CoveragePlans";
import CTAButtons from "./components/not-logged/CTAButtons";
import HeroSectionWithQuoteForm from "./components/not-logged/HeroSectionWithQuoteForm";
import Reviews from "./components/not-logged/Reviews";
import StatsSection from "./components/not-logged/StatsSection";
import HomeNavigation from "./components/not-logged/navigation/HomeNavigation";
import HomeFooter from "./components/not-logged/footer/HomeFooter";

export default function NotLoggedHome() {
  return (
    <>
      <HomeNavigation />
      <HeroSectionWithQuoteForm />
      <StatsSection />
      <Benefits />
      <CoveragePlans />
      <Reviews />
      <CTAButtons />
      <HomeFooter />
    </>
  );
}
