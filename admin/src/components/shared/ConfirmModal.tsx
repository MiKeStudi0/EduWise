import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean; // Added this property
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading = false // Default to false
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={isLoading ? undefined : onClose} // Prevent background click close while loading
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl p-6"
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{message}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={onClose} 
                disabled={isLoading}
                className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <button 
                onClick={onConfirm} 
                disabled={isLoading}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}