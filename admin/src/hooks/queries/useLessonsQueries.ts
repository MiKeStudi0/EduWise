import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/service/api";

const LESSONS_ENDPOINT = "/lessons";

export type LessonStatus = "active" | "inactive";

// --- API Response Interface ---
export interface LessonResponse {
  id: number;
  roadmap_id: number;
  technology_id: number;
  module_id: number;
  topic_id: number;
  sub_topic_id: number;
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
export interface CreateLessonPayload {
  roadmap_id: number;
  technology_id: number;
  module_id: number;
  topic_id: number;
  sub_topic_id: number;
  slug: string;
  title: string;
  description?: string | null;
  examples?: any | null;
  is_active?: boolean;
  order_index?: number;
}

export type UpdateLessonPayload = Partial<CreateLessonPayload>;

export interface UpdateLessonParams {
  lessonId: number;
  payload: UpdateLessonPayload;
}

// --- UI Representation (Table Item) ---
export interface LessonTableItem {
  id: string;
  subtopicId: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  status: LessonStatus;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---
export const lessonQueryKeys = {
  all: ["lessons"] as const,
  bySubtopic: (subTopicId: number) => ["lessons", "subtopic", subTopicId] as const,
  byId: (id: number) => ["lessons", id] as const,
};

const parseDateLabel = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

// --- Mapping Function ---
const lessonToTableItem = (lesson: LessonResponse): LessonTableItem => ({
  id: String(lesson.id),
  subtopicId: String(lesson.sub_topic_id),
  slug: lesson.slug,
  title: lesson.title,
  description: lesson.description ?? "",
  orderIndex: lesson.order_index,
  status: (lesson.is_active ? "active" : "inactive") as LessonStatus,
  is_active: lesson.is_active,
  createdAt: parseDateLabel(lesson.created_at),
  updatedAt: parseDateLabel(lesson.updated_at),
});

export const mapLessonsToTableItems = (lessons: LessonResponse[]) => lessons.map(lessonToTableItem);

// --- API Client Functions ---
const fetchLessonsBySubTopic = async (subTopicId: number) =>
  (await apiClient.get(`${LESSONS_ENDPOINT}/sub-topic/${subTopicId}`)) as LessonResponse[];

const createLesson = async (payload: CreateLessonPayload) =>
  (await apiClient.post(`${LESSONS_ENDPOINT}/`, payload)) as LessonResponse;

const updateLesson = async ({ lessonId, payload }: UpdateLessonParams) =>
  (await apiClient.put(`${LESSONS_ENDPOINT}/${lessonId}`, payload)) as LessonResponse;

const deleteLesson = async (lessonId: number) =>
  (await apiClient.delete(`${LESSONS_ENDPOINT}/${lessonId}`)) as { message: string };

// --- React Query Hooks ---
export function useLessonsQuery(subTopicId: number | undefined) {
  return useQuery({
    queryKey: lessonQueryKeys.bySubtopic(subTopicId as number),
    queryFn: () => fetchLessonsBySubTopic(subTopicId as number),
    enabled: !!subTopicId,
  });
}

export function useCreateLessonMutation(subTopicId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.all });
      if (subTopicId) {
        queryClient.invalidateQueries({ queryKey: lessonQueryKeys.bySubtopic(subTopicId) });
      }
    },
  });
}

export function useUpdateLessonMutation(subTopicId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.all });
      if (subTopicId) {
        queryClient.invalidateQueries({ queryKey: lessonQueryKeys.bySubtopic(subTopicId) });
      }
    },
  });
}

export function useDeleteLessonMutation(subTopicId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.all });
      if (subTopicId) {
        queryClient.invalidateQueries({ queryKey: lessonQueryKeys.bySubtopic(subTopicId) });
      }
    },
  });
}
