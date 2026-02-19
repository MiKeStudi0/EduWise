import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SEOEntry } from '@/types';

const columns: Column<SEOEntry>[] = [
  { key: 'page', label: 'Page' },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

const formFields: FormField[] = [
  { name: 'page', label: 'Page Path', type: 'text', required: true },
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'keywords', label: 'Keywords', type: 'text' },
];

export default function SEOMetadataPage() {
  const { seoEntries, canEdit } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<SEOEntry | null>(null);
  const [deleteItem, setDeleteItem] = useState<SEOEntry | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SEO Metadata</h1>
          <p className="text-sm text-muted-foreground">Manage page SEO settings</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Entry
          </button>
        )}
      </div>

      <DataTable data={seoEntries.items} columns={columns} searchFields={['page', 'title']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={item => { seoEntries.toggleStatus(item.id); toast({ title: 'Status updated' }); }}
        canEdit={canEdit} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editItem ? 'Edit SEO Entry' : 'Add SEO Entry'} fields={formFields}
        initialData={editItem ? { page: editItem.page, title: editItem.title, description: editItem.description, keywords: editItem.keywords } : undefined}
        onSubmit={data => {
          if (editItem) { seoEntries.update(editItem.id, data); toast({ title: 'Updated' }); }
          else { seoEntries.add({ ...data, status: 'active' } as any); toast({ title: 'Created' }); }
        }} />

      <ConfirmModal isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} title="Delete SEO Entry" message={`Delete SEO for ${deleteItem?.page}?`}
        onConfirm={() => { if (deleteItem) { seoEntries.remove(deleteItem.id); toast({ title: 'Deleted' }); setDeleteItem(null); } }} />
    </div>
  );
}
