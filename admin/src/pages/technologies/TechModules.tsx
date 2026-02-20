import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TechBreadcrumbs } from './TechBreadcrumbs';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// --- API Hooks & Types ---
import { useTechnologiesQuery } from '@/hooks/queries/useTechnologiesQueries';
import {
  useModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  mapModulesToTableItems,
  ModuleTableItem,
  CreateModulePayload,
  UpdateModulePayload
} from '@/hooks/queries/useModulesQueries';

const columns: Column<ModuleTableItem>[] = [
  { key: 'name', label: 'Name', render: (item) => <span className="font-medium text-foreground">{item.name}</span> },
  { key: "slug", label: "Slug", render: (item) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.slug}</code> },
  { key: "orderIndex", label: "Order" },
  { key: 'description', label: 'Description', render: (item) => <span className="text-muted-foreground line-clamp-1">{item.description}</span> },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

// Data Mapping Helper: Form Data -> API Payload
const toModulePayload = (data: Record<string, string>, roadmapId: number, technologyId: number): CreateModulePayload => {
  const parsedOrder = Number.parseInt(data.order_index ?? "", 10);
  const keywordsList = data.keywords ? data.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : [];

  return {
    roadmap_id: roadmapId,
    technology_id: technologyId,
    slug: (data.slug ?? "").trim(),
    title: (data.name ?? "").trim(),
    description: data.description?.trim() || null,
    order_index: Number.isFinite(parsedOrder) ? parsedOrder : 0,
    seo: {
      meta_title: data.meta_title?.trim() || null,
      meta_description: data.meta_description?.trim() || null,
      keywords: keywordsList.length > 0 ? keywordsList : null,
      canonical_url: data.canonical_url?.trim() || null,
      robots: data.robots?.trim() || null,
      og_title: data.og_title?.trim() || null,
      og_description: data.og_description?.trim() || null,
      og_image_url: data.og_image_url?.trim() || null,
      twitter_card: data.twitter_card?.trim() || null,
    }
  };
};

export default function TechModules() {
  const { techId } = useParams();
  const numericTechId = Number(techId);
  const { canEdit } = useApp();
  const navigate = useNavigate();

  // --- React Query Hooks ---
  const { data: technologiesData } = useTechnologiesQuery();
  const { data: modulesData, isLoading, isError } = useModulesQuery(numericTechId);

  const createMutation = useCreateModuleMutation(numericTechId);
  const updateMutation = useUpdateModuleMutation(numericTechId);
  const deleteMutation = useDeleteModuleMutation(numericTechId);

  // --- Local State ---
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<ModuleTableItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ModuleTableItem | null>(null);

  const tech = technologiesData?.find(t => t.id === numericTechId);
  const roadmapId = tech?.roadmap_id || 1; // Assuming a fallback, or better retrieve from context

  const tableData = useMemo(() => {
    if (!modulesData) return [];
    return mapModulesToTableItems(modulesData);
  }, [modulesData]);

  const formFields: FormField[] = useMemo(() => [
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: "e.g. HTML Basics" },
    { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: "html-basics" },
    { name: 'order_index', label: 'Order Priority', type: 'number', placeholder: "0" },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: "Brief overview..." },
    { name: "sep_seo", label: "--- SEO Configuration ---", type: "separator", required: false, placeholder: "Visual Separator" },
    { name: "meta_title", label: "SEO Meta Title", type: "text" },
    { name: "meta_description", label: "SEO Meta Description", type: "textarea" },
    { name: "keywords", label: "Keywords (comma separated)", type: "text" },
    { name: "canonical_url", label: "Canonical URL", type: "text" },
    { name: "robots", label: "Robots", type: "text", placeholder: "index, follow" },
    { name: "og_title", label: "OG Title", type: "text" },
    { name: "og_description", label: "OG Description", type: "textarea" },
    { name: "og_image_url", label: "OG Image URL", type: "text" },
    { name: "twitter_card", label: "Twitter Card", type: "select", options: [{ value: "summary", label: "Summary" }, { value: "summary_large_image", label: "Summary Large Image" }] },
  ], []);

  const getInitialData = (item: ModuleTableItem) => ({
    name: item.name,
    slug: item.slug,
    order_index: String(item.orderIndex),
    description: item.description || "",
    meta_title: item.seo?.meta_title || "",
    meta_description: item.seo?.meta_description || "",
    keywords: item.seo?.keywords ? item.seo.keywords.join(", ") : "",
    canonical_url: item.seo?.canonical_url || "",
    robots: item.seo?.robots || "index, follow",
    og_title: item.seo?.og_title || "",
    og_description: item.seo?.og_description || "",
    og_image_url: item.seo?.og_image_url || "",
    twitter_card: item.seo?.twitter_card || "summary_large_image",
  });

  const handleCreateOrUpdate = (data: Record<string, string>) => {
    const payload = toModulePayload(data, roadmapId, numericTechId);

    if (editItem) {
      updateMutation.mutate({
        moduleId: Number(editItem.id),
        payload: payload as UpdateModulePayload
      }, {
        onSuccess: () => {
          toast({ title: 'Module updated successfully' });
          setFormOpen(false);
          setEditItem(null);
        },
        onError: (error) => {
          toast({ title: 'Failed to update module', variant: 'destructive' });
          console.error(error);
        }
      });
    } else {
      createMutation.mutate({ ...payload, is_active: true }, {
        onSuccess: () => {
          toast({ title: 'Module created successfully' });
          setFormOpen(false);
        },
        onError: (error) => {
          toast({ title: 'Failed to create module', variant: 'destructive' });
          console.error(error);
        }
      });
    }
  };

  const handleToggleStatus = (item: ModuleTableItem) => {
    updateMutation.mutate({
      moduleId: Number(item.id),
      payload: { is_active: !item.is_active }
    }, {
      onSuccess: () => toast({ title: `Status updated to ${!item.is_active ? 'Active' : 'Inactive'}` }),
      onError: () => toast({ title: "Failed to update status", variant: "destructive" })
    });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(Number(deleteItem.id), {
      onSuccess: () => {
        toast({ title: 'Module deleted' });
        setDeleteItem(null);
      },
      onError: () => toast({ title: "Failed to delete module", variant: "destructive" })
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Failed to load modules.</div>;
  }

  return (
    <div className="space-y-6">
      <TechBreadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tech?.title || "Technology"} — Modules</h1>
          <p className="text-sm text-muted-foreground">Click a module to see its topics</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Module
          </button>
        )}
      </div>

      <DataTable 
        data={tableData} 
        columns={columns} 
        searchFields={['name', 'slug', 'description']}
        onEdit={item => { setEditItem(item); setFormOpen(true); }}
        onDelete={item => setDeleteItem(item)}
        onToggleStatus={handleToggleStatus}
        onRowClick={item => navigate(`/technologies/${techId}/modules/${item.id}/topics`)}
        canEdit={canEdit} 
      />

      <FormModal 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
        title={editItem ? 'Edit Module' : 'Add Module'} 
        fields={formFields.filter(f => f.name !== 'sep_seo')} // Filter out the visual separator from logic
        initialData={editItem ? getInitialData(editItem) : undefined}
        onSubmit={handleCreateOrUpdate}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal 
        isOpen={!!deleteItem} 
        onClose={() => setDeleteItem(null)} 
        title="Delete Module" 
        message={`Are you sure you want to delete ${deleteItem?.name}?`}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
