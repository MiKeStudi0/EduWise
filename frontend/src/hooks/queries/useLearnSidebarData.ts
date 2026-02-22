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
        imageUrl: topic.image_banner_url || (topic.images?.length > 0 ? topic.images[0] : ""),
        problem: topic.problems?.map((p: any) => p.problem) || [],
        mentalModel: topic.mental_models?.map((m: any) => m.model) || [],
        whenToUse: topic.when_to_use?.map((w: any) => w.point) || [],
        whenNotToUse: topic.when_to_avoid?.map((w: any) => w.point) || [],
        syntax: "", // Optionally fallback
        code: topic.examples?.[0]?.code_snippet || "",
        subtopics: (topic.sub_topics || []).map((sub: any) => ({
          id: sub.slug,
          title: sub.title,
          content: sub.description || "",
          videoUrl: sub.video_url || "",
          imageUrl: sub.image_banner_url || (sub.images?.length > 0 ? sub.images[0] : ""),
          example: sub.examples?.[0]?.code_snippet || "",
          tip: sub.bonus_tips?.map((b: any) => b.tip) || [],
          problems: sub.problems?.map((p: any) => p.problem) || [],
          mentalModel: sub.mental_models?.map((m: any) => m.model) || [],
          whenToUse: sub.when_to_use?.map((w: any) => w.point) || [],
          whenNotToUse: sub.when_to_avoid?.map((w: any) => w.point) || [],
          commonMistakes: sub.common_mistakes?.map((c: any) => c.mistake) || [],
        })),
        commonMistakes: topic.common_mistakes?.map((c: any) => c.mistake) || [],
        bonusTip: topic.bonus_tips?.map((b: any) => b.tip) || []
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
