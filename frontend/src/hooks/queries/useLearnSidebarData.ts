import { useQuery, useQueries } from "@tanstack/react-query";
import { topicsQueryKeys, fetchTechnologyBySlug, fetchModulesByTechnology, fetchTopicsByModule } from "./useTopicsQueries";
import { FileCode, Palette, Terminal, BookOpen, MonitorPlay, Layers } from "lucide-react";

const getIconForModule = (slug: string) => {
  if (slug.includes("html")) return FileCode;
  if (slug.includes("css")) return Palette;
  if (slug.includes("javascript") || slug.includes("js")) return Terminal;
  return BookOpen;
};

const getColorForModule = (index: number) => {
  const colors = [
    { color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
    { color: "text-green-500", bgColor: "bg-green-500/10" },
    { color: "text-purple-500", bgColor: "bg-purple-500/10" },
  ];
  return colors[index % colors.length];
};

export function useLearnSidebarData(technologySlug: string) {
  // 1. Fetch Technology
  const technologyQuery = useQuery({
    queryKey: topicsQueryKeys.technologyBySlug(technologySlug),
    queryFn: () => fetchTechnologyBySlug(technologySlug),
    enabled: !!technologySlug,
  });

  const technologyId = technologyQuery.data?.id;

  // 2. Fetch Modules for Technology
  const modulesQuery = useQuery({
    queryKey: topicsQueryKeys.modulesByTechnology(technologyId as number),
    queryFn: () => fetchModulesByTechnology(technologyId as number),
    enabled: !!technologyId,
  });

  const modules = modulesQuery.data || [];

  // 3. Fetch Topics for ALL Modules
  const topicsQueries = useQueries({
    queries: modules.map((module) => ({
      queryKey: topicsQueryKeys.topicsByModule(module.id),
      queryFn: () => fetchTopicsByModule(module.id),
    })),
  });

  const isPending = technologyQuery.isPending || modulesQuery.isPending || topicsQueries.some(q => q.isPending);
  const isError = technologyQuery.isError || modulesQuery.isError || topicsQueries.some(q => q.isError);

  // 4. Transform data into the UI format
  const sidebarData = modules.map((module, index) => {
    const { color, bgColor } = getColorForModule(index);
    const moduleTopics = topicsQueries[index]?.data || [];

    return {
      id: module.slug,
      name: module.title,
      icon: getIconForModule(module.slug),
      color,
      bgColor,
      lessons: moduleTopics.map(topic => ({
        id: topic.slug,
        title: topic.title,
        description: topic.description || "",
        videoUrl: topic.video_url || "",
        problem: topic.problems || "No specific problem description provided.",
        mentalModel: topic.mental_models || "Think of this conceptually.",
        whenToUse: topic.when_to_use || [],
        whenNotToUse: topic.when_to_avoid || [],
        syntax: "", // Optionally fallback
        code: topic.examples?.trim() || "",
        subtopics: [] as any[], // We could potentially map subtopics here if we had them or map JSON content
        commonMistakes: topic.common_mistakes || [],
        bonusTip: topic.bonus_tips || ""
      }))
    };
  });

  return {
    data: sidebarData,
    technology: technologyQuery.data,
    isPending,
    isError,
  };
}
