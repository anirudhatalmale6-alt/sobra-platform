import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { backendReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!backendReady) {
      setError("A base de dados ainda não está ligada. Volte dentro de momentos.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email ou password incorretos.");
      return;
    }
    navigate("/painel");
  }

  return (
    <div className="auth-wrap">
      <div className="panel">
        <h1>Entrar</h1>
        <p className="sub">Aceda à sua conta de empresa.</p>

        {!backendReady && (
          <div className="ok-box">
            Modo de pré-visualização — o registo e o login ficam ativos assim que a
            base de dados estiver ligada.
          </div>
        )}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <div className="center-link">
          Ainda não tem conta? <Link to="/registar">Criar conta de empresa</Link>
        </div>
      </div>
    </div>
  );
}
