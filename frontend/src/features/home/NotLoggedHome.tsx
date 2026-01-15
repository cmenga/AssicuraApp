import { HomeFooter } from "../footer/HomeFooter";
import { MainNavigation } from "../navigation/MainNavigation";
import { Benefits } from "./components/not-logged/Benefits";
import { CoveragePlans } from "./components/not-logged/CoveragePlans";
import { CTAButtons } from "./components/not-logged/CTAButtons";
import { HeroSectionWithQuoteForm } from "./components/not-logged/HeroSectionWithQuoteForm";
import { Reviews } from "./components/not-logged/Reviews";
import { StatsSection } from "./components/not-logged/StatsSection";


export function NotLoggedHome() {
    return (
        <>
            <MainNavigation />
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