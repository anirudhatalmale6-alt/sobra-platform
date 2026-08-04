import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { LOCATIONS } from "../lib/locations";
import PhoneInput from "../components/PhoneInput";

export default function Register() {
  const { backendReady } = useAuth();
  const [accountType, setAccountType] = useState<"empresa" | "particular">("empresa");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
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
    const emailOk = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
    if (!emailOk) {
      setError("Introduza um email válido.");
      return;
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("A password deve ter pelo menos 8 caracteres, incluindo letras e números.");
      return;
    }
    if (accountType === "empresa" && !address.trim()) {
      setError("Indique a morada da loja para que os clientes a possam encontrar.");
      return;
    }
    setLoading(true);

    const { data, error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { company_name: company, account_type: accountType } },
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
        account_type: accountType,
        location,
        address,
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
        <h1>Criar conta</h1>
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
            <label>Tipo de conta</label>
            <div className="segmented">
              <button type="button" className={accountType === "empresa" ? "on" : ""} onClick={() => setAccountType("empresa")}>
                Empresa / Loja
              </button>
              <button type="button" className={accountType === "particular" ? "on" : ""} onClick={() => setAccountType("particular")}>
                Particular
              </button>
            </div>
          </div>
          <div className="field">
            <label>{accountType === "empresa" ? "Nome da loja / empresa" : "Nome (pessoa)"}</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} required
              placeholder={accountType === "empresa" ? "Ex: Mercearia do Filipe" : "Ex: Filipe Dias"} />
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
          {accountType === "empresa" && (
            <div className="field">
              <label>Morada da loja</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} required
                placeholder="Rua, número, código-postal, cidade" />
              <div className="hint">Aparece nos seus anúncios com link para o Google Maps.</div>
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} />
            <div className="hint">Mínimo 8 caracteres, com letras e números.</div>
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
