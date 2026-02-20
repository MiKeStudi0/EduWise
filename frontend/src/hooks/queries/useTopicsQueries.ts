import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/apiClient";
import type { Technology, Module, Topic } from "@/types/api";

// API Fetchers
export const fetchTechnologyBySlug = async (slug: string): Promise<Technology> => {
  return fetchApi<Technology>(`/technologies/roadmap/1/${slug}`);
};

export const fetchModulesByTechnology = async (technologyId: number): Promise<Module[]> => {
  return fetchApi<Module[]>(`/modules/technology/${technologyId}`);
};

export const fetchTopicsByModule = async (moduleId: number): Promise<Topic[]> => {
  return fetchApi<Topic[]>(`/topics/module/${moduleId}`);
};

// Query Keys
export const topicsQueryKeys = {
  technologyBySlug: (slug: string) => ["technology", slug] as const,
  modulesByTechnology: (technologyId: number) => ["modules", "technology", technologyId] as const,
  topicsByModule: (moduleId: number) => ["topics", "module", moduleId] as const,
};

// React Query Hooks
export function useTechnologyBySlugQuery(slug: string) {
  return useQuery({
    queryKey: topicsQueryKeys.technologyBySlug(slug),
    queryFn: () => fetchTechnologyBySlug(slug),
    enabled: !!slug,
  });
}

export function useModulesByTechnologyQuery(technologyId: number | undefined) {
  return useQuery({
    queryKey: topicsQueryKeys.modulesByTechnology(technologyId as number),
    queryFn: () => fetchModulesByTechnology(technologyId as number),
    enabled: !!technologyId,
  });
}

export function useTopicsByModuleQuery(moduleId: number | undefined) {
  return useQuery({
    queryKey: topicsQueryKeys.topicsByModule(moduleId as number),
    queryFn: () => fetchTopicsByModule(moduleId as number),
    enabled: !!moduleId,
  });
}
