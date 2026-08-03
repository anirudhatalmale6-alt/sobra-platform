import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Listing } from "../lib/types";
import { fetchListing } from "../lib/api";
import { categoryById, subcategoryById } from "../lib/categories";
import { euro, discountPct, timeAgo, daysLeft } from "../lib/format";
import CategoryIcon from "../components/CategoryIcon";

const fmtDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return d;
  }
};

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
                <span className="thumb-ico">{cat ? <CategoryIcon slug={cat.slug} size={64} /> : null}</span>
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

            {(listing.expiry_date || listing.promo_ends_at) && (
              <div>
                {listing.expiry_date && (
                  <span className="pill-date">Validade: {fmtDate(listing.expiry_date)}</span>
                )}
                {listing.promo_ends_at && (
                  <span className="pill-date">Promoção até: {fmtDate(listing.promo_ends_at)}</span>
                )}
              </div>
            )}

            <div className="seller-card">
              <div className="avatar">{seller.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{seller}</div>
                <div style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                  {listing.profiles?.location || listing.location || "Portugal"}
                </div>
              </div>
            </div>

            <div className="contact-box">
              <h3 style={{ fontSize: ".95rem", marginBottom: 2 }}>Contacto da loja</h3>
              {listing.profiles?.phone && (
                <div className="contact-line">
                  <svg className="ci" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <a href={`tel:${listing.profiles.phone.replace(/\s/g, "")}`}>{listing.profiles.phone}</a>
                </div>
              )}
              {listing.profiles?.address && (
                <div className="contact-line">
                  <svg className="ci" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      [listing.profiles.address, listing.profiles.location].filter(Boolean).join(", ")
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {listing.profiles.address}
                  </a>
                </div>
              )}
              {!listing.profiles?.phone && !listing.profiles?.address && (
                <p className="hint">Este vendedor ainda não indicou o contacto/morada da loja.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
