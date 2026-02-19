import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  // Added 'separator' to support visual breaks
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'separator';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  getOptions?: (formData: Record<string, string>) => { value: string; label: string }[];
  dependsOn?: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, string>;
  // Added to handle mutation loading states
  isSubmitting?: boolean;
}

export function FormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  fields, 
  initialData, 
  isSubmitting = false 
}: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) setFormData(initialData || {});
  }, [isOpen, initialData]);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Clear dependent fields if parent changes
      fields.forEach(f => {
        if (f.dependsOn === name) next[f.name] = '';
      });
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      onSubmit(formData);
      // Note: We don't close immediately here; we let the parent close on success
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fields.map(field => {
                    // Handle Separator Type
                    if (field.type === 'separator') {
                      return (
                        <div key={field.name} className="col-span-1 md:col-span-2 pt-4 pb-1 border-b border-border mb-2">
                          <h3 className="text-sm font-semibold text-foreground/80">{field.label}</h3>
                        </div>
                      );
                    }

                    const options = field.getOptions ? field.getOptions(formData) : field.options;
                    // Full width for textarea or explicit override
                    const isFullWidth = field.type === 'textarea';

                    return (
                      <div key={field.name} className={isFullWidth ? 'col-span-1 md:col-span-2' : ''}>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          {field.label} {field.required && <span className="text-destructive">*</span>}
                        </label>
                        
                        {field.type === 'select' ? (
                          <select
                            value={formData[field.name] || ''}
                            onChange={e => handleChange(field.name, e.target.value)}
                            required={field.required}
                            className={inputClass}
                            disabled={isSubmitting}
                          >
                            <option value="">{field.placeholder || `Select ${field.label}`}</option>
                            {options?.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            value={formData[field.name] || ''}
                            onChange={e => handleChange(field.name, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder}
                            rows={3}
                            className={inputClass + ' resize-none'}
                            disabled={isSubmitting}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={e => handleChange(field.name, e.target.value)}
                            required={field.required}
                            placeholder={field.placeholder}
                            className={inputClass}
                            disabled={isSubmitting}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-3 px-6 py-4 border-t border-border bg-background shrink-0">
                <button 
                  type="button" 
                  onClick={onClose} 
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors text-foreground disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}