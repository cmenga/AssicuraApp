import { createFileRoute, redirect } from "@tanstack/react-router";
import HomeNavigation from "@/features/navigation/components/HomeNavigation";
import HeroSection from "@/features/index/components/HeroSection";
import Benefits from "@/features/index/components/Benefits";
import Reviews from "@/features/index/components/Reviews";
import CTAButtons from "@/features/index/components/CTAButtons";
import HomeFooter from "@/features/index/components/footer/HomeFooter";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.auth.isAuthenticated) throw redirect({ to: "/home" })
  },
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavigation />
      <HeroSection />
      <Benefits />
      <Reviews />
      <CTAButtons />
      <HomeFooter />
    </div>
  );
}
