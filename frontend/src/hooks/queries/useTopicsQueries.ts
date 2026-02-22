import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Technology, Module, Topic } from "@/types/api";

// API Fetchers
export const fetchTechnologyBySlug = async (slug: string): Promise<Technology> => {
  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Technology not found");

  return data as Technology;
};

export const fetchModulesByTechnology = async (technologyId: number): Promise<Module[]> => {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("technology_id", technologyId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return (data || []) as Module[];
};

export const fetchTopicsByModule = async (moduleId: number): Promise<Topic[]> => {
  const { data, error } = await supabase
    .from("topics")
    .select(`
      *,
      sub_topics (*)
    `)
    .eq("module_id", moduleId)
    .order("order_index", { ascending: true });

  if (error) throw error;

  // Ensure sub_topics are ordered as well if they have an order_index
  const topics = (data || []).map(topic => ({
    ...topic,
    sub_topics: (topic.sub_topics || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
  }));

  return topics as Topic[];
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
