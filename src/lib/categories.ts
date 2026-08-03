// Category tree used for the UI and to seed the database.
// Kept in sync with db/schema.sql (same slugs).

export interface CategoryDef {
  id: number;
  slug: string;
  name: string;
  icon: string;
  subs: { id: number; slug: string; name: string }[];
}

// ids are stable and match the seed in db/schema.sql
export const CATEGORIES: CategoryDef[] = [
  {
    id: 1, slug: "alimentacao", name: "Alimentação", icon: "🥫",
    subs: [
      { id: 101, slug: "talho", name: "Talho" },
      { id: 102, slug: "supermercado", name: "Supermercado" },
      { id: 103, slug: "padaria", name: "Padaria" },
      { id: 104, slug: "mercearia", name: "Mercearia" },
      { id: 105, slug: "bebidas", name: "Bebidas" },
      { id: 106, slug: "congelados", name: "Congelados" },
      { id: 107, slug: "perto-validade", name: "Perto da validade" },
    ],
  },
  {
    id: 2, slug: "moda", name: "Moda", icon: "👗",
    subs: [
      { id: 201, slug: "homem", name: "Homem" },
      { id: 202, slug: "mulher", name: "Mulher" },
      { id: 203, slug: "crianca", name: "Criança" },
      { id: 204, slug: "calcado", name: "Calçado" },
      { id: 205, slug: "acessorios", name: "Acessórios" },
    ],
  },
  {
    id: 3, slug: "casa", name: "Casa", icon: "🛋️",
    subs: [
      { id: 301, slug: "mobiliario", name: "Mobiliário" },
      { id: 302, slug: "decoracao", name: "Decoração" },
      { id: 303, slug: "cozinha", name: "Cozinha" },
      { id: 304, slug: "eletrodomesticos", name: "Eletrodomésticos" },
      { id: 305, slug: "jardim", name: "Jardim" },
    ],
  },
  {
    id: 4, slug: "construcao", name: "Construção", icon: "🧱",
    subs: [
      { id: 401, slug: "materiais", name: "Materiais" },
      { id: 402, slug: "ferramentas", name: "Ferramentas" },
      { id: 403, slug: "canalizacao", name: "Canalização" },
      { id: 404, slug: "eletrico", name: "Elétrico" },
      { id: 405, slug: "tintas", name: "Tintas" },
    ],
  },
  {
    id: 5, slug: "informatica", name: "Informática", icon: "💻",
    subs: [
      { id: 501, slug: "computadores", name: "Computadores" },
      { id: 502, slug: "componentes", name: "Componentes" },
      { id: 503, slug: "perifericos", name: "Periféricos" },
      { id: 504, slug: "redes", name: "Redes" },
      { id: 505, slug: "software", name: "Software" },
    ],
  },
  {
    id: 6, slug: "tecnologia", name: "Tecnologia", icon: "📱",
    subs: [
      { id: 601, slug: "telemoveis", name: "Telemóveis" },
      { id: 602, slug: "audio", name: "Áudio" },
      { id: 603, slug: "tv-imagem", name: "TV & Imagem" },
      { id: 604, slug: "gaming", name: "Gaming" },
      { id: 605, slug: "wearables", name: "Wearables" },
    ],
  },
  {
    id: 7, slug: "beleza", name: "Beleza", icon: "💄",
    subs: [
      { id: 701, slug: "cosmetica", name: "Cosmética" },
      { id: 702, slug: "perfumes", name: "Perfumes" },
      { id: 703, slug: "cabelo", name: "Cabelo" },
      { id: 704, slug: "cuidado-corporal", name: "Cuidado corporal" },
    ],
  },
  {
    id: 8, slug: "desporto", name: "Desporto", icon: "⚽",
    subs: [
      { id: 801, slug: "fitness", name: "Fitness" },
      { id: 802, slug: "futebol", name: "Futebol" },
      { id: 803, slug: "outdoor", name: "Outdoor" },
      { id: 804, slug: "ciclismo", name: "Ciclismo" },
      { id: 805, slug: "roupa-desportiva", name: "Roupa desportiva" },
    ],
  },
  {
    id: 9, slug: "automovel", name: "Automóvel", icon: "🚗",
    subs: [
      { id: 901, slug: "pecas", name: "Peças" },
      { id: 902, slug: "acessorios-auto", name: "Acessórios" },
      { id: 903, slug: "pneus", name: "Pneus" },
      { id: 904, slug: "oleos", name: "Óleos" },
    ],
  },
  {
    id: 10, slug: "escritorio", name: "Escritório", icon: "🗂️",
    subs: [
      { id: 1001, slug: "papelaria", name: "Papelaria" },
      { id: 1002, slug: "mobiliario-escritorio", name: "Mobiliário de escritório" },
      { id: 1003, slug: "consumiveis", name: "Consumíveis" },
    ],
  },
];

export const categoryById = (id: number) => CATEGORIES.find((c) => c.id === id);
export const categoryBySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);
export const subcategoryById = (id: number | null) => {
  if (id == null) return undefined;
  for (const c of CATEGORIES) {
    const s = c.subs.find((s) => s.id === id);
    if (s) return s;
  }
  return undefined;
};
