import { useState, type FormEvent } from "react";
import {
  categories,
  newReport,
  relationship,
  seedState,
  statuses,
  updateWorkflow,
  type DemoState,
  type Report,
  type Workflow,
} from "./model";
import { loadState, resetState, saveState } from "./storage";

const button =
  "min-h-11 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-navy-foreground disabled:opacity-50";
const field =
  "mt-2 block w-full rounded-md border border-border bg-background p-3 text-base text-foreground";
const stamp = (value: string) =>
  new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function WorkflowEditor({ report, onSave }: { report: Report; onSave: (value: Report) => void }) {
  const [draft, setDraft] = useState<Workflow>({
    nextAction: report.nextAction,
    targetDate: report.targetDate,
    status: report.status,
    note: report.note,
  });
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    try {
      onSave(updateWorkflow(report, draft));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please check the workflow.");
    }
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-5 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">Landlord next action</h3>
        <p className="text-sm text-text-secondary">
          Owner: <strong>{report.owner}</strong>
        </p>
      </div>
      {report.status === "Awaiting landlord action" && (
        <button
          type="button"
          className={button}
          onClick={() => {
            onSave(
              updateWorkflow(report, {
                nextAction: report.nextAction,
                targetDate: report.targetDate,
                note: report.note,
                status: "Acknowledged",
              }),
            );
          }}
        >
          Acknowledge report
        </button>
      )}
      <label className="block text-sm font-semibold">
        Next action
        <textarea
          className={field}
          rows={2}
          maxLength={1000}
          value={draft.nextAction}
          onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })}
          placeholder="For example: arrange a visit to review the bedroom"
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block min-w-0 text-sm font-semibold">
          Target date
          <input
            type="date"
            className={field}
            value={draft.targetDate}
            onChange={(e) => setDraft({ ...draft, targetDate: e.target.value })}
            onInput={(e) => setDraft({ ...draft, targetDate: e.currentTarget.value })}
          />
        </label>
        <label className="block text-sm font-semibold">
          Status
          <select
            className={field}
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as Report["status"] })}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Resolution or escalation note
        <textarea
          className={field}
          rows={2}
          maxLength={1000}
          value={draft.note}
          onChange={(e) => setDraft({ ...draft, note: e.target.value })}
          placeholder="Record what happened or why further review is needed"
        />
      </label>
      <p className="text-sm text-text-secondary">
        Resolved and escalated statuses require a note. These are demo workflow records, not legal
        or safety conclusions.
      </p>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <button className={button}>Save workflow</button>
    </form>
  );
}

