export const OVERVIEW_KEY = "realgood.prototype.portfolioOverview.v1";
export const ADMIN_KEY = "realgood.prototype.admin.v1";
export interface Session {
  id: string;
  at: string;
  view: "overview" | "admin";
  action: string;
}
export interface OverviewState {
  views: number;
  sessions: Session[];
}
const seed = (): OverviewState => ({ views: 0, sessions: [] });
function read<T>(store: Storage, key: string, fallback: T): T {
  try {
    const value = JSON.parse(store.getItem(key) ?? "null");
    return value && typeof value === "object" ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}
export function loadOverview(store: Storage): OverviewState {
  const value = read(store, OVERVIEW_KEY, seed());
  return {
    views: Number.isFinite(value.views) ? value.views : 0,
    sessions: Array.isArray(value.sessions)
      ? value.sessions.filter((s) => s && typeof s.id === "string" && typeof s.at === "string")
      : [],
  };
}
export function record(store: Storage, action: string, view: Session["view"]): OverviewState {
  const current = loadOverview(store);
  const next = {
    views: current.views + (view === "overview" ? 1 : 0),
    sessions: [
      { id: `demo-${Date.now()}`, at: new Date().toISOString(), view, action },
      ...current.sessions,
    ].slice(0, 20),
  };
  store.setItem(OVERVIEW_KEY, JSON.stringify(next));
  return next;
}
export function resetPrototype(store: Storage): void {
  store.removeItem(OVERVIEW_KEY);
  store.removeItem(ADMIN_KEY);
}

