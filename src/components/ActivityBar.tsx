import { useEffect, useState } from "react";
import { fetchStats, fetchListings, type PlatformStats } from "../lib/api";
import type { Listing } from "../lib/types";

// A slim, honest "live" bar: real platform numbers + a rotating ticker of the
// latest real listings. Gives the homepage energy without inventing anything.
export default function ActivityBar() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recent, setRecent] = useState<Listing[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
    fetchListings({ limit: 10 }).then(setRecent).catch(() => {});
  }, []);

  useEffect(() => {
    if (recent.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % recent.length), 3500);
    return () => clearInterval(t);
  }, [recent.length]);

  if (!stats) return null;
  const cur = recent.length ? recent[idx % recent.length] : null;

  return (
    <div className="activity">
      <div className="wrap activity-in">
        <span className="live"><i className="pulse" /> Ao vivo</span>
        <span className="ast"><b>{stats.activeListings}</b> anúncios ativos</span>
        <span className="ast"><b>{stats.businesses}</b> empresas</span>
        <span className="ast"><b>{stats.newThisWeek}</b> novos esta semana</span>
        {cur && (
          <span className="ticker" key={cur.id}>
            Agora mesmo: {cur.title}
            {cur.location ? ` · ${cur.location}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
