import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TechBreadcrumbs } from './TechBreadcrumbs';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  SubTopicTableItem, 
  useSubTopicsQuery, 
  useCreateSubTopicMutation, 
  useUpdateSubTopicMutation, 
  useDeleteSubTopicMutation,
  mapSubTopicsToTableItems
} from '@/hooks/queries/useSubtopicsQueries';
import { useTopicsQuery } from '@/hooks/queries/useTopicsQueries';

const columns: Column<SubTopicTableItem>[] = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

const formFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
];

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
  const { data: topics = [] } = useTopicsQuery(parsedModuleId);
  const { data: subtopics = [], isLoading } = useSubTopicsQuery(parsedTopicId);

  // Mutations
  const createMutation = useCreateSubTopicMutation(parsedTopicId);
  const updateMutation = useUpdateSubTopicMutation(parsedTopicId);
  const deleteMutation = useDeleteSubTopicMutation(parsedTopicId);

  const topic = topics.find((t: any) => String(t.id) === String(parsedTopicId));
  const tableData = mapSubTopicsToTableItems(subtopics);

  return (
    <div className="space-y-6">
      <TechBreadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{topic?.name} — Subtopics</h1>
          <p className="text-sm text-muted-foreground">Click a subtopic to see lessons</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Subtopic
          </button>
        )}
      </div>

      <DataTable data={tableData} columns={columns} searchFields={['name']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => {
          updateMutation.mutate({
            subTopicId: parseInt(item.id, 10),
            payload: { is_active: !item.is_active }
          }, {
            onSuccess: () => toast({ title: 'Status updated' }),
            onError: (err: any) => toast({ title: 'Failed to update status', description: err.message, variant: 'destructive' })
          });
        }}
        onRowClick={item => navigate(`/technologies/${techId}/modules/${moduleId}/topics/${topicId}/subtopics/${item.id}/lessons`)}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Subtopic' : 'Add Subtopic'} fields={formFields}
        initialData={editItem ? { name: editItem.name, description: editItem.description } : undefined}
        onSubmit={data => {
          if (editItem) {
            updateMutation.mutate({
              subTopicId: parseInt(editItem.id, 10),
              payload: { title: data.name, description: data.description }
            }, {
              onSuccess: () => { toast({ title: 'Updated' }); setFormOpen(false); },
              onError: (err: any) => toast({ title: 'Update failed', description: err.message, variant: 'destructive' })
            });
          } else {
            createMutation.mutate({
              roadmap_id: 1, // Fixed for now based on current app assumptions
              technology_id: parsedTechId,
              module_id: parsedModuleId,
              topic_id: parsedTopicId,
              title: data.name,
              description: data.description,
              is_active: true,
            }, {
              onSuccess: () => { toast({ title: 'Created' }); setFormOpen(false); },
              onError: (err: any) => toast({ title: 'Creation failed', description: err.message, variant: 'destructive' })
            });
          }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Subtopic" message={`Delete ${deleteItem?.name}?`}
        onConfirm={() => {
          if (deleteItem) {
            deleteMutation.mutate(parseInt(deleteItem.id, 10), {
              onSuccess: () => { toast({ title: 'Deleted' }); setDeleteItem(null); },
              onError: (err: any) => toast({ title: 'Deletion failed', description: err.message, variant: 'destructive' })
            });
          }
        }} />
    </div>
  );
}
