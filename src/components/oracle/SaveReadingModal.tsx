import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface SaveReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; notes: string; clientId?: string; sessionId?: string }) => Promise<void>;
  defaultName?: string;
  primaryColor?: string;
}

export function SaveReadingModal({
  isOpen,
  onClose,
  onSave,
  defaultName = '',
  primaryColor = 'hsl(var(--gold))',
}: SaveReadingModalProps) {
  const [name, setName] = useState(defaultName);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setNotes('');
    }
  }, [isOpen, defaultName]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ name, notes });
      onClose();
    } catch {
      // handled externally
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-card rounded-2xl border border-border/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display text-foreground">Salvar Leitura</h3>
                <button onClick={onClose} className="text-muted-foreground/50 hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground/60 mb-1.5 block">
                    Nome da leitura
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Leitura da manhã, Sessão com Maria..."
                    className="bg-background/50 border-border/20"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground/60 mb-1.5 block">
                    Observações
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Impressões, conexões percebidas, insights..."
                    className="bg-background/50 border-border/20 min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 text-muted-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
