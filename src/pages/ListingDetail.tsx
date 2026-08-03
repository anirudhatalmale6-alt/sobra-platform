import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Listing } from "../lib/types";
import { fetchListing } from "../lib/api";
import { categoryById, subcategoryById } from "../lib/categories";
import { euro, discountPct, timeAgo, daysLeft } from "../lib/format";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchListing(id)
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!listing)
    return (
      <div className="empty">
        <div className="ico">❔</div>
        <p>Anúncio não encontrado.</p>
        <Link className="btn btn-primary" to="/produtos" style={{ marginTop: 14 }}>
          Ver outros produtos
        </Link>
      </div>
    );

  const cat = categoryById(listing.category_id);
  const sub = subcategoryById(listing.subcategory_id);
  const off = discountPct(listing.price, listing.original_price);
  const images = listing.images || [];
  const seller = listing.profiles?.company_name || "Empresa";
  const left = daysLeft(listing.expires_at);

  return (
    <div className="wrap" style={{ paddingBottom: 40 }}>
      <div className="breadcrumb">
        <Link to="/">Início</Link> / <Link to="/produtos">Produtos</Link>
        {cat && <> / <Link to={`/produtos?cat=${cat.slug}`}>{cat.name}</Link></>}
      </div>

      <div className="detail">
        <div>
          <div className="gallery">
            <div className="main">
              {images.length ? (
                <img src={images[active]} alt={listing.title} />
              ) : (
                <span>{cat?.icon || "📦"}</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${listing.title} ${i + 1}`}
                    onClick={() => setActive(i)}
                    style={{ borderColor: i === active ? "var(--green)" : undefined }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: 6 }}>Descrição</h2>
            <p className="desc">{listing.description || "Sem descrição."}</p>
          </div>
        </div>

        <div className="side">
          <div className="panel">
            <span className="tag">{listing.condition}</span>
            <h1 style={{ marginTop: 10 }}>{listing.title}</h1>
            <div className="big-price">
              <b>{euro(listing.price)}</b>
              {listing.original_price && <s>{euro(listing.original_price)}</s>}
              {off != null && <span className="off" style={{ fontSize: ".8rem" }}>-{off}%</span>}
            </div>
            <div style={{ fontSize: ".85rem", color: "var(--muted)" }}>
              {cat?.name}
              {sub && ` · ${sub.name}`}
              {listing.location && ` · ${listing.location}`}
              <br />
              Publicado {timeAgo(listing.created_at)}
              {left != null && ` · expira em ${left} dia${left !== 1 ? "s" : ""}`}
            </div>

            <div className="seller-card">
              <div className="avatar">{seller.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{seller}</div>
                <div style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                  {listing.profiles?.location || listing.location || "Portugal"}
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-block btn-lg" disabled title="Disponível na próxima etapa">
              ✉ Contactar vendedor
            </button>
            <p className="hint" style={{ textAlign: "center" }}>
              O formulário de contacto fica disponível na próxima etapa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
