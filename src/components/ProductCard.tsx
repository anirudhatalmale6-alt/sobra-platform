import { Link } from "react-router-dom";
import type { Listing } from "../lib/types";
import { categoryById } from "../lib/categories";
import { euro, discountPct } from "../lib/format";

export default function ProductCard({ listing }: { listing: Listing }) {
  const off = discountPct(listing.price, listing.original_price);
  const cat = categoryById(listing.category_id);
  const cover = listing.images && listing.images.length ? listing.images[0] : null;
  const isNew = listing.condition === "Devolução nova";
  const seller = listing.profiles?.company_name || "Empresa";

  return (
    <Link className="card" to={`/anuncio/${listing.id}`}>
      <div className="thumb">
        <span className={`badge ${isNew ? "new" : ""}`}>{listing.condition}</span>
        {cover ? <img src={cover} alt={listing.title} loading="lazy" /> : <span>{cat?.icon || "📦"}</span>}
      </div>
      <div className="card-body">
        <div className="seller">
          <span className="dot">{seller.charAt(0).toUpperCase()}</span>
          {seller}
        </div>
        <h3>{listing.title}</h3>
        <div className="price">
          <b>{euro(listing.price)}</b>
          {listing.original_price && <s>{euro(listing.original_price)}</s>}
          {off != null && <span className="off">-{off}%</span>}
        </div>
      </div>
    </Link>
  );
}
