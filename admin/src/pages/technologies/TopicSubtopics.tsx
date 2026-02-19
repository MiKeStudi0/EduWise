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
import { Subtopic } from '@/types';

const columns: Column<Subtopic>[] = [
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
  const { topics: allTopics, subtopics, canEdit } = useApp();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Subtopic | null>(null);
  const [deleteItem, setDeleteItem] = useState<Subtopic | null>(null);

  const topic = allTopics.items.find(t => t.id === topicId);
  const filtered = subtopics.items.filter(s => s.topicId === topicId);

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

      <DataTable data={filtered} columns={columns} searchFields={['name']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { subtopics.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        onRowClick={item => navigate(`/technologies/${techId}/modules/${moduleId}/topics/${topicId}/subtopics/${item.id}/lessons`)}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Subtopic' : 'Add Subtopic'} fields={formFields}
        initialData={editItem ? { name: editItem.name, description: editItem.description } : undefined}
        onSubmit={data => {
          if (editItem) { subtopics.update(editItem.id, data); toast({ title: 'Updated' }); }
          else { subtopics.add({ ...data, topicId: topicId!, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Subtopic" message={`Delete ${deleteItem?.name}?`}
        onConfirm={() => { if (deleteItem) { subtopics.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
