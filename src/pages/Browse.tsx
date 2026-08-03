import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CATEGORIES, categoryBySlug } from "../lib/categories";
import { CONDITIONS } from "../lib/types";
import type { Listing } from "../lib/types";
import { fetchListings } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const catSlug = params.get("cat") || "";
  const subId = params.get("sub") ? Number(params.get("sub")) : undefined;
  const condition = params.get("estado") || "";
  const q = params.get("q") || "";

  const category = useMemo(() => categoryBySlug(catSlug), [catSlug]);

  useEffect(() => {
    setLoading(true);
    fetchListings({
      categoryId: category?.id,
      subcategoryId: subId,
      condition: condition || undefined,
      q: q || undefined,
    })
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [category?.id, subId, condition, q]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "cat") next.delete("sub");
    setParams(next);
  }

  return (
    <div className="wrap" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div className="breadcrumb">
        <Link to="/">Início</Link> / <Link to="/produtos">Produtos</Link>
        {category && <> / {category.name}</>}
      </div>

      <div className="sec-head">
        <div>
          <h2>{category ? category.name : q ? `Resultados para “${q}”` : "Todos os produtos"}</h2>
          <p>{loading ? "A carregar…" : `${listings.length} anúncio(s)`}</p>
        </div>
      </div>

      {/* category filter */}
      <div className="toolbar">
        <span
          className={`chip ${!catSlug ? "on" : ""}`}
          onClick={() => update("cat", "")}
        >
          Todas
        </span>
        {CATEGORIES.map((c) => (
          <span
            key={c.id}
            className={`chip ${catSlug === c.slug ? "on" : ""}`}
            onClick={() => update("cat", c.slug)}
          >
            {c.name}
          </span>
        ))}
      </div>

      {/* subcategory filter */}
      {category && (
        <div className="toolbar">
          <span className={`chip ${!subId ? "on" : ""}`} onClick={() => update("sub", "")}>
            Todas as subcategorias
          </span>
          {category.subs.map((s) => (
            <span
              key={s.id}
              className={`chip ${subId === s.id ? "on" : ""}`}
              onClick={() => update("sub", String(s.id))}
            >
              {s.name}
            </span>
          ))}
        </div>
      )}

      {/* condition filter */}
      <div className="toolbar">
        <span className={`chip ${!condition ? "on" : ""}`} onClick={() => update("estado", "")}>
          Qualquer estado
        </span>
        {CONDITIONS.map((c) => (
          <span
            key={c}
            className={`chip ${condition === c ? "on" : ""}`}
            onClick={() => update("estado", c)}
          >
            {c}
          </span>
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
          <div className="ico">🔍</div>
          <p>Sem resultados para esta pesquisa.</p>
        </div>
      )}
    </div>
  );
}
