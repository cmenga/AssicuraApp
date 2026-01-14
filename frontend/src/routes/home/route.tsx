import { HomeFooter } from '@/components/footer/HomeFooter';
import { Benefits } from '@/components/home/Benefits';
import { CoveragePlans } from '@/components/home/CoveragePlans';
import { CTAButtons } from '@/components/home/CTAButtons';
import { HeroSectionWithQuoteForm } from '@/components/home/HeroSectionWithQuoteForm';
import { Reviews } from '@/components/home/Reviews';
import { StatsSection } from '@/components/home/StatsSection';
import { MainNavigation } from '@/features/navigation/MainNavigation';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-h-screen bg-white">
    <MainNavigation />
    <HeroSectionWithQuoteForm />
    <StatsSection />
    <Benefits />
    <CoveragePlans />
    <Reviews />
    <CTAButtons />
    <HomeFooter />
  </div>
}
