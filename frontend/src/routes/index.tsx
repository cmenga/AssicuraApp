import { createFileRoute, redirect } from "@tanstack/react-router";
import { authApi } from "@/shared/api/http";
import HomeNavigation from "@/features/navigation/HomeNavigation";
import HeroSection from "@/features/home/components/not-logged/HeroSection";
import Benefits from "@/features/home/components/not-logged/Benefits";
import Reviews from "@/features/home/components/not-logged/Reviews";
import CTAButtons from "@/features/home/components/not-logged/CTAButtons";
import HomeFooter from "@/features/home/components/not-logged/footer/HomeFooter";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    try {
      const response = await authApi.post("/protected")
      if (response.status !== 401) throw redirect({to: "/home"})  
    } catch{}
  }
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


