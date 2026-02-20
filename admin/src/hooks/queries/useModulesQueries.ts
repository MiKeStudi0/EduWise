import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/service/api";
import { SeoMetadata } from "./useTechnologiesQueries"; // Reusing from technologies

const MODULES_ENDPOINT = "/modules";

export type ModuleStatus = "active" | "inactive";

// --- API Response Interface ---
export interface ModuleResponse {
  id: number;
  roadmap_id: number;
  technology_id: number;
  slug: string;
  title: string;
  description: string | null;
  seo_id: number | null;
  seo: SeoMetadata | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- API Payloads ---
export interface CreateModulePayload {
  roadmap_id: number;
  technology_id: number;
  slug: string;
  title: string;
  description?: string | null;
  seo_id?: number | null;
  order_index?: number;
  is_active?: boolean;
  seo?: SeoMetadata | null;
}

export type UpdateModulePayload = Partial<CreateModulePayload>;

export interface UpdateModuleParams {
  moduleId: number;
  payload: UpdateModulePayload;
}

// --- UI Representation (Table Item) ---
export interface ModuleTableItem {
  id: string;
  roadmapId: string;
  technologyId: string;
  slug: string;
  name: string; // Mapped from 'title'
  description: string;
  orderIndex: number;
  status: ModuleStatus;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  seo?: SeoMetadata;
}

// --- Query Keys ---
export const moduleQueryKeys = {
  all: ["modules"] as const,
  byTechnology: (technologyId: number) => ["modules", "technology", technologyId] as const,
  byId: (id: number) => ["modules", id] as const,
};

const parseDateLabel = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

// --- Mapping Function ---
const moduleToTableItem = (mod: ModuleResponse): ModuleTableItem => ({
  id: String(mod.id),
  roadmapId: String(mod.roadmap_id),
  technologyId: String(mod.technology_id),
  slug: mod.slug,
  name: mod.title,
  description: mod.description ?? "",
  orderIndex: mod.order_index,
  status: (mod.is_active ? "active" : "inactive") as ModuleStatus,
  is_active: mod.is_active,
  createdAt: parseDateLabel(mod.created_at),
  updatedAt: parseDateLabel(mod.updated_at),
  seo: mod.seo ?? undefined,
});

export const mapModulesToTableItems = (modules: ModuleResponse[]) => modules.map(moduleToTableItem);

// --- API Client Functions ---
const fetchModulesByTechnology = async (technologyId: number) =>
  (await apiClient.get(`${MODULES_ENDPOINT}/technology/${technologyId}`)) as ModuleResponse[];

const createModule = async (payload: CreateModulePayload) =>
  (await apiClient.post(`${MODULES_ENDPOINT}/`, payload)) as ModuleResponse;

const updateModule = async ({ moduleId, payload }: UpdateModuleParams) =>
  (await apiClient.put(`${MODULES_ENDPOINT}/${moduleId}`, payload)) as ModuleResponse;

const deleteModule = async (moduleId: number) =>
  (await apiClient.delete(`${MODULES_ENDPOINT}/${moduleId}`)) as { message: string };

// --- React Query Hooks ---
export function useModulesQuery(technologyId: number | undefined) {
  return useQuery({
    queryKey: moduleQueryKeys.byTechnology(technologyId as number),
    queryFn: () => fetchModulesByTechnology(technologyId as number),
    enabled: !!technologyId,
  });
}

export function useCreateModuleMutation(technologyId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.all });
      if (technologyId) {
        queryClient.invalidateQueries({ queryKey: moduleQueryKeys.byTechnology(technologyId) });
      }
    },
  });
}

export function useUpdateModuleMutation(technologyId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.all });
      if (technologyId) {
        queryClient.invalidateQueries({ queryKey: moduleQueryKeys.byTechnology(technologyId) });
      }
    },
  });
}

export function useDeleteModuleMutation(technologyId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKeys.all });
      if (technologyId) {
        queryClient.invalidateQueries({ queryKey: moduleQueryKeys.byTechnology(technologyId) });
      }
    },
  });
}
