import { useState, useMemo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, ChevronRight as GoIcon } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  searchFields: string[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onToggleStatus?: (item: T) => void;
  onRowClick?: (item: T) => void;
  statusField?: string;
  canEdit?: boolean;
  pageSize?: number;
}

export function DataTable<T extends { id: string }>({
  data, columns, searchFields, onEdit, onDelete, onToggleStatus,
  onRowClick, statusField = 'status', canEdit = true, pageSize = 10
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => String((item as any)[field] || '').toLowerCase().includes(q))
      );
    }
    if (filter !== 'all') {
      result = result.filter(item => (item as any)[statusField] === filter);
    }
    return result;
  }, [data, search, filter, searchFields, statusField]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(i => i.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  if (data.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
        </div>
        <div className="flex gap-0.5 p-1 bg-muted rounded-lg">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} className="rounded" />
                </th>
                {columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{col.label}</th>
                ))}
                {(onEdit || onDelete || onRowClick) && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={columns.length + 2} className="px-4 py-8 text-center text-muted-foreground text-sm">No results found</td></tr>
              ) : paged.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  // 1. ADDED: Row Click Handler
                  onClick={() => onRowClick && onRowClick(item)}
                  // 2. ADDED: Cursor pointer logic
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selected.has(item.id)} 
                      // 3. ADDED: Stop Propagation so checking box doesn't navigate
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleOne(item.id)} 
                      className="rounded" 
                    />
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-foreground">
                      {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                    </td>
                  ))}
                  {(onEdit || onDelete || onRowClick) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {onToggleStatus && canEdit && (
                          <button
                            onClick={(e) => {
                                // 4. ADDED: Stop Propagation
                                e.stopPropagation(); 
                                onToggleStatus(item);
                            }}
                            className={`relative w-9 h-5 rounded-full transition-colors ${
                              (item as any)[statusField] === 'active' ? 'bg-success' : 'bg-muted'
                            }`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${
                              (item as any)[statusField] === 'active' ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </button>
                        )}
                        {onEdit && canEdit && (
                          <button 
                            onClick={(e) => {
                                // 4. ADDED: Stop Propagation
                                e.stopPropagation(); 
                                onEdit(item);
                            }} 
                            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {onDelete && canEdit && (
                          <button 
                            onClick={(e) => {
                                // 4. ADDED: Stop Propagation
                                e.stopPropagation(); 
                                onDelete(item);
                            }} 
                            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        {/* Since the row is clickable, this icon is now just a visual indicator.
                           We remove the button wrapper so it doesn't trap focus, 
                           or simply let the click bubble up to the TR.
                        */}
                        {onRowClick && (
                          <div className="p-1.5 text-muted-foreground">
                            <GoIcon size={14} />
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40"><ChevronLeft size={14} /></button>
            <span>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}