import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { LOCATIONS } from "../lib/locations";
import PhoneInput from "../components/PhoneInput";

export default function EditProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setCompany(profile.company_name || "");
      setDescription(profile.description || "");
      setLocation(profile.location || "");
      setAddress(profile.address || "");
      setPhone(profile.phone || "");
      setWebsite(profile.website || "");
    }
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSaved(false);
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      company_name: company,
      description,
      location,
      address,
      phone,
      website,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    await refreshProfile();
    setSaved(true);
  }

  return (
    <div className="auth-wrap" style={{ maxWidth: 620 }}>
      <div className="panel">
        <div className="breadcrumb" style={{ marginTop: 0 }}>
          <Link to="/painel">Painel</Link> / Editar perfil
        </div>
        <h1>Perfil da empresa</h1>
        <p className="sub">Estas informações aparecem nos seus anúncios.</p>

        {saved && <div className="ok-box">Perfil guardado com sucesso.</div>}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome da empresa</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} required />
          </div>
          <div className="field">
            <label>Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="O que a sua empresa faz…" />
          </div>
          <div className="row2">
            <div className="field">
              <label>Localidade (distrito)</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">— Escolher —</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Telefone</label>
              <PhoneInput value={phone} onChange={setPhone} />
            </div>
          </div>
          <div className="field">
            <label>Morada da loja <span style={{ color: "var(--muted)", fontWeight: 400 }}>(aparece nos anúncios)</span></label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, código-postal, cidade" />
          </div>
          <div className="field">
            <label>Website <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opcional)</span></label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
              {loading ? "A guardar…" : "Guardar perfil"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => navigate("/painel")}>
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
