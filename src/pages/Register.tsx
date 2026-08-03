import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { LOCATIONS } from "../lib/locations";
import PhoneInput from "../components/PhoneInput";

export default function Register() {
  const { backendReady } = useAuth();
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!backendReady) {
      setError("A base de dados ainda não está ligada. Volte dentro de momentos.");
      return;
    }
    if (password.length < 6) {
      setError("A password deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);

    const { data, error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { company_name: company } },
    });

    if (signErr) {
      setLoading(false);
      setError(signErr.message.includes("registered") ? "Este email já está registado." : signErr.message);
      return;
    }

    // Create the company profile. If email confirmation is on there may be no
    // session yet; the trigger in the DB also creates a base profile as backup.
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        company_name: company,
        location,
        phone,
      });
    }

    setLoading(false);

    if (data.session) {
      navigate("/painel");
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="auth-wrap">
        <div className="panel">
          <h1>Conta criada! 🎉</h1>
          <div className="ok-box" style={{ marginTop: 12 }}>
            Enviámos um email de confirmação para <b>{email}</b>. Confirme o email
            e depois faça login para começar a publicar anúncios.
          </div>
          <Link className="btn btn-primary btn-block btn-lg" to="/entrar">
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="panel">
        <h1>Criar conta de empresa</h1>
        <p className="sub">Grátis. 3 anúncios por semana incluídos.</p>

        {!backendReady && (
          <div className="ok-box">
            Modo de pré-visualização — o registo fica ativo assim que a base de
            dados estiver ligada.
          </div>
        )}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome da empresa</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} required />
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
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            <div className="hint">Mínimo 6 caracteres.</div>
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? "A criar…" : "Criar conta"}
          </button>
        </form>

        <div className="center-link">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
