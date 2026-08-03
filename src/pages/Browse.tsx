import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CATEGORIES, categoryBySlug } from "../lib/categories";
import { CONDITIONS } from "../lib/types";
import type { Listing } from "../lib/types";
import { fetchListings } from "../lib/api";
import { LOCATIONS } from "../lib/locations";
import { discountPct } from "../lib/format";
import ProductCard from "../components/ProductCard";

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const catSlug = params.get("cat") || "";
  const subId = params.get("sub") ? Number(params.get("sub")) : undefined;
  const condition = params.get("estado") || "";
  const location = params.get("local") || "";
  const pmin = params.get("pmin") || "";
  const pmax = params.get("pmax") || "";
  const ord = params.get("ord") || "recentes";
  const q = params.get("q") || "";

  const category = useMemo(() => categoryBySlug(catSlug), [catSlug]);

  useEffect(() => {
    setLoading(true);
    fetchListings({
      categoryId: category?.id,
      subcategoryId: subId,
      condition: condition || undefined,
      location: location || undefined,
      priceMin: pmin ? Number(pmin) : undefined,
      priceMax: pmax ? Number(pmax) : undefined,
      q: q || undefined,
    })
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [category?.id, subId, condition, location, pmin, pmax, q]);

  const sorted = useMemo(() => {
    const arr = [...listings];
    if (ord === "preco-asc") arr.sort((a, b) => a.price - b.price);
    else if (ord === "preco-desc") arr.sort((a, b) => b.price - a.price);
    else if (ord === "desconto")
      arr.sort(
        (a, b) =>
          (discountPct(b.price, b.original_price) || 0) -
          (discountPct(a.price, a.original_price) || 0)
      );
    return arr;
  }, [listings, ord]);

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

      {/* distrito / preço / ordenar */}
      <div className="filters">
        <div className="fl">
          <label>Distrito</label>
          <select value={location} onChange={(e) => update("local", e.target.value)}>
            <option value="">Todos</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="fl">
          <label>Preço mín. (€)</label>
          <input inputMode="numeric" value={pmin} onChange={(e) => update("pmin", e.target.value.replace(/[^\d]/g, ""))} placeholder="0" />
        </div>
        <div className="fl">
          <label>Preço máx. (€)</label>
          <input inputMode="numeric" value={pmax} onChange={(e) => update("pmax", e.target.value.replace(/[^\d]/g, ""))} placeholder="—" />
        </div>
        <div className="fl">
          <label>Ordenar</label>
          <select value={ord} onChange={(e) => update("ord", e.target.value === "recentes" ? "" : e.target.value)}>
            <option value="recentes">Mais recentes</option>
            <option value="preco-asc">Preço: mais baixo</option>
            <option value="preco-desc">Preço: mais alto</option>
            <option value="desconto">Maior desconto</option>
          </select>
        </div>
        {(location || pmin || pmax || ord !== "recentes" || condition || subId) && (
          <button className="btn btn-ghost fl-clear" onClick={() => setParams(catSlug ? new URLSearchParams({ cat: catSlug }) : new URLSearchParams())}>
            Limpar filtros
          </button>
        )}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : sorted.length ? (
        <div className="grid">
          {sorted.map((l) => (
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
