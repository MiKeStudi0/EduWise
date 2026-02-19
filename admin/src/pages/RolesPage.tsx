import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Role } from '@/types';

const columns: Column<Role>[] = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'userCount', label: 'Users', render: item => <span>{item.userCount}</span> },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

const formFields: FormField[] = [
  { name: 'name', label: 'Role Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
];

export default function RolesPage() {
  const { roles, canEdit } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Role | null>(null);
  const [deleteItem, setDeleteItem] = useState<Role | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles</h1>
          <p className="text-sm text-muted-foreground">Manage user roles</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Role
          </button>
        )}
      </div>

      <DataTable data={roles.items} columns={columns} searchFields={['name']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { roles.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Role' : 'Add Role'} fields={formFields}
        initialData={editItem ? { name: editItem.name, description: editItem.description } : undefined}
        onSubmit={data => {
          if (editItem) { roles.update(editItem.id, data); toast({ title: 'Updated' }); }
          else { roles.add({ ...data, userCount: 0, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Role" message={`Delete role ${deleteItem?.name}?`}
        onConfirm={() => { if (deleteItem) { roles.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
