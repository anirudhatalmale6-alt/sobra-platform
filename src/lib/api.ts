import { supabase, BACKEND_READY } from "./supabase";
import type { Listing, Profile } from "./types";
import { SAMPLE_LISTINGS } from "./sampleData";

export interface ListingFilters {
  categoryId?: number;
  subcategoryId?: number;
  condition?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  q?: string;
  owner?: string;
  limit?: number;
}

// listings.owner references auth.users (not public.profiles), so PostgREST
// cannot embed the profile automatically. We fetch the owner profiles in a
// second query and join them in JS.
const profileFields = "id, company_name, logo_url, location, address, phone";

async function attachProfiles(listings: Listing[]): Promise<Listing[]> {
  const ownerIds = [...new Set(listings.map((l) => l.owner))].filter(Boolean);
  if (!ownerIds.length) return listings;
  const { data: profs } = await supabase
    .from("profiles")
    .select(profileFields)
    .in("id", ownerIds);
  const map = new Map((profs || []).map((p: any) => [p.id, p]));
  for (const l of listings) {
    const p: any = map.get(l.owner);
    if (p) {
      l.profiles = {
        company_name: p.company_name,
        logo_url: p.logo_url,
        location: p.location,
        address: p.address,
        phone: p.phone,
      };
    }
  }
  return listings;
}

export async function fetchListings(filters: ListingFilters = {}): Promise<Listing[]> {
  if (!BACKEND_READY) {
    // preview mode
    let rows = [...SAMPLE_LISTINGS];
    if (filters.categoryId) rows = rows.filter((r) => r.category_id === filters.categoryId);
    if (filters.subcategoryId) rows = rows.filter((r) => r.subcategory_id === filters.subcategoryId);
    if (filters.condition) rows = rows.filter((r) => r.condition === filters.condition);
    if (filters.location) rows = rows.filter((r) => r.location === filters.location);
    if (filters.priceMin != null) rows = rows.filter((r) => r.price >= filters.priceMin!);
    if (filters.priceMax != null) rows = rows.filter((r) => r.price <= filters.priceMax!);
    if (filters.owner) rows = rows.filter((r) => r.owner === filters.owner);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (r.profiles?.company_name || "").toLowerCase().includes(q)
      );
    }
    if (filters.limit) rows = rows.slice(0, filters.limit);
    return rows;
  }

  const nowIso = new Date().toISOString();
  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .or(`expires_at.gt.${nowIso},expires_at.is.null`)
    .order("created_at", { ascending: false });

  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.subcategoryId) query = query.eq("subcategory_id", filters.subcategoryId);
  if (filters.condition) query = query.eq("condition", filters.condition);
  if (filters.location) query = query.eq("location", filters.location);
  if (filters.priceMin != null) query = query.gte("price", filters.priceMin);
  if (filters.priceMax != null) query = query.lte("price", filters.priceMax);
  if (filters.owner) query = query.eq("owner", filters.owner);
  if (filters.q) query = query.ilike("title", `%${filters.q}%`);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return attachProfiles((data as unknown as Listing[]) || []);
}

export async function fetchListing(id: string): Promise<Listing | null> {
  if (!BACKEND_READY) {
    return SAMPLE_LISTINGS.find((l) => l.id === id) || null;
  }
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [withProfile] = await attachProfiles([data as unknown as Listing]);
  return withProfile;
}

export async function fetchMyListings(owner: string): Promise<Listing[]> {
  if (!BACKEND_READY) return [];
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("owner", owner)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Listing[]) || [];
}

export interface PlatformStats {
  activeListings: number;
  businesses: number;
  newThisWeek: number;
}

// Real, honest platform activity numbers for the "live" bar on the homepage.
export async function fetchStats(): Promise<PlatformStats> {
  if (!BACKEND_READY) {
    return { activeListings: SAMPLE_LISTINGS.length, businesses: 6, newThisWeek: SAMPLE_LISTINGS.length };
  }
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const [a, b, c] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "active").gte("created_at", weekAgo),
  ]);
  return {
    activeListings: a.count || 0,
    businesses: b.count || 0,
    newThisWeek: c.count || 0,
  };
}

export async function fetchProfile(id: string): Promise<Profile | null> {
  if (!BACKEND_READY) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Profile) || null;
}

export type NewListingInput = {
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  condition: string;
  category_id: number;
  subcategory_id: number | null;
  location: string;
  images: string[];
  expiry_date: string | null;
  promo_ends_at: string | null;
};

export async function createListing(owner: string, input: NewListingInput) {
  const expires = new Date(Date.now() + 7 * 86400000).toISOString();
  const { data, error } = await supabase
    .from("listings")
    .insert({ ...input, owner, expires_at: expires, status: "active" })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Listing;
}

export async function updateListing(id: string, input: Partial<NewListingInput>) {
  const { error } = await supabase.from("listings").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  if (error) throw error;
}

// Upload images to the public "listings" storage bucket, return public URLs.
export async function uploadImages(userId: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${Date.now()}-${i}.${ext}`;
    const { error } = await supabase.storage.from("listings").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("listings").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}
