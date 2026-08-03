export const euro = (v: number | null | undefined) =>
  v == null ? "" : new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(v);

export const discountPct = (price: number, original: number | null) =>
  original && original > price ? Math.round((1 - price / original) * 100) : null;

export const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `há ${d} dia${d > 1 ? "s" : ""}`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `há ${h} hora${h > 1 ? "s" : ""}`;
  const m = Math.floor(diff / 60000);
  if (m > 0) return `há ${m} min`;
  return "agora mesmo";
};

// A listing is live for 1 week (E1 lays the field; the 3-free/week limit
// and hard enforcement arrive in a later stage).
export const daysLeft = (expiresAt: string | null) => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / 86400000);
};
