import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Listing } from "../lib/types";
import { fetchMyListings, deleteListing } from "../lib/api";
import { categoryById } from "../lib/categories";
import { euro, daysLeft } from "../lib/format";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      setListings(await fetchMyListings(user.id));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que quer apagar este anúncio?")) return;
    await deleteListing(id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  const activeCount = listings.filter((l) => l.status === "active").length;
  const freeLeft = Math.max(0, 3 - activeCount);

  return (
    <div className="wrap" style={{ paddingTop: 26, paddingBottom: 40 }}>
      <div className="dash-head">
        <div>
          <h1>{profile?.company_name || "O meu painel"}</h1>
          <p style={{ color: "var(--muted)", fontSize: ".92rem" }}>
            {activeCount} anúncio(s) ativo(s) · {freeLeft} grátis disponível(is) esta semana
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-outline" to="/painel/perfil">Editar perfil</Link>
          <Link className="btn btn-primary" to="/painel/novo-anuncio">+ Novo anúncio</Link>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : listings.length ? (
        listings.map((l) => {
          const cat = categoryById(l.category_id);
          const cover = l.images && l.images.length ? l.images[0] : null;
          const left = daysLeft(l.expires_at);
          const expired = l.status !== "active" || left === 0;
          return (
            <div className="list-row" key={l.id}>
              <Link className="mini" to={`/anuncio/${l.id}`}>
                {cover ? <img src={cover} alt={l.title} /> : <span>{cat?.icon || "📦"}</span>}
              </Link>
              <div className="info">
                <h3>{l.title}</h3>
                <div className="meta">
                  {euro(l.price)} · {cat?.name}
                  {" · "}
                  <span className={`tag ${expired ? "exp" : ""}`}>
                    {expired ? "Expirado" : `Ativo · ${left}d restantes`}
                  </span>
                </div>
              </div>
              <div className="actions">
                <Link className="btn btn-outline" to={`/painel/editar/${l.id}`}>Editar</Link>
                <button className="btn btn-danger" onClick={() => handleDelete(l.id)}>Apagar</button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty">
          <div className="ico">📦</div>
          <p>Ainda não tem anúncios. Publique o seu primeiro!</p>
          <Link className="btn btn-primary" to="/painel/novo-anuncio" style={{ marginTop: 14 }}>
            + Criar anúncio
          </Link>
        </div>
      )}
    </div>
  );
}
