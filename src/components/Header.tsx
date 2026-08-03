import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, profile, backendReady, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <>
      {!backendReady && (
        <div className="preview-banner">
          Modo de pré-visualização — a base de dados ainda não está ligada. Assim que
          o Supabase for configurado, tudo fica a funcionar a sério.
        </div>
      )}
      <header className="site">
        <div className="wrap nav">
          <Link className="logo" to="/">
            <img className="logo-img" src={`${import.meta.env.BASE_URL}logo.svg`} alt="NexStock" />
          </Link>
          <nav className="nav-links">
            <NavLink to="/produtos">Produtos</NavLink>
            <NavLink to="/categorias">Categorias</NavLink>
            <NavLink to="/como-funciona">Como funciona</NavLink>
          </nav>
          <div className="nav-right">
            {user ? (
              <>
                <Link className="btn btn-ghost" to="/painel">
                  {profile?.company_name || "Painel"}
                </Link>
                <Link className="btn btn-primary" to="/painel/novo-anuncio">
                  + Anúncio
                </Link>
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost" to="/entrar">
                  Entrar
                </Link>
                <Link className="btn btn-primary" to="/registar">
                  Vender stock
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
