import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../lib/categories";
import CategoryIcon from "../components/CategoryIcon";
import { CONDITIONS } from "../lib/types";
import type { Listing } from "../lib/types";
import { fetchListings } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings({ limit: 8 })
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("cat", cat);
    navigate(`/produtos?${params.toString()}`);
  }

  return (
    <>
      <div className="hero">
        <div className="wrap">
          <span className="pill">♻ Menos desperdício · Mais poupança</span>
          <h1>
            Stock a mais de umas, <span>poupança</span> a mais de outras.
          </h1>
          <p>
            A NexStock liga empresas com excedente de stock, fim de estação e saldos
            a compradores que procuram os melhores preços. Sem intermediários
            complicados.
          </p>

          <form className="searchbar" onSubmit={search}>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="O que procura? Ex: ténis, eletrodomésticos, azeite…"
            />
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">Todas as categorias</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" type="submit">
              Procurar
            </button>
          </form>

          <div className="stats">
            <div><b>10</b><span>categorias de negócio</span></div>
            <div><b>3</b><span>anúncios grátis / semana</span></div>
            <div><b>0€</b><span>custo para começar</span></div>
          </div>
        </div>
      </div>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>Explorar por categoria</h2>
              <p>Encontre oportunidades em todos os setores.</p>
            </div>
            <Link className="btn btn-outline" to="/categorias">Ver todas</Link>
          </div>
          <div className="cats">
            {CATEGORIES.map((c) => (
              <Link className="cat" to={`/produtos?cat=${c.slug}`} key={c.id}>
                <div className="ico"><CategoryIcon slug={c.slug} size={26} /></div>
                <b>{c.name}</b>
                <span>{c.subs.length} subcategorias</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>Oportunidades recentes</h2>
              <p>Stock real de empresas a precisar de escoar.</p>
            </div>
            <Link className="btn btn-outline" to="/produtos">Ver tudo</Link>
          </div>
          <div className="toolbar">
            {CONDITIONS.map((c) => (
              <Link className="chip" to={`/produtos?estado=${encodeURIComponent(c)}`} key={c}>
                {c}
              </Link>
            ))}
          </div>
          {loading ? (
            <div className="spinner" />
          ) : listings.length ? (
            <div className="grid">
              {listings.map((l) => (
                <ProductCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <div className="ico">📭</div>
              <p>Ainda não há anúncios. Seja a primeira empresa a publicar!</p>
              <Link className="btn btn-primary" to="/registar" style={{ marginTop: 14 }}>
                Criar conta de empresa
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div
            className="panel"
            style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}
          >
            <div>
              <h2 style={{ fontSize: "1.5rem", letterSpacing: "-.5px" }}>
                Tem stock parado no armazém?
              </h2>
              <p style={{ color: "var(--muted)", marginTop: 8, maxWidth: "46ch" }}>
                Transforme excedente e devoluções em receita. Criar conta de
                empresa é gratuito e leva 2 minutos — 3 anúncios grátis por semana.
              </p>
            </div>
            <Link className="btn btn-primary btn-lg" to="/registar">
              Criar conta de empresa →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
