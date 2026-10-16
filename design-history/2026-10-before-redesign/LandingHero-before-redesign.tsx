import { Link } from "@tanstack/react-router";
import { OBLIGATION_COUNT } from "@/lib/compliance-check";

export function LandingHero() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-[1080px] px-6 pt-20 pb-16">
        <div className="max-w-[860px]">
          {/* Prime prospect named, rather than listing everyone who might
              be interested. Tenants and advisers still use this and are
              welcome; the copy is written for the landlord who pays. */}
          <p className="text-xs uppercase tracking-[0.14em] text-brand">
            For landlords in England who manage their own property
          </p>

          <h1 className="mt-4 text-2xl sm:text-3xl leading-tight text-navy">
            Doing it right is not the same as being able to prove it.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            Keeping up with changing rules is easier when your property records, documents and next
            actions are in one place.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            realgood helps you work through {OBLIGATION_COUNT} compliance checks, identify possible
            gaps from your answers, and organise the records you need to follow up. Your obligations
            depend on your property, tenancy and location.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <Link
              to="/compliance-check"
              className="inline-flex items-center justify-center rounded-[6px] bg-navy px-6 py-3 text-base text-navy-foreground hover:opacity-90 transition-opacity"
            >
              Check your compliance free
            </Link>
            <Link
              to="/what-changed"
              className="inline-flex items-center justify-center rounded-[6px] border border-border bg-card px-6 py-3 text-base text-navy hover:bg-accent transition-colors"
            >
              What changed in the law
            </Link>
            <Link
              to="/book-demo"
              className="self-center text-base text-brand underline underline-offset-4"
            >
              Request a demo
            </Link>
          </div>

          <p className="mt-4 text-sm text-text-tertiary">
            Explore the platform and register your interest. Customer access is opening soon.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Explore realgood for your property or agency. Send your enquiry, then choose an
            available time. Please do not include tenant details.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-[8px] overflow-hidden">
          {[
            {
              h: "Records in one place",
              p: "Keep property documents and dated reports together. A saved record does not establish that a legal notice was served.",
            },
            {
              h: `${OBLIGATION_COUNT} guided checks`,
              p: "Start in plain English without an account. The check highlights possible gaps; it is not an exhaustive legal assessment.",
            },
            {
              h: "Escalate when needed",
              p: "When you need legal advice, contact an independent regulated solicitor.",
            },
          ].map((c) => (
            <div key={c.h} className="bg-card p-6">
              <p className="text-base text-navy">{c.h}</p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{c.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
