import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

const columns: Column<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
  { key: 'createdAt', label: 'Created' },
];

const formFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'role', label: 'Role', type: 'select', required: true, options: [
    { value: 'Admin', label: 'Admin' },
    { value: 'Content Manager', label: 'Content Manager' },
    { value: 'Viewer', label: 'Viewer' },
  ]},
];

export default function UsersPage() {
  const { users, canEdit } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [deleteItem, setDeleteItem] = useState<User | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Manage platform users</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add User
          </button>
        )}
      </div>

      <DataTable
        data={users.items}
        columns={columns}
        searchFields={['name', 'email']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { users.toggleStatus(item.id); toast({ title: `${item.name} is now ${item.status === 'active' ? 'inactive' : 'active'}` }); }}
        canEdit={canEdit}
      />

      <FormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editItem ? 'Edit User' : 'Add User'}
        fields={formFields}
        initialData={editItem ? { name: editItem.name, email: editItem.email, role: editItem.role } : undefined}
        onSubmit={data => {
          if (editItem) { users.update(editItem.id, data); toast({ title: 'User updated' }); }
          else { users.add({ ...data, status: 'active', createdAt: new Date().toISOString().split('T')[0] } as any); toast({ title: 'User created' }); }
        }}
      />

      <ConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteItem?.name}?`}
        onConfirm={() => { if (deleteItem) { users.remove(deleteItem.id); toast({ title: 'User deleted' }); setDeleteItem(null); } }}
      />
    </div>
  );
}
