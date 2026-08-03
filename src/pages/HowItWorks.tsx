import { Link } from "react-router-dom";

const steps = [
  { n: 1, t: "A empresa publica", d: "Cria o perfil e lista o stock excedente em minutos, com fotos e preço." },
  { n: 2, t: "O comprador procura", d: "Pesquisa e filtra sem precisar de conta. Encontra o que quer ao melhor preço." },
  { n: 3, t: "Contacto direto", d: "Envia um pedido à empresa através da plataforma. Sem comissões complicadas." },
  { n: 4, t: "Menos desperdício", d: "O stock ganha nova vida, a empresa recupera valor e o planeta agradece." },
];

export default function HowItWorks() {
  return (
    <div className="wrap" style={{ paddingTop: 26, paddingBottom: 40 }}>
      <div className="sec-head">
        <div>
          <h2>Como funciona</h2>
          <p>Simples para quem vende e para quem compra.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
        {steps.map((s) => (
          <div className="panel" key={s.n}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--amber)", color: "#3a2600", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: 12 }}>
              {s.n}
            </div>
            <h3 style={{ fontSize: "1.08rem", marginBottom: 6 }}>{s.t}</h3>
            <p style={{ color: "var(--muted)", fontSize: ".92rem" }}>{s.d}</p>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: "1.15rem", marginBottom: 8 }}>Planos</h3>
        <p style={{ color: "var(--muted)", fontSize: ".93rem" }}>
          Cada empresa tem <b>3 anúncios grátis por semana</b>, cada um visível
          durante 1 semana. Para publicar mais anúncios, dar destaque a um produto
          ou ter anúncios sempre ativos, existem opções pagas simples e acessíveis.
        </p>
        <Link className="btn btn-primary" to="/registar" style={{ marginTop: 14 }}>
          Começar grátis
        </Link>
      </div>
    </div>
  );
}
