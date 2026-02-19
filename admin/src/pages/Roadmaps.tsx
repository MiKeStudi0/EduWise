import { useMemo, useState } from "react";
import { Plus, Map as MapIcon, Activity, Layers, AlertCircle, FileText } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal, FormField } from "@/components/shared/FormModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "@/hooks/use-toast";
import {
  useCreateRoadmapMutation,
  useDeleteRoadmapMutation,
  useRoadmapsQuery,
  useUpdateRoadmapMutation,
} from "@/hooks/queries/useRoadmapsQueries";

// --- Types (Ideally move these to your types file) ---

interface SeoMetadata {
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  canonical_url?: string;
  robots?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  twitter_card?: string;
}

export interface RoadmapTableItem {
  id: string;
  slug: string;
  slugIcon: string;
  title: string;
  description: string;
  orderIndex: number;
  status: "active" | "inactive";
  createdAt: string;
  is_active: boolean;
  seo?: SeoMetadata; // Added SEO here
}

// --- Helper Components ---

const StatsCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-foreground">{value}</h3>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-4">
      <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
    </div>
    <div className="border border-border rounded-xl overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 border-b border-border bg-card/50 p-4 flex items-center gap-4 animate-pulse">
           <div className="h-4 w-4 bg-muted rounded" />
           <div className="h-4 w-32 bg-muted rounded" />
           <div className="h-4 w-full bg-muted rounded" />
        </div>
      ))}
    </div>
  </div>
);

// --- Configuration ---

const columns: Column<RoadmapTableItem>[] = [
  { 
    key: "slugIcon", 
    label: "Icon", 
    render: (item) => (
      <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center text-lg overflow-hidden">
        {item.slugIcon && item.slugIcon.startsWith('http') ? (
           <img src={item.slugIcon} alt="" className="w-full h-full object-cover" />
        ) : (
           <span>{item.slugIcon || <FileText size={14} className="text-muted-foreground"/>}</span>
        )}
      </div>
    )
  },
  { key: "title", label: "Title", render: (item) => <span className="font-medium text-foreground">{item.title}</span> },
  { key: "slug", label: "Slug", render: (item) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.slug}</code> },
  { key: "orderIndex", label: "Order" },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
  { key: "createdAt", label: "Created", render: (item) => <span className="text-xs text-muted-foreground">{item.createdAt}</span> },
];

