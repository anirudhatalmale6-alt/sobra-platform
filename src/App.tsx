import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Categories from "./pages/Categories";
import ListingDetail from "./pages/ListingDetail";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewListing from "./pages/NewListing";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Browse />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/anuncio/:id" element={<ListingDetail />} />
          <Route path="/como-funciona" element={<HowItWorks />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/registar" element={<Register />} />
          <Route path="/painel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/painel/novo-anuncio" element={<ProtectedRoute><NewListing /></ProtectedRoute>} />
          <Route path="/painel/editar/:id" element={<ProtectedRoute><NewListing /></ProtectedRoute>} />
          <Route path="/painel/perfil" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
