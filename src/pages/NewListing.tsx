import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../lib/categories";
import { CONDITIONS } from "../lib/types";
import type { Condition } from "../lib/types";
import { LOCATIONS } from "../lib/locations";
import {
  createListing,
  updateListing,
  fetchListing,
  uploadImages,
} from "../lib/api";
import ImageUploader, { type PendingImage } from "../components/ImageUploader";

export default function NewListing() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [condition, setCondition] = useState<Condition>("Excedente");
  const [categoryId, setCategoryId] = useState<number>(CATEGORIES[0].id);
  const [subId, setSubId] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [nearExpiry, setNearExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [promoEndsAt, setPromoEndsAt] = useState("");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(editing);

  useEffect(() => {
    if (!editing || !id) return;
    fetchListing(id).then((l) => {
      if (l) {
        setTitle(l.title);
        setDescription(l.description || "");
        setPrice(String(l.price));
        setOriginalPrice(l.original_price ? String(l.original_price) : "");
        setCondition(l.condition);
        setCategoryId(l.category_id);
        setSubId(l.subcategory_id ?? "");
        setLocation(l.location || "");
        setExpiryDate(l.expiry_date || "");
        setNearExpiry(Boolean(l.expiry_date));
        setPromoEndsAt(l.promo_ends_at || "");
        setExistingImages(l.images || []);
      }
      setLoadingData(false);
    });
  }, [editing, id]);

  const subs = CATEGORIES.find((c) => c.id === categoryId)?.subs || [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!user) return;
    const priceNum = parseFloat(price.replace(",", "."));
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Indique um preço válido.");
      return;
    }
    const origNum = originalPrice ? parseFloat(originalPrice.replace(",", ".")) : null;

    setLoading(true);
    try {
      let uploaded: string[] = [];
      if (images.length) {
        uploaded = await uploadImages(user.id, images.map((i) => i.file));
      }
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        original_price: origNum,
        condition,
        category_id: categoryId,
        subcategory_id: subId === "" ? null : Number(subId),
        location: location.trim(),
        images: [...existingImages, ...uploaded],
        expiry_date: nearExpiry && expiryDate ? expiryDate : null,
        promo_ends_at: promoEndsAt || null,
      };

      if (editing && id) {
        await updateListing(id, payload);
      } else {
        await createListing(user.id, payload);
      }
      navigate("/painel");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao guardar o anúncio.";
      setError(msg);
      setLoading(false);
    }
  }

  if (loadingData) return <div className="spinner" />;

  return (
    <div className="auth-wrap" style={{ maxWidth: 620 }}>
      <div className="panel">
        <div className="breadcrumb" style={{ marginTop: 0 }}>
          <Link to="/painel">Painel</Link> / {editing ? "Editar anúncio" : "Novo anúncio"}
        </div>
        <h1>{editing ? "Editar anúncio" : "Publicar anúncio"}</h1>
        <p className="sub">Preencha os dados do produto. O anúncio fica visível 1 semana.</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex: Ténis running coleção anterior" />
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Estado do produto, quantidade disponível, detalhes…" />
          </div>

          <div className="row2">
            <div className="field">
              <label>Preço (€)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} required inputMode="decimal" placeholder="39" />
            </div>
            <div className="field">
              <label>Preço original (€) <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opcional)</span></label>
              <input value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} inputMode="decimal" placeholder="89" />
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label>Categoria</label>
              <select value={categoryId} onChange={(e) => { setCategoryId(Number(e.target.value)); setSubId(""); }}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Subcategoria</label>
              <select value={subId} onChange={(e) => setSubId(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">— Escolher —</option>
                {subs.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label>Estado</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value as Condition)}>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Localidade (distrito)</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} required>
                <option value="">— Escolher —</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="check">
              <input type="checkbox" checked={nearExpiry} onChange={(e) => setNearExpiry(e.target.checked)} />
              Produto com data de validade próxima
            </label>
          </div>

          <div className="row2">
            {nearExpiry && (
              <div className="field">
                <label>Data de validade</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required={nearExpiry} />
              </div>
            )}
            <div className="field">
              <label>Fim da promoção <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opcional)</span></label>
              <input type="date" value={promoEndsAt} onChange={(e) => setPromoEndsAt(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Fotografias</label>
            {existingImages.length > 0 && (
              <div className="previews" style={{ marginBottom: 10 }}>
                {existingImages.map((url, i) => (
                  <div className="pv" key={url}>
                    <img src={url} alt={`atual ${i + 1}`} />
                    <button type="button" onClick={() => setExistingImages((prev) => prev.filter((u) => u !== url))} aria-label="Remover">×</button>
                  </div>
                ))}
              </div>
            )}
            <ImageUploader images={images} onChange={setImages} max={6 - existingImages.length} />
          </div>

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? "A guardar…" : editing ? "Guardar alterações" : "Publicar anúncio"}
          </button>
        </form>
      </div>
    </div>
  );
}
