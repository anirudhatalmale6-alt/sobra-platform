import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty" style={{ padding: "80px 20px" }}>
      <div className="ico">🧭</div>
      <h2 style={{ marginBottom: 8 }}>Página não encontrada</h2>
      <p>O endereço que procura não existe.</p>
      <Link className="btn btn-primary" to="/" style={{ marginTop: 16 }}>
        Voltar ao início
      </Link>
    </div>
  );
}
