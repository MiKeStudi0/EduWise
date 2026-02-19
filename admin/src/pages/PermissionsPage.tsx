import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Permission } from '@/types';

const columns: Column<Permission>[] = [
  { key: 'name', label: 'Permission' },
  { key: 'module', label: 'Module' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

const formFields: FormField[] = [
  { name: 'name', label: 'Permission Name', type: 'text', required: true },
  { name: 'module', label: 'Module', type: 'select', required: true, options: [
    { value: 'Users', label: 'Users' }, { value: 'Content', label: 'Content' }, { value: 'Settings', label: 'Settings' },
  ]},
  { name: 'description', label: 'Description', type: 'textarea' },
];

export default function PermissionsPage() {
  const { permissions, canEdit } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Permission | null>(null);
  const [deleteItem, setDeleteItem] = useState<Permission | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Permissions</h1>
          <p className="text-sm text-muted-foreground">Manage system permissions</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Permission
          </button>
        )}
      </div>

      <DataTable data={permissions.items} columns={columns} searchFields={['name', 'module']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { permissions.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Permission' : 'Add Permission'} fields={formFields}
        initialData={editItem ? { name: editItem.name, module: editItem.module, description: editItem.description } : undefined}
        onSubmit={data => {
          if (editItem) { permissions.update(editItem.id, data); toast({ title: 'Updated' }); }
          else { permissions.add({ ...data, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Permission" message={`Delete ${deleteItem?.name}?`}
        onConfirm={() => { if (deleteItem) { permissions.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
