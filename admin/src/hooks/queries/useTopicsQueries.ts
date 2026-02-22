import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/service/api";

const TOPICS_ENDPOINT = "/topics";

export type TopicStatus = "active" | "inactive";

// --- API Response Interface ---
export interface TopicResponse {
  id: number;
  roadmap_id: number;
  technology_id: number;
  module_id: number;
  slug: string;
  title: string;
  description: string | null;
  examples: any | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// --- API Payloads ---
export interface CreateTopicPayload {
  roadmap_id: number;
  technology_id: number;
  module_id: number;
  slug: string;
  title: string;
  description?: string | null;
  examples?: any | null;
  is_active?: boolean;
  order_index?: number;
}

export type UpdateTopicPayload = Partial<CreateTopicPayload>;

export interface UpdateTopicParams {
  topicId: number;
  payload: UpdateTopicPayload;
}

// --- UI Representation (Table Item) ---
export interface TopicTableItem {
  id: string;
  moduleId: string;
  slug: string;
  name: string; // Mapped from 'title'
  description: string;
  orderIndex: number;
  status: TopicStatus;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---
export const topicQueryKeys = {
  all: ["topics"] as const,
  byModule: (moduleId: number) => ["topics", "module", moduleId] as const,
  byId: (id: number) => ["topics", id] as const,
};

const parseDateLabel = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

// --- Mapping Function ---
const topicToTableItem = (topic: TopicResponse): TopicTableItem => ({
  id: String(topic.id),
  moduleId: String(topic.module_id),
  slug: topic.slug,
  name: topic.title,
  description: topic.description ?? "",
  orderIndex: topic.order_index,
  status: (topic.is_active ? "active" : "inactive") as TopicStatus,
  is_active: topic.is_active,
  createdAt: parseDateLabel(topic.created_at),
  updatedAt: parseDateLabel(topic.updated_at),
});

export const mapTopicsToTableItems = (topics: TopicResponse[]) => topics.map(topicToTableItem);

// --- API Client Functions ---
const fetchTopicsByModule = async (moduleId: number) =>
  (await apiClient.get(`${TOPICS_ENDPOINT}/module/${moduleId}`)) as TopicResponse[];

const createTopic = async (payload: CreateTopicPayload) =>
  (await apiClient.post(`${TOPICS_ENDPOINT}/`, payload)) as TopicResponse;

const updateTopic = async ({ topicId, payload }: UpdateTopicParams) =>
  (await apiClient.put(`${TOPICS_ENDPOINT}/${topicId}`, payload)) as TopicResponse;

const deleteTopic = async (topicId: number) =>
  (await apiClient.delete(`${TOPICS_ENDPOINT}/${topicId}`)) as { message: string };

// --- React Query Hooks ---
export function useTopicsQuery(moduleId: number | undefined) {
  return useQuery({
    queryKey: topicQueryKeys.byModule(moduleId as number),
    queryFn: () => fetchTopicsByModule(moduleId as number),
    enabled: !!moduleId,
  });
}

export function useCreateTopicMutation(moduleId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicQueryKeys.all });
      if (moduleId) {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.byModule(moduleId) });
      }
    },
  });
}

export function useUpdateTopicMutation(moduleId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicQueryKeys.all });
      if (moduleId) {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.byModule(moduleId) });
      }
    },
  });
}

export function useDeleteTopicMutation(moduleId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicQueryKeys.all });
      if (moduleId) {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.byModule(moduleId) });
      }
    },
  });
}
