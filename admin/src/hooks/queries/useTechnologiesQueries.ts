import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/service/api";

const TECHNOLOGIES_ENDPOINT = "/technologies";

// --- 1. Define SEO Interface ---
export interface SeoMetadata {
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  canonical_url?: string | null;
  robots?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  twitter_card?: string | null;
}

export type TechnologyStatus = "active" | "inactive";

// --- 2. Define Response Interface ---
export interface TechnologyResponse {
  id: number;
  roadmap_id: number;
  slug: string;
  slug_icon: string | null;
  title: string;
  description: string | null;
  seo_id: number | null;
  seo: SeoMetadata | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- 3. Define Payloads ---
export interface CreateTechnologyPayload {
  roadmap_id: number;
  slug: string;
  slug_icon?: string | null;
  title: string;
  description?: string | null;
  seo_id?: number | null;
  order_index?: number;
  is_active?: boolean;
  seo?: SeoMetadata | null;
}

export type UpdateTechnologyPayload = Partial<CreateTechnologyPayload>;

export interface UpdateTechnologyParams {
  techId: number;
  payload: UpdateTechnologyPayload;
}

// --- 4. Define Table Item (UI Representation) ---
export interface TechnologyTableItem {
  id: string;
  roadmapId: string;
  slug: string;
  slugIcon: string;
  name: string; // Mapped from 'title'
  description: string;
  orderIndex: number;
  status: TechnologyStatus;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  seo?: SeoMetadata;
}

export const technologyQueryKeys = {
  all: ["technologies"] as const,
  byId: (id: number) => ["technologies", id] as const,
};

const parseDateLabel = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

// --- 5. Mapping Function ---
const technologyToTableItem = (tech: TechnologyResponse): TechnologyTableItem => ({
  id: String(tech.id),
  roadmapId: String(tech.roadmap_id),
  slug: tech.slug,
  slugIcon: tech.slug_icon ?? "",
  name: tech.title, // Map backend 'title' to frontend 'name'
  description: tech.description ?? "",
  orderIndex: tech.order_index,
  status: (tech.is_active ? "active" : "inactive") as TechnologyStatus,
  is_active: tech.is_active,
  createdAt: parseDateLabel(tech.created_at),
  updatedAt: parseDateLabel(tech.updated_at),
  seo: tech.seo ?? undefined,
});

export const mapTechnologiesToTableItems = (technologies: TechnologyResponse[]) =>
  technologies.map(technologyToTableItem);

// --- API Functions ---
const fetchTechnologies = async () =>
  (await apiClient.get(`${TECHNOLOGIES_ENDPOINT}/`)) as TechnologyResponse[];

const createTechnology = async (payload: CreateTechnologyPayload) =>
  (await apiClient.post(`${TECHNOLOGIES_ENDPOINT}/`, payload)) as TechnologyResponse;

const updateTechnology = async ({ techId, payload }: UpdateTechnologyParams) =>
  (await apiClient.put(`${TECHNOLOGIES_ENDPOINT}/${techId}`, payload)) as TechnologyResponse;

const deleteTechnology = async (techId: number) =>
  (await apiClient.delete(`${TECHNOLOGIES_ENDPOINT}/${techId}`)) as { message: string };

// --- Hooks ---
export function useTechnologiesQuery() {
  return useQuery({
    queryKey: technologyQueryKeys.all,
    queryFn: fetchTechnologies,
  });
}

export function useCreateTechnologyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTechnology,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: technologyQueryKeys.all }),
  });
}

export function useUpdateTechnologyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTechnology,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: technologyQueryKeys.all }),
  });
}

export function useDeleteTechnologyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTechnology,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: technologyQueryKeys.all }),
  });
}