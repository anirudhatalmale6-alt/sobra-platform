import type { Listing } from "./types";

// Used only in preview mode (before the Supabase backend is wired up) so the
// interface is fully browsable. Real data replaces this automatically once
// config.js carries the Supabase credentials.
const daysFromNow = (d: number) =>
  new Date(Date.now() + d * 86400000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

type SampleRaw = Omit<Listing, "expiry_date" | "promo_ends_at" | "profiles"> & {
  profiles?: { company_name: string; logo_url: string | null; location: string | null };
};

const RAW: SampleRaw[] = [
  {
    id: "s1", owner: "d1", title: "Ténis running coleção anterior",
    description: "Stock de fim de estação, modelo do ano passado, novos em caixa.",
    price: 39, original_price: 89, condition: "Fim de estação",
    category_id: 8, subcategory_id: 805, location: "Porto", images: null,
    status: "active", created_at: daysAgo(1), expires_at: daysFromNow(6),
    profiles: { company_name: "NorteSport", logo_url: null, location: "Porto" },
  },
  {
    id: "s2", owner: "d2", title: "Casaco de inverno acolchoado",
    description: "Excedente de coleção. Vários tamanhos disponíveis.",
    price: 29, original_price: 79, condition: "Fim de estação",
    category_id: 2, subcategory_id: 202, location: "Lisboa", images: null,
    status: "active", created_at: daysAgo(2), expires_at: daysFromNow(5),
    profiles: { company_name: "ModaLisboa", logo_url: null, location: "Lisboa" },
  },
  {
    id: "s3", owner: "d3", title: "Máquina de café (devolução nova)",
    description: "Devolução de cliente, como nova, testada e higienizada.",
    price: 55, original_price: 129, condition: "Devolução nova",
    category_id: 3, subcategory_id: 304, location: "Braga", images: null,
    status: "active", created_at: daysAgo(1), expires_at: daysFromNow(6),
    profiles: { company_name: "TecPorto", logo_url: null, location: "Braga" },
  },
  {
    id: "s4", owner: "d4", title: "Conjunto de panelas inox",
    description: "Excedente de armazém. Aço inoxidável, 5 peças.",
    price: 34, original_price: 75, condition: "Excedente",
    category_id: 3, subcategory_id: 303, location: "Aveiro", images: null,
    status: "active", created_at: daysAgo(3), expires_at: daysFromNow(4),
    profiles: { company_name: "CasaBela", logo_url: null, location: "Aveiro" },
  },
  {
    id: "s5", owner: "d5", title: "Azeite virgem extra (lote)",
    description: "Lote de produção, embalado, validade longa.",
    price: 19, original_price: 32, condition: "Excedente",
    category_id: 1, subcategory_id: 104, location: "Évora", images: null,
    status: "active", created_at: daysAgo(4), expires_at: daysFromNow(3),
    profiles: { company_name: "Quinta do Vale", logo_url: null, location: "Évora" },
  },
  {
    id: "s6", owner: "d3", title: "Auscultadores sem fios",
    description: "Devolução nova, selados, garantia do fabricante.",
    price: 24, original_price: 59, condition: "Devolução nova",
    category_id: 6, subcategory_id: 602, location: "Braga", images: null,
    status: "active", created_at: daysAgo(2), expires_at: daysFromNow(5),
    profiles: { company_name: "TecPorto", logo_url: null, location: "Braga" },
  },
  {
    id: "s7", owner: "d6", title: "Berbequim + mala de brocas",
    description: "Saldo de loja, ferramenta profissional.",
    price: 45, original_price: 99, condition: "Saldo",
    category_id: 4, subcategory_id: 402, location: "Coimbra", images: null,
    status: "active", created_at: daysAgo(1), expires_at: daysFromNow(6),
    profiles: { company_name: "ConstruTudo", logo_url: null, location: "Coimbra" },
  },
  {
    id: "s8", owner: "d7", title: "Portátil 15\" (liquidação)",
    description: "Liquidação de stock, modelo anterior, novo.",
    price: 349, original_price: 599, condition: "Liquidação",
    category_id: 5, subcategory_id: 501, location: "Lisboa", images: null,
    status: "active", created_at: daysAgo(5), expires_at: daysFromNow(2),
    profiles: { company_name: "InfoStore", logo_url: null, location: "Lisboa" },
  },
];

export const SAMPLE_LISTINGS: Listing[] = RAW.map((r) => ({
  ...r,
  expiry_date: null,
  promo_ends_at: null,
  profiles: r.profiles ? { ...r.profiles, address: null, phone: null } : undefined,
}));
