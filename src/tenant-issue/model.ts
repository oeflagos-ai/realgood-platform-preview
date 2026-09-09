export const categories = ["Damp and mould", "Repair", "Hazard", "Other"] as const;
export const statuses = [
  "Awaiting landlord action",
  "Acknowledged",
  "Action scheduled",
  "Resolved",
  "Escalated",
] as const;
export type Status = (typeof statuses)[number];
export const relationship = {
  landlord: "Demo Landlord",
  property: "14 Example Street",
  tenant: "Demo Tenant",
  propertyId: "demo-property",
  tenantId: "demo-tenant",
} as const;
export interface TimelineEvent {
  id: string;
  at: string;
  actor: string;
  text: string;
}
export interface Report {
  id: string;
  propertyId: typeof relationship.propertyId;
  tenantId: typeof relationship.tenantId;
  category: (typeof categories)[number];
  description: string;
  status: Status;
  owner: typeof relationship.landlord;
  nextAction: string;
  targetDate: string;
  note: string;
  events: TimelineEvent[];
}
export interface DemoState {
  version: 1;
  reports: Report[];
}
export interface Workflow {
  nextAction: string;
  targetDate: string;
  status: Status;
  note: string;
}
const event = (text: string, actor: string, at: string): TimelineEvent => ({
  id: crypto.randomUUID(),
  text,
  actor,
  at,
});
export function newReport(
  category: Report["category"],
  description: string,
  at = new Date().toISOString(),
): Report {
  if (!categories.includes(category) || !description.trim() || description.trim().length > 2000)
    throw new Error("Add a description of up to 2,000 characters.");
  return {
    id: crypto.randomUUID(),
    propertyId: relationship.propertyId,
    tenantId: relationship.tenantId,
    category,
    description: description.trim(),
    status: statuses[0],
    owner: relationship.landlord,
    nextAction: "",
    targetDate: "",
    note: "",
    events: [event("Report submitted", relationship.tenant, at)],
  };
}
export function seedState(): DemoState {
  return {
    version: 1,
    reports: [newReport("Damp and mould", "Damp and mould reported in the bedroom")],
  };
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function updateWorkflow(
  report: Report,
  input: Workflow,
  at = new Date().toISOString(),
): Report {
  const nextAction = input.nextAction.trim(),
    note = input.note.trim();
  if (!statuses.includes(input.status)) throw new Error("Choose a demo status.");
  if (nextAction.length > 1000 || note.length > 1000)
    throw new Error("Keep actions and notes within 1,000 characters.");
  if (input.targetDate && !validDate(input.targetDate))
    throw new Error("Choose a valid target date.");
  if (input.status === "Action scheduled" && (!nextAction || !input.targetDate))
    throw new Error("Add a next action and target date before scheduling.");
  if (["Resolved", "Escalated"].includes(input.status) && !note)
    throw new Error("Add a short resolution or escalation note.");
  const events = [...report.events];
  const add = (text: string) => events.push(event(text, relationship.landlord, at));
  if (nextAction !== report.nextAction)
    add(`Next action ${report.nextAction ? "changed" : "added"}: ${nextAction || "Removed"}`);
  if (input.targetDate !== report.targetDate)
    add(`Target date ${report.targetDate ? "changed" : "added"}: ${input.targetDate || "Removed"}`);
  if (input.status !== report.status) {
    if (input.status === "Acknowledged") add("Landlord acknowledged the report");
    add(`Status changed: ${report.status} → ${input.status}`);
  }
  if (
    note !== report.note ||
    (input.status !== report.status && ["Resolved", "Escalated"].includes(input.status))
  ) {
    add(
      `${input.status === "Resolved" ? "Resolution recorded" : input.status === "Escalated" ? "Escalation recorded" : "Workflow note changed"}: ${note || "Removed"}`,
    );
  }
  return {
    ...report,
    nextAction,
    note,
    targetDate: input.targetDate,
    status: input.status,
    events,
  };
}

