import { useEffect, useState } from "react";
import { loadOverview, record, resetPrototype, type OverviewState } from "./storage";

const action = "min-h-11 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-navy-foreground";
const notice = "Prototype demo. Fictional data only. Not a live tenancy service.";
function AdminView({ state, onReset }: { state: OverviewState; onReset: () => void }) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand">
        Prototype admin/dev view
      </p>
      <h1 className="mt-3 text-3xl font-semibold">Overview of this browser demo</h1>
      <p className="mt-3 max-w-2xl text-text-secondary">
        Admin access is simulated for soo24@cornell.edu only. This page reads fictional local demo
        counters and is not a production dashboard.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          ["Overview views", state.views],
          ["Demo landlords", 1],
          ["Properties", 1],
          ["Open issues", 1],
        ].map(([label, value]) => (
          <div className="rounded-md border border-border bg-card p-5" key={label as string}>
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-8 rounded-md border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">Recent demo sessions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="py-3 pr-4">Timestamp</th>
                <th className="py-3 pr-4">View</th>
                <th className="py-3">Interaction</th>
              </tr>
            </thead>
            <tbody>
              {state.sessions.length ? (
                state.sessions.map((s) => (
                  <tr className="border-b border-border" key={s.id}>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {new Date(s.at).toLocaleString("en-GB")}
                    </td>
                    <td className="py-3 pr-4">{s.view}</td>
                    <td className="py-3">{s.action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-5 text-text-secondary">
                    No sessions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <div className="mt-8 flex flex-wrap gap-4">
        <a className={action} href="/">
          Back to portfolio overview
        </a>
        <button
          className="min-h-11 rounded-md border border-border px-5 py-3 text-sm font-semibold"
          onClick={onReset}
        >
          Reset prototype counters
        </button>
      </div>
    </main>
  );
}
export function PlatformPreview() {
  const [admin, setAdmin] = useState(location.pathname.endsWith("/admin"));
  const [state, setState] = useState<OverviewState>(() => loadOverview(localStorage));
  useEffect(() => {
    if (!admin) setState(record(localStorage, "Opened portfolio overview", "overview"));
  }, [admin]);
  const openWorkflow = () => {
    record(localStorage, "Opened tenant issue workflow", "overview");
    location.href = "/tenant-issue-demo/";
  };
  const openAdmin = () => {
    setState(record(localStorage, "Opened prototype admin view", "admin"));
    setAdmin(true);
    history.pushState({}, "", "/admin");
  };
  const reset = () => {
    resetPrototype(localStorage);
    setState(loadOverview(localStorage));
    setAdmin(false);
    history.pushState({}, "", "/");
  };
  if (admin) return <AdminView state={state} onReset={reset} />;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <span className="text-2xl font-bold tracking-tight text-navy">realgood</span>
          <button
            className="text-sm font-semibold underline underline-offset-4"
            onClick={openAdmin}
          >
            Prototype admin/dev view
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="border-l-2 border-brand bg-muted p-4 text-sm font-semibold">{notice}</div>
        <p className="mt-8 text-sm text-text-secondary">
          Demo Landlord → 14 Example Street → Demo Tenant → Tenant issue
        </p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <section>
            <p className="text-sm font-semibold text-brand">Portfolio overview</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              One property. One next action.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
              A concise starting point for the fictional tenant-issue workflow.
            </p>
            <button className={`${action} mt-8`} onClick={openWorkflow}>
              Open tenant issue workflow
            </button>
          </section>
          <section className="rounded-md border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Fictional property
            </p>
            <h2 className="mt-3 text-2xl font-semibold">14 Example Street</h2>
            <p className="mt-2 text-sm text-text-secondary">Demo Landlord · Demo Tenant</p>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs text-text-secondary">Open tenant issue</p>
              <p className="mt-2 text-lg font-semibold">Damp and mould reported in the bedroom</p>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-text-secondary">Workflow health</dt>
                  <dd className="font-semibold">Requires attention</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-secondary">Next action</dt>
                  <dd className="text-right font-semibold">Arrange a review visit</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-secondary">Target date</dt>
                  <dd className="font-semibold">15 September 2026</dd>
                </div>
              </dl>
              <p className="mt-6 border-t border-border pt-4 text-sm text-text-secondary">
                Evidence timeline available · 1 recorded event
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

