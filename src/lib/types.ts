export type Condition =
  | "Excedente"
  | "Fim de estação"
  | "Devolução nova"
  | "Saldo"
  | "Liquidação";

export const CONDITIONS: Condition[] = [
  "Excedente",
  "Fim de estação",
  "Devolução nova",
  "Saldo",
  "Liquidação",
];

export interface Profile {
  id: string;
  company_name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  owner: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  condition: Condition;
  category_id: number;
  subcategory_id: number | null;
  location: string | null;
  images: string[] | null;
  status: "active" | "expired" | "hidden";
  created_at: string;
  expires_at: string | null;
  expiry_date: string | null;      // validade do produto (perto do fim)
  promo_ends_at: string | null;    // data de fim da promoção
  // joined
  profiles?: Pick<Profile, "company_name" | "logo_url" | "location" | "address" | "phone">;
}