const formFields: FormField[] = [
  // --- General Settings ---
  { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. Frontend Development" },
  { name: "slug", label: "Slug", type: "text", required: true, placeholder: "frontend-dev" },
  { name: "slug_icon", label: "Icon URL / Emoji", type: "text", placeholder: "https://... or 🚀" },
  { name: "order_index", label: "Order Priority", type: "number", placeholder: "0" },
  { name: "description", label: "Description", type: "textarea", placeholder: "A brief overview..." },
  
  // --- SEO Settings (Visual Divider handled by label naming convention or just ordering) ---
  { name: "sep_seo", label: "--- SEO Configuration ---", type: "text", required: false, placeholder: "ignore this field, visual only" }, // Crude spacer, handled better with custom renderer usually
  
  { name: "meta_title", label: "SEO Meta Title", type: "text", placeholder: "Title for search engines" },
  { name: "meta_description", label: "SEO Meta Description", type: "textarea", placeholder: "Description for SERP..." },
  { name: "keywords", label: "Keywords (comma separated)", type: "text", placeholder: "react, javascript, html" },
  { name: "canonical_url", label: "Canonical URL", type: "text", placeholder: "https://..." },
  { name: "robots", label: "Robots", type: "text", placeholder: "index, follow" },
  { name: "og_title", label: "OG Title", type: "text", placeholder: "Open Graph Title" },
  { name: "og_description", label: "OG Description", type: "textarea", placeholder: "Open Graph Description" },
  { name: "og_image_url", label: "OG Image URL (Social Share)", type: "text", placeholder: "https://..." },
  { name: "twitter_card", label: "Twitter Card", type: "select", options: [{ value: "summary", label: "Summary" }, { value: "summary_large_image", label: "Summary Large Image" }] },
];

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

// Data Mapping Function
const toRoadmapPayload = (data: Record<string, string>): any => {
  const parsedOrder = Number.parseInt(data.order_index ?? "", 10);
  
  // Convert comma-separated string to array for backend
  const keywordsList = data.keywords 
    ? data.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    : [];

  return {
    slug: (data.slug ?? "").trim(),
    title: (data.title ?? "").trim(),
    description: data.description?.trim() || null,
    slug_icon: data.slug_icon?.trim() || null,
    order_index: Number.isFinite(parsedOrder) ? parsedOrder : 0,
    // Nest the SEO data
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

export default function RoadmapsPage() {
  const { canEdit } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<RoadmapTableItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<RoadmapTableItem | null>(null);

  const { data: roadmaps = [], isPending, isError, error } = useRoadmapsQuery();
  const createRoadmapMutation = useCreateRoadmapMutation();
  const updateRoadmapMutation = useUpdateRoadmapMutation();
  const deleteRoadmapMutation = useDeleteRoadmapMutation();

  // Ensure mapRoadmapsToTableItems maps the nested SEO object from the API response
  const tableData = useMemo(() => {
    // We assume mapRoadmapsToTableItems is imported, but we need to ensure it includes the 'seo' object
    // If you need to override it here locally:
    return roadmaps.map((r: any) => ({
        id: String(r.id),
        slug: r.slug,
        slugIcon: r.slug_icon,
        title: r.title,
        description: r.description,
        orderIndex: r.order_index,
        status: (r.is_active ? 'active' : 'inactive') as 'active' | 'inactive',
        createdAt: new Date(r.created_at).toLocaleDateString(),
        is_active: r.is_active,
        seo: r.seo // Pass the SEO object through
    }));
  }, [roadmaps]);

  const stats = useMemo(() => ({
    total: roadmaps.length,
    active: roadmaps.filter((r: any) => r.is_active).length,
    inactive: roadmaps.filter((r: any) => !r.is_active).length
  }), [roadmaps]);

  const handleCreateOrUpdate = (data: Record<string, string>) => {
    const payload = toRoadmapPayload(data);

    if (!payload.slug || !payload.title) {
      toast({ title: "Validation Error", description: "Slug and title are required.", variant: "destructive" });
      return;
    }

    const onSuccess = () => {
      toast({ title: editItem ? "Roadmap updated" : "Roadmap created" });
      setFormOpen(false);
      setEditItem(null);
    };

    const onError = (err: unknown) => {
      toast({ title: "Error", description: getErrorMessage(err), variant: "destructive" });
    };

    if (editItem) {
      updateRoadmapMutation.mutate(
        { roadmapId: Number(editItem.id), payload }, 
        { onSuccess, onError }
      );
    } else {
      createRoadmapMutation.mutate(
        { ...payload, is_active: true }, 
        { onSuccess, onError }
      );
    }
  };

  const handleDelete = (item: RoadmapTableItem) => {
    deleteRoadmapMutation.mutate(Number(item.id), {
      onSuccess: () => {
        toast({ title: "Roadmap deleted" });
        setDeleteItem(null);
      },
      onError: (err) => {
        toast({ title: "Failed to delete", description: getErrorMessage(err), variant: "destructive" });
      },
    });
  };

  const handleToggleStatus = (item: RoadmapTableItem) => {
    updateRoadmapMutation.mutate(
      { roadmapId: Number(item.id), payload: { is_active: item.status !== "active" } },
      {
        onSuccess: () => toast({ title: "Status updated" }),
        onError: (err) => toast({ title: "Update failed", description: getErrorMessage(err), variant: "destructive" }),
      }
    );
  };

  // Helper to flatten initial data for the Form
  const getInitialData = (item: RoadmapTableItem) => ({
      slug: item.slug,
      title: item.title,
      description: item.description || "",
      order_index: String(item.orderIndex),
      slug_icon: item.slugIcon || "",
      // Flatten SEO fields
      meta_title: item.seo?.meta_title || "",
      meta_description: item.seo?.meta_description || "",
      // Join array back to comma-string
      keywords: item.seo?.keywords ? item.seo.keywords.join(", ") : "",
      canonical_url: item.seo?.canonical_url || "",
      robots: item.seo?.robots || "index, follow",
      og_title: item.seo?.og_title || "",
      og_description: item.seo?.og_description || "",
      og_image_url: item.seo?.og_image_url || "",
      twitter_card: item.seo?.twitter_card || "summary_large_image",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Roadmaps</h1>
          <p className="text-muted-foreground mt-1">Manage and organize learning paths.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => { setEditItem(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} /> Add Roadmap
          </button>
        )}
      </div>

      {/* Stats */}
      {!isError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Total Roadmaps" value={stats.total} icon={Layers} color="bg-blue-500" />
          <StatsCard title="Active" value={stats.active} icon={Activity} color="bg-emerald-500" />
          <StatsCard title="Drafts" value={stats.inactive} icon={MapIcon} color="bg-amber-500" />
        </div>
      )}

      {/* Main Table Content */}
      <div className="min-h-[400px]">
        {isPending ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center flex flex-col items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full text-destructive">
               <AlertCircle size={24} />
            </div>
            <h3 className="font-semibold text-destructive">Failed to load roadmaps</h3>
            <p className="text-sm text-muted-foreground max-w-md">{getErrorMessage(error)}</p>
          </div>
        ) : (
          <DataTable
            data={tableData}
            columns={columns}
            searchFields={["title", "slug", "description"]}
            onEdit={(item) => { setEditItem(item); setFormOpen(true); }}
            onDelete={(item) => setDeleteItem(item)}
            onToggleStatus={handleToggleStatus}
            canEdit={canEdit}
            pageSize={10}
          />
        )}
      </div>

      {/* Forms & Modals */}
      <FormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editItem ? "Edit Roadmap & SEO" : "Create New Roadmap"}
        fields={formFields.filter(f => f.name !== 'sep_seo')} // Filter out the visual separator if not supported by your generic form
        initialData={editItem ? getInitialData(editItem) : undefined}
        onSubmit={handleCreateOrUpdate}
      />

      <ConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Roadmap"
        message={`Are you sure you want to delete "${deleteItem?.title}"? This action cannot be undone.`}
        onConfirm={() => deleteItem && handleDelete(deleteItem)}
      />
    </div>
  );
}