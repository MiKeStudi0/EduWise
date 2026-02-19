import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TechBreadcrumbs } from './TechBreadcrumbs';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Topic } from '@/types';

const columns: Column<Topic>[] = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

export default function ModuleTopics() {
  const { techId, moduleId } = useParams();
  const { technologies, modules: allModules, topics, canEdit } = useApp();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Topic | null>(null);
  const [deleteItem, setDeleteItem] = useState<Topic | null>(null);

  const mod = allModules.items.find(m => m.id === moduleId);
  const filtered = topics.items.filter(t => t.moduleId === moduleId);

  // Smart form with dependent dropdowns
  const formFields: FormField[] = useMemo(() => [
    {
      name: 'technologyId', label: 'Technology', type: 'select' as const, required: true,
      options: technologies.items.map(t => ({ value: t.id, label: t.name })),
    },
    {
      name: 'moduleId', label: 'Module', type: 'select' as const, required: true,
      dependsOn: 'technologyId',
      getOptions: (fd: Record<string, string>) =>
        allModules.items.filter(m => m.technologyId === fd.technologyId).map(m => ({ value: m.id, label: m.name })),
    },
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
  ], [technologies.items, allModules.items]);

  return (
    <div className="space-y-6">
      <TechBreadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{mod?.name} — Topics</h1>
          <p className="text-sm text-muted-foreground">Click a topic to see subtopics</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Topic
          </button>
        )}
      </div>

      <DataTable data={filtered} columns={columns} searchFields={['name']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { topics.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        onRowClick={item => navigate(`/technologies/${techId}/modules/${moduleId}/topics/${item.id}/subtopics`)}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Topic' : 'Add Topic'} fields={formFields}
        initialData={editItem
          ? { technologyId: techId!, moduleId: moduleId!, name: editItem.name, description: editItem.description }
          : { technologyId: techId!, moduleId: moduleId! }}
        onSubmit={data => {
          if (editItem) { topics.update(editItem.id, { name: data.name, description: data.description, moduleId: data.moduleId }); toast({ title: 'Updated' }); }
          else { topics.add({ name: data.name, description: data.description, moduleId: data.moduleId, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Topic" message={`Delete ${deleteItem?.name}?`}
        onConfirm={() => { if (deleteItem) { topics.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
