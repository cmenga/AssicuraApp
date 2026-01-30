import Benefits from "./components/not-logged/Benefits";
import CTAButtons from "./components/not-logged/CTAButtons";
import HeroSection from "./components/not-logged/HeroSection"; "./components/not-logged/HeroSection";
import Reviews from "./components/not-logged/Reviews";
import HomeNavigation from "./components/not-logged/navigation/HomeNavigation";
import HomeFooter from "./components/not-logged/footer/HomeFooter";

export default function NotLoggedHome() {
  return (
    <>
      <HomeNavigation />
      <HeroSection />
      <Benefits />
      <Reviews />
      <CTAButtons />
      <HomeFooter />
    </>
  );
}
