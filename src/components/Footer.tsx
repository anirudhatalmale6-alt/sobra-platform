import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">Nex<span style={{ color: "var(--green)" }}>Stock</span></div>
            <p style={{ fontSize: ".88rem", maxWidth: "34ch" }}>
              O marketplace que dá uma segunda oportunidade ao stock e poupa
              dinheiro a quem compra.
            </p>
          </div>
          <div>
            <h4>Plataforma</h4>
            <Link to="/produtos">Explorar produtos</Link>
            <Link to="/categorias">Categorias</Link>
            <Link to="/registar">Vender stock</Link>
          </div>
          <div>
            <h4>Empresas</h4>
            <Link to="/registar">Criar conta</Link>
            <Link to="/entrar">Entrar</Link>
            <Link to="/como-funciona">Como funciona</Link>
          </div>
          <div>
            <h4>Sobre</h4>
            <Link to="/como-funciona">A nossa missão</Link>
            <Link to="/produtos">Novidades</Link>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 NexStock · Feito em Portugal 🇵🇹</span>
          <span>Menos desperdício, mais poupança.</span>
        </div>
      </div>
    </footer>
  );
}
