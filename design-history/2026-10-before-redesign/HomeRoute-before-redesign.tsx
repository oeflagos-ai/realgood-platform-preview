import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LandingHero } from "@/components/landing/LandingHero";
import { UrgencyBar } from "@/components/landing/UrgencyBar";
import { ServiceCards } from "@/components/landing/ServiceCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { TrustAndSecurity } from "@/components/landing/TrustAndSecurity";
import { CallToAction } from "@/components/layout/CallToAction";
import { OBLIGATION_COUNT } from "@/lib/compliance-check";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "realgood — find out where a tenancy really stands" },
      {
        name: "description",
        content: `Explore realgood’s ${OBLIGATION_COUNT} landlord compliance checks, property records and next actions. Join early access.`,
      },
      {
        property: "og:title",
        content: "realgood — find out where a tenancy really stands",
      },
      {
        property: "og:description",
        content: `Explore realgood’s ${OBLIGATION_COUNT} landlord compliance checks and property workspace.`,
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 rg-page">
        <LandingHero />
        <UrgencyBar />
        <ServiceCards />
        <HowItWorks />
        <TrustAndSecurity />
        <LandingFAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
