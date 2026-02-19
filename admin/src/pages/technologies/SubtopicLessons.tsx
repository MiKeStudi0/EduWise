import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TechBreadcrumbs } from './TechBreadcrumbs';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Lesson } from '@/types';

const columns: Column<Lesson>[] = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
  { key: 'duration', label: 'Duration' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

const formFields: FormField[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'content', label: 'Content', type: 'textarea', required: true },
  { name: 'duration', label: 'Duration', type: 'text' },
];

export default function SubtopicLessons() {
  const { subtopicId } = useParams();
  const { subtopics: allSubtopics, lessons, canEdit } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Lesson | null>(null);
  const [deleteItem, setDeleteItem] = useState<Lesson | null>(null);

  const subtopic = allSubtopics.items.find(s => s.id === subtopicId);
  const filtered = lessons.items.filter(l => l.subtopicId === subtopicId);

  return (
    <div className="space-y-6">
      <TechBreadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{subtopic?.name} — Lessons</h1>
          <p className="text-sm text-muted-foreground">Manage lessons for this subtopic</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Lesson
          </button>
        )}
      </div>

      <DataTable data={filtered} columns={columns} searchFields={['title', 'content']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { lessons.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Lesson' : 'Add Lesson'} fields={formFields}
        initialData={editItem ? { title: editItem.title, content: editItem.content, duration: editItem.duration } : undefined}
        onSubmit={data => {
          if (editItem) { lessons.update(editItem.id, data); toast({ title: 'Updated' }); }
          else { lessons.add({ ...data, subtopicId: subtopicId!, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Lesson" message={`Delete ${deleteItem?.title}?`}
        onConfirm={() => { if (deleteItem) { lessons.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
