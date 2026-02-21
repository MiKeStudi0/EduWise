import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/service/api";

const SUBTOPICS_ENDPOINT = "/sub-topics";

export type SubtopicStatus = "active" | "inactive";

// --- API Response Interface ---
export interface SubTopicResponse {
  id: number;
  roadmap_id: number;
  technology_id: number;
  module_id: number;
  topic_id: number;
  title: string;
  description: string | null;
  examples: any | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// --- API Payloads ---
export interface CreateSubTopicPayload {
  roadmap_id: number;
  technology_id: number;
  module_id: number;
  topic_id: number;
  title: string;
  description?: string | null;
  examples?: any | null;
  is_active?: boolean;
  order_index?: number;
}

export type UpdateSubTopicPayload = Partial<CreateSubTopicPayload>;

export interface UpdateSubTopicParams {
  subTopicId: number;
  payload: UpdateSubTopicPayload;
}

// --- UI Representation (Table Item) ---
export interface SubTopicTableItem {
  id: string;
  topicId: string;
  name: string; // Mapped from 'title'
  description: string;
  orderIndex: number;
  status: SubtopicStatus;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---
export const subtopicQueryKeys = {
  all: ["subtopics"] as const,
  byTopic: (topicId: number) => ["subtopics", "topic", topicId] as const,
  byId: (id: number) => ["subtopics", id] as const,
};

const parseDateLabel = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

// --- Mapping Function ---
const subtopicToTableItem = (sub: SubTopicResponse): SubTopicTableItem => ({
  id: String(sub.id),
  topicId: String(sub.topic_id),
  name: sub.title,
  description: sub.description ?? "",
  orderIndex: sub.order_index,
  status: (sub.is_active ? "active" : "inactive") as SubtopicStatus,
  is_active: sub.is_active,
  createdAt: parseDateLabel(sub.created_at),
  updatedAt: parseDateLabel(sub.updated_at),
});

export const mapSubTopicsToTableItems = (subtopics: SubTopicResponse[]) => subtopics.map(subtopicToTableItem);

// --- API Client Functions ---
const fetchSubTopicsByTopic = async (topicId: number) =>
  (await apiClient.get(`${SUBTOPICS_ENDPOINT}/topic/${topicId}`)) as SubTopicResponse[];

const createSubTopic = async (payload: CreateSubTopicPayload) =>
  (await apiClient.post(`${SUBTOPICS_ENDPOINT}/`, payload)) as SubTopicResponse;

const updateSubTopic = async ({ subTopicId, payload }: UpdateSubTopicParams) =>
  (await apiClient.put(`${SUBTOPICS_ENDPOINT}/${subTopicId}`, payload)) as SubTopicResponse;

const deleteSubTopic = async (subTopicId: number) =>
  (await apiClient.delete(`${SUBTOPICS_ENDPOINT}/${subTopicId}`)) as { message: string };

// --- React Query Hooks ---
export function useSubTopicsQuery(topicId: number | undefined) {
  return useQuery({
    queryKey: subtopicQueryKeys.byTopic(topicId as number),
    queryFn: () => fetchSubTopicsByTopic(topicId as number),
    enabled: !!topicId,
  });
}

export function useCreateSubTopicMutation(topicId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subtopicQueryKeys.all });
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: subtopicQueryKeys.byTopic(topicId) });
      }
    },
  });
}

export function useUpdateSubTopicMutation(topicId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subtopicQueryKeys.all });
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: subtopicQueryKeys.byTopic(topicId) });
      }
    },
  });
}

export function useDeleteSubTopicMutation(topicId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subtopicQueryKeys.all });
      if (topicId) {
        queryClient.invalidateQueries({ queryKey: subtopicQueryKeys.byTopic(topicId) });
      }
    },
  });
}
