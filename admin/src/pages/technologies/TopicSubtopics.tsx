import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TechBreadcrumbs } from './TechBreadcrumbs';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import { 
  SubTopicTableItem, 
  useSubTopicsQuery, 
  useCreateSubTopicMutation, 
  useUpdateSubTopicMutation, 
  useDeleteSubTopicMutation,
  mapSubTopicsToTableItems,
  CreateSubTopicPayload,
  UpdateSubTopicPayload
} from '@/hooks/queries/useSubtopicsQueries';
import { useTopicsQuery } from '@/hooks/queries/useTopicsQueries';

const columns: Column<SubTopicTableItem>[] = [
  { key: 'name', label: 'Name', render: (item) => <span className="font-medium text-foreground">{item.name}</span> },
  { key: "slug", label: "Slug", render: (item) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.slug}</code> },
  { key: "orderIndex", label: "Order" },
  { key: 'description', label: 'Description', render: (item) => <span className="text-muted-foreground line-clamp-1">{item.description}</span> },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

// Data Mapping Helper: Form Data -> API Payload
const toSubTopicPayload = (data: Record<string, string>, roadmapId: number, technologyId: number, moduleId: number, topicId: number): CreateSubTopicPayload => {
  const parsedOrder = Number.parseInt(data.order_index ?? "", 10);

  return {
    roadmap_id: roadmapId,
    technology_id: technologyId,
    module_id: moduleId,
    topic_id: topicId,
    slug: (data.slug ?? "").trim(),
    title: (data.name ?? "").trim(),
    description: data.description?.trim() || null,
    order_index: Number.isFinite(parsedOrder) ? parsedOrder : 0,
  };
};

export default function TopicSubtopics() {
  const { techId, moduleId, topicId } = useParams();
  const { canEdit } = useApp();
  const navigate = useNavigate();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<SubTopicTableItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SubTopicTableItem | null>(null);

  // Parse IDs
  const parsedTechId = parseInt(techId as string, 10);
  const parsedModuleId = parseInt(moduleId as string, 10);
  const parsedTopicId = parseInt(topicId as string, 10);

  // Queries
  const { data: topicsData } = useTopicsQuery(parsedModuleId);
  const { data: subtopicsData, isLoading, isError } = useSubTopicsQuery(parsedTopicId);

  // Mutations
  const createMutation = useCreateSubTopicMutation(parsedTopicId);
  const updateMutation = useUpdateSubTopicMutation(parsedTopicId);
  const deleteMutation = useDeleteSubTopicMutation(parsedTopicId);

  const topic = topicsData?.find(t => t.id === parsedTopicId);
  const roadmapId = topic?.roadmap_id || 1; // Assuming fallback

  const tableData = useMemo(() => {
    if (!subtopicsData) return [];
    return mapSubTopicsToTableItems(subtopicsData);
  }, [subtopicsData]);

  const formFields: FormField[] = useMemo(() => [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: "e.g. Event Bubbling" },
    { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: "event-bubbling" },
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

  const getInitialData = (item: SubTopicTableItem) => ({
    name: item.name,
    slug: item.slug || "",
    order_index: String(item.orderIndex),
    description: item.description || "",
  });

  const handleCreateOrUpdate = (data: Record<string, string>) => {
    const payload = toSubTopicPayload(data, roadmapId, parsedTechId, parsedModuleId, parsedTopicId);

    if (editItem) {
      updateMutation.mutate({
        subTopicId: Number(editItem.id),
        payload: payload as UpdateSubTopicPayload
      }, {
        onSuccess: () => {
          toast({ title: 'Subtopic updated successfully' });
          setFormOpen(false);
          setEditItem(null);
        },
        onError: (error) => {
          toast({ title: 'Failed to update subtopic', variant: 'destructive' });
          console.error(error);
        }
      });
    } else {
      createMutation.mutate({ ...payload, is_active: true }, {
        onSuccess: () => {
          toast({ title: 'Subtopic created successfully' });
          setFormOpen(false);
        },
        onError: (error) => {
          toast({ title: 'Failed to create subtopic', variant: 'destructive' });
          console.error(error);
        }
      });
    }
  };

  const handleToggleStatus = (item: SubTopicTableItem) => {
    updateMutation.mutate({
      subTopicId: Number(item.id),
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
        toast({ title: 'Subtopic deleted' });
        setDeleteItem(null);
      },
      onError: () => toast({ title: "Failed to delete subtopic", variant: "destructive" })
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Failed to load subtopics.</div>;
  }

  return (
    <div className="space-y-6">
      <TechBreadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{topic?.title || "Topic"} — Subtopics</h1>
          <p className="text-sm text-muted-foreground">Click a subtopic to see lessons</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Subtopic
          </button>
        )}
      </div>

      <DataTable 
        data={tableData} 
        columns={columns} 
        searchFields={['name', 'slug', 'description']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={handleToggleStatus}
        onRowClick={item => navigate(`/technologies/${techId}/modules/${moduleId}/topics/${topicId}/subtopics/${item.id}/lessons`)}
        canEdit={canEdit} 
      />

      <FormModal 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        title={editItem ? 'Edit Subtopic' : 'Add Subtopic'} 
        fields={formFields.filter(f => f.name !== 'sep_seo')} 
        initialData={editItem ? getInitialData(editItem) : undefined}
        onSubmit={handleCreateOrUpdate}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal 
        isOpen={!!deleteItem} 
        onClose={() => setDeleteItem(null)} 
        title="Delete Subtopic" 
        message={`Are you sure you want to delete ${deleteItem?.name}?`}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
