import { Link } from "react-router-dom";
import { CATEGORIES } from "../lib/categories";

export default function Categories() {
  return (
    <div className="wrap" style={{ paddingTop: 26, paddingBottom: 40 }}>
      <div className="sec-head">
        <div>
          <h2>Todas as categorias</h2>
          <p>Explore por setor e subcategoria.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
        {CATEGORIES.map((c) => (
          <div className="panel" key={c.id} style={{ padding: 20 }}>
            <Link to={`/produtos?cat=${c.slug}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.6rem" }}>{c.icon}</span>
              <b style={{ fontSize: "1.05rem" }}>{c.name}</b>
            </Link>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.subs.map((s) => (
                <Link key={s.id} className="chip" to={`/produtos?cat=${c.slug}&sub=${s.id}`}>
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
