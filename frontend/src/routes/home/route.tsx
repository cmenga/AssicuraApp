import { HomeFooter } from "@/features/footer/HomeFooter";
import { Benefits } from "@/features/home/Benefits";
import { CoveragePlans } from "@/features/home/CoveragePlans";
import { CTAButtons } from "@/features/home/CTAButtons";
import { HeroSectionWithQuoteForm } from "@/features/home/HeroSectionWithQuoteForm";
import { Reviews } from "@/features/home/Reviews";
import { StatsSection } from "@/features/home/StatsSection";
import { MainNavigation } from "@/features/navigation/MainNavigation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <MainNavigation />
      <HeroSectionWithQuoteForm />
      <StatsSection />
      <Benefits />
      <CoveragePlans />
      <Reviews />
      <CTAButtons />
      <HomeFooter />
    </div>
  );
}
