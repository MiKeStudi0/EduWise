import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Subscription } from '@/types';

const columns: Column<Subscription>[] = [
  { key: 'userName', label: 'User' },
  { key: 'plan', label: 'Plan' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
  { key: 'startDate', label: 'Start' },
  { key: 'endDate', label: 'End' },
];

const formFields: FormField[] = [
  { name: 'userName', label: 'User Name', type: 'text', required: true },
  { name: 'plan', label: 'Plan', type: 'select', required: true, options: [
    { value: 'Basic', label: 'Basic' }, { value: 'Pro', label: 'Pro' }, { value: 'Enterprise', label: 'Enterprise' },
  ]},
  { name: 'amount', label: 'Amount', type: 'text', required: true },
  { name: 'startDate', label: 'Start Date', type: 'text', required: true },
  { name: 'endDate', label: 'End Date', type: 'text', required: true },
];

export default function SubscriptionsPage() {
  const { subscriptions, canEdit } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Subscription | null>(null);
  const [deleteItem, setDeleteItem] = useState<Subscription | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-sm text-muted-foreground">Manage user subscriptions</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Subscription
          </button>
        )}
      </div>

      <DataTable data={subscriptions.items} columns={columns} searchFields={['userName', 'plan']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { subscriptions.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit Subscription' : 'Add Subscription'} fields={formFields}
        initialData={editItem ? { userName: editItem.userName, plan: editItem.plan, amount: editItem.amount, startDate: editItem.startDate, endDate: editItem.endDate } : undefined}
        onSubmit={data => {
          if (editItem) { subscriptions.update(editItem.id, data); toast({ title: 'Updated' }); }
          else { subscriptions.add({ ...data, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete Subscription" message={`Delete subscription for ${deleteItem?.userName}?`}
        onConfirm={() => { if (deleteItem) { subscriptions.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
