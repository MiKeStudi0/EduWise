import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext'; // Retaining for roadmaps/permissions
import { DataTable, Column } from '@/components/shared/DataTable';
import { FormModal, FormField } from '@/components/shared/FormModal';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Plus, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// --- Import API Hooks & Types ---
import {
  useTechnologiesQuery,
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
  useDeleteTechnologyMutation,
  mapTechnologiesToTableItems,
  type TechnologyTableItem,
  type CreateTechnologyPayload,
  type UpdateTechnologyPayload
} from '@/hooks/queries/useTechnologiesQueries';
import { useRoadmapsQuery } from '@/hooks/queries/useRoadmapsQueries';

// --- Configuration ---

const columns: Column<TechnologyTableItem>[] = [
  {
    key: "slugIcon",
    label: "Icon",
    render: (item) => (
      <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center text-lg overflow-hidden">
        {item.slugIcon && item.slugIcon.startsWith('http') ? (
          <img src={item.slugIcon} alt="" className="w-full h-full object-cover" />
        ) : (
          <span>{item.slugIcon || <FileText size={14} className="text-muted-foreground" />}</span>
        )}
      </div>
    )
  },
  { key: 'name', label: 'Name', render: (item) => <span className="font-medium text-foreground">{item.name}</span> },
  { key: "slug", label: "Slug", render: (item) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.slug}</code> },
  { key: "orderIndex", label: "Order" },
  { key: 'status', label: 'Status', render: item => <StatusBadge status={item.status} /> },
];

// Data Mapping Helper: Form Data -> API Payload
const toTechnologyPayload = (data: Record<string, string>): CreateTechnologyPayload => {
  const parsedOrder = Number.parseInt(data.order_index ?? "", 10);

  const keywordsList = data.keywords
    ? data.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    : [];

  return {
    roadmap_id: Number(data.roadmap_id),
    slug: (data.slug ?? "").trim(),
    title: (data.name ?? "").trim(), // Map form 'name' to API 'title'
    description: data.description?.trim() || null,
    slug_icon: data.slug_icon?.trim() || null,
    order_index: Number.isFinite(parsedOrder) ? parsedOrder : 0,
    // Note: is_active is handled separately or defaults in backend, 
    // but we can default to true for new items if needed.
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

export default function TechnologiesList() {
  const navigate = useNavigate();
  const { canEdit } = useApp();

  // --- React Query Hooks ---
  const { data: technologiesData, isLoading, isError } = useTechnologiesQuery();
  const { data: roadmapsData } = useRoadmapsQuery();

  const createMutation = useCreateTechnologyMutation();
  const updateMutation = useUpdateTechnologyMutation();
  const deleteMutation = useDeleteTechnologyMutation();

  // --- Local State ---
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<TechnologyTableItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<TechnologyTableItem | null>(null);

  // Map API response to Table Items
  const tableData = useMemo(() => {
    if (!technologiesData) return [];
    return mapTechnologiesToTableItems(technologiesData);
  }, [technologiesData]);

  // Form Fields Configuration
  const formFields: FormField[] = useMemo(() => [
    {
      name: 'roadmap_id', label: 'Roadmap', type: 'select', required: true,
      options: roadmapsData?.map((r) => ({ value: String(r.id), label: r.title })) || []
    },
    { name: 'name', label: 'Name', type: 'text', required: true, placeholder: "e.g. React" },
    { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: "react" },
    { name: 'slug_icon', label: 'Icon URL / Emoji', type: 'text', placeholder: "https://... or ⚛️" },
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
  ], [roadmapsData]);

  // Initial Data for Edit Mode
  const getInitialData = (item: TechnologyTableItem) => ({
    roadmap_id: item.roadmapId,
    name: item.name,
    slug: item.slug,
    slug_icon: item.slugIcon || "",
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

  // --- Handlers ---

  const handleCreateOrUpdate = (data: Record<string, string>) => {
    const payload = toTechnologyPayload(data);

    if (editItem) {
      updateMutation.mutate({
        techId: Number(editItem.id),
        payload: payload as UpdateTechnologyPayload
      }, {
        onSuccess: () => {
          toast({ title: 'Technology updated successfully' });
          setFormOpen(false);
          setEditItem(null);
        },
        onError: (error) => {
          toast({ title: 'Failed to update technology', variant: 'destructive' });
          console.error(error);
        }
      });
    } else {
      createMutation.mutate({ ...payload, is_active: true }, {
        onSuccess: () => {
          toast({ title: 'Technology created successfully' });
          setFormOpen(false);
        },
        onError: (error) => {
          toast({ title: 'Failed to create technology', variant: 'destructive' });
          console.error(error);
        }
      });
    }
  };

  const handleToggleStatus = (item: TechnologyTableItem) => {
    updateMutation.mutate({
      techId: Number(item.id),
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
        toast({ title: 'Technology deleted' });
        setDeleteItem(null);
      },
      onError: () => toast({ title: "Failed to delete technology", variant: "destructive" })
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Failed to load technologies.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Technologies</h1>
          <p className="text-sm text-muted-foreground">Click a technology to explore its modules</p>
        </div>
        {canEdit && (
          <button
            onClick={() => { setEditItem(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Technology
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
        onRowClick={item => navigate(`/technologies/${item.id}/modules`)}
        canEdit={canEdit}
      />

      <FormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editItem ? 'Edit Technology & SEO' : 'Add Technology'}
        fields={formFields.filter(f => f.name !== 'sep_seo')} // Filter out the visual separator from logic
        initialData={editItem ? getInitialData(editItem) : undefined}
        onSubmit={handleCreateOrUpdate}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Technology"
        message={`Are you sure you want to delete ${deleteItem?.name}?`}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}