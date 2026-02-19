import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/service/api";

const ROADMAPS_ENDPOINT = "/roadmaps";

// --- 1. Define SEO Interface (New) ---
export interface SeoMetadata {
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  canonical_url?: string | null;
  og_image_url?: string | null;
  // Add other fields from your backend model if needed
}

export type RoadmapStatus = "active" | "inactive";

// --- 2. Update Response Interface to include SEO ---
export interface RoadmapResponse {
  id: number;
  slug: string;
  slug_icon: string | null;
  title: string;
  description: string | null;
  seo_id: number | null;
  seo: SeoMetadata | null; // <--- Added this
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- 3. Update Payload to include SEO structure ---
export interface CreateRoadmapPayload {
  slug: string;
  slug_icon?: string | null;
  title: string;
  description?: string | null;
  seo_id?: number | null;
  order_index?: number;
  is_active?: boolean;
  seo?: SeoMetadata | null; // <--- Added this
}

export type UpdateRoadmapPayload = Partial<CreateRoadmapPayload>;

export interface UpdateRoadmapParams {
  roadmapId: number;
  payload: UpdateRoadmapPayload;
}

// --- 4. Update Table Item to strictly match what UI needs ---
export interface RoadmapTableItem {
  id: string;
  slug: string;
  slugIcon: string;
  title: string;
  description: string;
  orderIndex: number;
  seoId: number | null;
  seo?: SeoMetadata; // <--- Added this so the Form can read it
  status: RoadmapStatus;
  is_active: boolean; // Useful for toggling logic
  createdAt: string;
  updatedAt: string;
}

export const roadmapQueryKeys = {
  all: ["roadmaps"] as const,
  bySlug: (slug: string) => ["roadmaps", slug] as const,
};

const parseDateLabel = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

// --- 5. Fix the Mapping Function ---
const roadmapToTableItem = (roadmap: RoadmapResponse): RoadmapTableItem => ({
  id: String(roadmap.id),
  slug: roadmap.slug,
  slugIcon: roadmap.slug_icon ?? "",
  title: roadmap.title,
  description: roadmap.description ?? "",
  orderIndex: roadmap.order_index,
  seoId: roadmap.seo_id,
  seo: roadmap.seo ?? undefined, // Handle null/undefined conversion
  // Explicitly cast the status to satisfy the strict union type
  status: (roadmap.is_active ? "active" : "inactive") as RoadmapStatus,
  is_active: roadmap.is_active,
  createdAt: parseDateLabel(roadmap.created_at),
  updatedAt: parseDateLabel(roadmap.updated_at),
});

export const mapRoadmapsToTableItems = (roadmaps: RoadmapResponse[]) =>
  roadmaps.map(roadmapToTableItem);

const fetchRoadmaps = async () =>
  (await apiClient.get(`${ROADMAPS_ENDPOINT}/`)) as RoadmapResponse[];

const fetchRoadmapBySlug = async (slug: string) =>
  (await apiClient.get(`${ROADMAPS_ENDPOINT}/${slug}`)) as RoadmapResponse;

const createRoadmap = async (payload: CreateRoadmapPayload) =>
  (await apiClient.post(`${ROADMAPS_ENDPOINT}/`, payload)) as RoadmapResponse;

const updateRoadmap = async ({ roadmapId, payload }: UpdateRoadmapParams) =>
  (await apiClient.put(`${ROADMAPS_ENDPOINT}/${roadmapId}`, payload)) as RoadmapResponse;

const deleteRoadmap = async (roadmapId: number) =>
  (await apiClient.delete(`${ROADMAPS_ENDPOINT}/${roadmapId}`)) as { message: string };

export function useRoadmapsQuery() {
  return useQuery({
    queryKey: roadmapQueryKeys.all,
    queryFn: fetchRoadmaps,
  });
}

export function useRoadmapBySlugQuery(slug?: string) {
  return useQuery({
    queryKey: roadmapQueryKeys.bySlug(slug ?? ""),
    queryFn: () => fetchRoadmapBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

export function useCreateRoadmapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoadmap,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all });
      queryClient.setQueryData(roadmapQueryKeys.bySlug(created.slug), created);
    },
  });
}

export function useUpdateRoadmapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRoadmap,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all });
      queryClient.setQueryData(roadmapQueryKeys.bySlug(updated.slug), updated);
    },
  });
}

export function useDeleteRoadmapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all });
    },
  });
}