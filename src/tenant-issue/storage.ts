import { categories, relationship, seedState, statuses, validDate, type DemoState } from "./model";

export const STORAGE_KEY = "realgood.prototype.tenantIssue.v1";
type LocalStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const text = (value: unknown, max: number): value is string =>
  typeof value === "string" && value.length <= max;
export function parseState(raw: string | null): DemoState {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (
      !record(value) ||
      value.version !== 1 ||
      !Array.isArray(value.reports) ||
      !value.reports.length
    )
      throw new Error();
    const ids = new Set<string>();
    for (const r of value.reports) {
      if (
        !record(r) ||
        !text(r.id, 100) ||
        !r.id ||
        ids.has(r.id) ||
        r.propertyId !== relationship.propertyId ||
        r.tenantId !== relationship.tenantId ||
        r.owner !== relationship.landlord ||
        !categories.includes(r.category as never) ||
        !statuses.includes(r.status as never) ||
        !text(r.description, 2000) ||
        !r.description.trim() ||
        !text(r.nextAction, 1000) ||
        !text(r.note, 1000) ||
        !text(r.targetDate, 10) ||
        (r.targetDate !== "" && !validDate(r.targetDate)) ||
        !Array.isArray(r.events) ||
        !r.events.length
      )
        throw new Error();
      ids.add(r.id);
      for (const e of r.events) {
        if (
          !record(e) ||
          !text(e.id, 100) ||
          !text(e.text, 2200) ||
          !text(e.at, 40) ||
          !Number.isFinite(Date.parse(e.at)) ||
          ![relationship.landlord, relationship.tenant].includes(e.actor as never)
        )
          throw new Error();
      }
    }
    return value as unknown as DemoState;
  } catch {
    return seedState();
  }
}
export function loadState(store: LocalStore): DemoState {
  return parseState(store.getItem(STORAGE_KEY));
}
export function saveState(store: LocalStore, state: DemoState): void {
  store.setItem(STORAGE_KEY, JSON.stringify(state));
}
export function resetState(store: LocalStore): DemoState {
  store.removeItem(STORAGE_KEY);
  return seedState();
}

