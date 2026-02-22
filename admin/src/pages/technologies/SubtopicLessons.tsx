import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TechBreadcrumbs } from './TechBreadcrumbs';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import { 
  LessonTableItem, 
  useLessonsQuery, 
  useCreateLessonMutation, 
  useUpdateLessonMutation, 
  useDeleteLessonMutation,
  mapLessonsToTableItems,
  CreateLessonPayload,
  UpdateLessonPayload
} from '@/hooks/queries/useLessonsQueries';
import { useSubTopicsQuery } from '@/hooks/queries/useSubtopicsQueries';

const columns: Column<LessonTableItem>[] = [
  { key: 'title', label: 'Title', render: (item) => <span className="font-medium text-foreground">{item.title}</span> },
  { key: "slug", label: "Slug", render: (item) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.slug}</code> },
  { key: "orderIndex", label: "Order" },
  { key: 'description', label: 'Description', render: (item) => <span className="text-muted-foreground line-clamp-1">{item.description}</span> },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

// Data Mapping Helper: Form Data -> API Payload
const toLessonPayload = (data: Record<string, string>, roadmapId: number, technologyId: number, moduleId: number, topicId: number, subTopicId: number): CreateLessonPayload => {
  const parsedOrder = Number.parseInt(data.order_index ?? "", 10);

  return {
    roadmap_id: roadmapId,
    technology_id: technologyId,
    module_id: moduleId,
    topic_id: topicId,
    sub_topic_id: subTopicId,
    slug: (data.slug ?? "").trim(),
    title: (data.title ?? "").trim(),
    description: data.description?.trim() || null,
    order_index: Number.isFinite(parsedOrder) ? parsedOrder : 0,
  };
};

export default function SubtopicLessons() {
  const { techId, moduleId, topicId, subtopicId } = useParams();
  const { canEdit } = useApp();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<LessonTableItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<LessonTableItem | null>(null);

  // Parse IDs
  const parsedTechId = parseInt(techId as string, 10);
  const parsedModuleId = parseInt(moduleId as string, 10);
  const parsedTopicId = parseInt(topicId as string, 10);
  const parsedSubtopicId = parseInt(subtopicId as string, 10);

  // Queries
  const { data: subtopicsData } = useSubTopicsQuery(parsedTopicId);
  const { data: lessonsData, isLoading, isError } = useLessonsQuery(parsedSubtopicId);

  // Mutations
  const createMutation = useCreateLessonMutation(parsedSubtopicId);
  const updateMutation = useUpdateLessonMutation(parsedSubtopicId);
  const deleteMutation = useDeleteLessonMutation(parsedSubtopicId);

  const subtopic = subtopicsData?.find(s => s.id === parsedSubtopicId);
  const roadmapId = subtopic?.roadmap_id || 1; // Assuming fallback

  const tableData = useMemo(() => {
    if (!lessonsData) return [];
    return mapLessonsToTableItems(lessonsData);
  }, [lessonsData]);

  const formFields: FormField[] = useMemo(() => [
    { name: 'title', label: 'Title', type: 'text', required: true, placeholder: "e.g. Introduction to Scope" },
    { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: "intro-scope" },
    { name: 'order_index', label: 'Order Priority', type: 'number', placeholder: "0" },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: "Brief overview..." },
    { name: "sep_seo", label: "--- SEO Configuration ---", type: "separator", required: false, placeholder: "Visual Separator" },
    { name: "meta_title", label: "SEO Meta Title", type: "text" },
    { name: "meta_description", label: "SEO Meta Description", type: "textarea" },
    { name: "keywords", label: "Keywords (comma separated)", type: "text" },
    { name: "canonical_url", label: "Canonical URL", type: "text" },
    { name: "robots", label: "Robots", type: "text", placeholder: "index, follow" },
    { name: "og_title", label: "OG Title", type: "text" },
    { name: "og_description", label: "OG Description", type: "textarea" },
    { name: "og_image_url", label: "OG Image URL", type: "text" },
    { name: "twitter_card", label: "Twitter Card", type: "select", options: [{ value: "summary", label: "Summary" }, { value: "summary_large_image", label: "Summary Large Image" }] },
  ], []);

  const getInitialData = (item: LessonTableItem) => ({
    title: item.title,
    slug: item.slug || "",
    order_index: String(item.orderIndex),
    description: item.description || "",
  });

  const handleCreateOrUpdate = (data: Record<string, string>) => {
    const payload = toLessonPayload(data, roadmapId, parsedTechId, parsedModuleId, parsedTopicId, parsedSubtopicId);

    if (editItem) {
      updateMutation.mutate({
        lessonId: Number(editItem.id),
        payload: payload as UpdateLessonPayload
      }, {
        onSuccess: () => {
          toast({ title: 'Lesson updated successfully' });
          setFormOpen(false);
          setEditItem(null);
        },
        onError: (error) => {
          toast({ title: 'Failed to update lesson', variant: 'destructive' });
          console.error(error);
        }
      });
    } else {
      createMutation.mutate({ ...payload, is_active: true }, {
        onSuccess: () => {
          toast({ title: 'Lesson created successfully' });
          setFormOpen(false);
        },
        onError: (error) => {
          toast({ title: 'Failed to create lesson', variant: 'destructive' });
          console.error(error);
        }
      });
    }
  };

  const handleToggleStatus = (item: LessonTableItem) => {
    updateMutation.mutate({
      lessonId: Number(item.id),
      payload: { is_active: !item.is_active }
    }, {
      onSuccess: () => toast({ title: `Status updated to ${!item.is_active ? 'Active' : 'Inactive'}` }),
      onError: () => toast({ title: "Failed to update status", variant: "destructive" })
    });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(Number(deleteItem.id), {
      onSuccess: () => {
        toast({ title: 'Lesson deleted' });
        setDeleteItem(null);
      },
      onError: () => toast({ title: "Failed to delete lesson", variant: "destructive" })
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Failed to load lessons.</div>;
  }

  return (
    <div className="space-y-6">
      <TechBreadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{subtopic?.title || "Subtopic"} — Lessons</h1>
          <p className="text-sm text-muted-foreground">Manage lessons for this subtopic</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Lesson
          </button>
        )}
      </div>

      <DataTable 
        data={tableData} 
        columns={columns} 
        searchFields={['title', 'slug', 'description']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={handleToggleStatus}
        canEdit={canEdit} 
      />

      <FormModal 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        title={editItem ? 'Edit Lesson' : 'Add Lesson'} 
        fields={formFields.filter(f => f.name !== 'sep_seo')} 
        initialData={editItem ? getInitialData(editItem) : undefined}
        onSubmit={handleCreateOrUpdate}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal 
        isOpen={!!deleteItem} 
        onClose={() => setDeleteItem(null)} 
        title="Delete Lesson" 
        message={`Are you sure you want to delete ${deleteItem?.title}?`}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
