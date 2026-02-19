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
import { Module } from '@/types';

const columns: Column<Module>[] = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

const formFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
];

export default function TechModules() {
  const { techId } = useParams();
  const { technologies, modules, canEdit } = useApp();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Module | null>(null);
  const [deleteItem, setDeleteItem] = useState<Module | null>(null);

  const tech = technologies.items.find(t => t.id === techId);
  const filtered = modules.items.filter(m => m.technologyId === techId);

  return (
    <div className="space-y-6">
      <TechBreadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tech?.name} — Modules</h1>
          <p className="text-sm text-muted-foreground">Click a module to see its topics</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Module
          </button>
        )}
      </div>

      <DataTable data={filtered} columns={columns} searchFields={['name']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { modules.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        onRowClick={item => navigate(`/technologies/${techId}/modules/${item.id}/topics`)}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Module' : 'Add Module'} fields={formFields}
        initialData={editItem ? { name: editItem.name, description: editItem.description } : undefined}
        onSubmit={data => {
          if (editItem) { modules.update(editItem.id, data); toast({ title: 'Updated' }); }
          else { modules.add({ ...data, technologyId: techId!, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Module" message={`Delete ${deleteItem?.name}?`}
        onConfirm={() => { if (deleteItem) { modules.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
