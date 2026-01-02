import { Benefits } from '@/features/home/Benefits';
import { HeroSectionWithQuoteForm } from '@/features/home/HeroSectionWithQuoteForm';
import { StatsSection } from '@/features/home/StatsSection';
import { MainNavigation } from '@/features/main-navigation/MainNavigation';
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
  </div>
}