export function TenantIssueDemo() {
  const [initial] = useState(() => {
    try {
      return { state: loadState(window.localStorage), warning: "" };
    } catch {
      return {
        state: seedState(),
        warning: "Browser storage is unavailable. Changes will last only while this page is open.",
      };
    }
  });
  const [state, setState] = useState<DemoState>(initial.state);
  const [warning, setWarning] = useState(initial.warning);
  const [view, setView] = useState<"landlord" | "tenant">("landlord");
  const [selected, setSelected] = useState(state.reports[0].id);
  const [category, setCategory] = useState<Report["category"]>(categories[0]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const reports = state.reports.filter(
    (r) =>
      r.propertyId === relationship.propertyId &&
      (view === "landlord" || r.tenantId === relationship.tenantId),
  );
  const report = reports.find((r) => r.id === selected) ?? reports[0];
  function persist(next: DemoState) {
    setState(next);
    try {
      saveState(window.localStorage, next);
      setWarning("");
    } catch {
      setWarning("Could not save in this browser. Changes will be lost after refresh.");
    }
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const r = newReport(category, description);
      persist({ ...state, reports: [...state.reports, r] });
      setSelected(r.id);
      setDescription("");
      setError("");
      setMessage("Report submitted to the fictional landlord view.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please check your report.");
    }
  }
  function reset() {
    try {
      const next = resetState(window.localStorage);
      setState(next);
      setSelected(next.reports[0].id);
      setDescription("");
      setCategory(categories[0]);
      setWarning("");
      setError("");
      setMessage("Demo reset. The fictional starting report is ready.");
      setConfirmReset(false);
    } catch {
      setWarning(
        "Could not remove the saved demo data. Allow browser storage and try reset again.",
      );
    }
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-bold tracking-tight text-navy">realgood</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">
              Tenant issue prototype
            </span>
          </div>
          <button
            type="button"
            className="min-h-11 text-sm font-semibold underline underline-offset-4"
            onClick={() => setConfirmReset(true)}
          >
            Reset demo data
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10">
        <div className="border-l-2 border-brand bg-muted p-4 text-sm font-semibold">
          Prototype demo. Fictional data only. Not a live tenancy service.
        </div>
        {confirmReset && (
          <section
            aria-label="Reset confirmation"
            className="mt-4 rounded-md border border-border p-5"
          >
            <p>Reset all prototype reports and activity in this browser?</p>
            <div className="mt-4 flex gap-4">
              <button className={button} onClick={reset}>
                Confirm reset
              </button>
              <button className="min-h-11 px-3 underline" onClick={() => setConfirmReset(false)}>
                Keep demo data
              </button>
            </div>
          </section>
        )}
        {warning && (
          <p role="alert" className="mt-4 border border-border p-3 text-sm">
            {warning}
          </p>
        )}
        <p className="mt-7 text-sm leading-relaxed text-text-secondary">
          Demo Landlord → 14 Example Street → Demo Tenant → Tenant issue
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-brand">
              {view === "landlord"
                ? "Accountable action, visible progress"
                : "Your home, your report"}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {view === "landlord"
                ? "From report to next action."
                : "Tell your landlord what needs attention."}
            </h1>
            <p className="mt-3 max-w-xl text-base text-text-secondary">
              {view === "landlord"
                ? "Record the next step and keep a factual history of what happened."
                : "Use fictional details to try the reporting journey for 14 Example Street."}
            </p>
          </div>
          <div
            role="group"
            aria-label="Demo view"
            className="flex rounded-md border border-border p-1"
          >
            {(["landlord", "tenant"] as const).map((v) => (
              <button
                key={v}
                aria-pressed={view === v}
                className={
                  view === v ? button : "min-h-11 rounded-md px-4 py-3 text-sm font-semibold"
                }
                onClick={() => {
                  setView(v);
                  setMessage("");
                }}
              >
                {v === "landlord" ? "Landlord View" : "Tenant View"}
              </button>
            ))}
          </div>
        </div>
        <p role="status" className="mt-4 min-h-6 text-sm text-text-secondary">
          {message}
        </p>
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-3">
          <aside className="space-y-6">
            <section className="border-t border-border pt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Fictional property
              </p>
              <h2 className="mt-2 text-xl font-semibold">14 Example Street</h2>
              <p className="mt-2 text-sm text-text-secondary">Demo Tenant · Owner: Demo Landlord</p>
            </section>
            {view === "tenant" && (
              <form
                onSubmit={submit}
                className="space-y-4 rounded-md border border-border bg-card p-5"
              >
                <h2 className="text-xl font-semibold">Submit a report</h2>
                <label className="block text-sm font-semibold">
                  Category
                  <select
                    className={field}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Report["category"])}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-semibold">
                  Description
                  <textarea
                    required
                    maxLength={2000}
                    rows={5}
                    className={field}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe a fictional issue in your home"
                  />
                </label>
                <p className="text-xs text-text-secondary">
                  Text only. The report time is recorded when you submit.
                </p>
                {error && (
                  <p role="alert" className="text-sm text-error">
                    {error}
                  </p>
                )}
                <button className={button}>Submit report</button>
              </form>
            )}
            <section>
              <h2 className="text-sm font-semibold">
                {view === "tenant" ? "Your reports" : "Property reports"}{" "}
                <span className="text-text-secondary">({reports.length})</span>
              </h2>
              <div className="mt-3 space-y-3">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    aria-pressed={report.id === r.id}
                    onClick={() => setSelected(r.id)}
                    className={`w-full rounded-md border p-4 text-left ${report.id === r.id ? "border-navy bg-muted" : "border-border bg-card"}`}
                  >
                    <span className="block text-xs font-semibold text-brand">{r.category}</span>
                    <span className="mt-2 block break-words text-base font-semibold">
                      {r.description.length > 85 ? `${r.description.slice(0, 85)}…` : r.description}
                    </span>
                    <span className="mt-3 block text-xs text-text-secondary">{r.status}</span>
                  </button>
                ))}
              </div>
            </section>
          </aside>
          <section
            className="min-w-0 rounded-md border border-border bg-card p-5 sm:p-7 lg:col-span-2"
            aria-label="Selected report"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                Tenant issue · {report.category}
              </p>
              <span className="rounded-md bg-muted px-3 py-2 text-xs font-semibold">
                {report.status}
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold">
              {report.category === "Damp and mould"
                ? "Bedroom damp and mould"
                : `${report.category} report`}
            </h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-base leading-relaxed">
              {report.description}
            </p>
            <p className="mt-4 text-xs text-text-secondary">
              Reported by Demo Tenant · {stamp(report.events[0].at)}
            </p>
            <dl className="mt-6 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-text-secondary">Owner</dt>
                <dd className="mt-1 text-sm font-semibold">{report.owner}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary">Target date</dt>
                <dd className="mt-1 text-sm font-semibold">{report.targetDate || "Not set"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-text-secondary">Next action</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-sm">
                  {report.nextAction || "Awaiting a next action from Demo Landlord"}
                </dd>
              </div>
            </dl>
            {view === "landlord" && (
              <>
                <WorkflowEditor
                  key={`${report.id}-${report.events.length}`}
                  report={report}
                  onSave={(r) => {
                    persist({
                      ...state,
                      reports: state.reports.map((x) => (x.id === r.id ? r : x)),
                    });
                    setMessage("Landlord workflow saved. Evidence timeline updated.");
                  }}
                />
                <section className="mt-8 border-t border-border pt-6">
                  <h3 className="text-xl font-semibold">Evidence timeline</h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    A factual demo history, earliest first. Times come from this browser.
                  </p>
                  <ol className="mt-6 space-y-5">
                    {[...report.events]
                      .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
                      .map((e) => (
                        <li key={e.id} className="border-l-2 border-border pl-4">
                          <p className="whitespace-pre-wrap break-words text-sm font-semibold">
                            {e.text}
                          </p>
                          <p className="mt-1 text-xs text-text-secondary">
                            {e.actor} · <time dateTime={e.at}>{stamp(e.at)}</time>
                          </p>
                        </li>
                      ))}
                  </ol>
                </section>
              </>
            )}
          </section>
        </div>
        <footer className="mt-10 border-t border-border pt-5 text-xs text-text-secondary">
          Fictional reports stay in this browser. View switching is for demonstration; it is not
          account access.
        </footer>
      </main>
    </div>
  );
}

