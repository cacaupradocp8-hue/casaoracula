import { useAdminPreviewOptional } from '@/contexts/AdminPreviewContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { PortalType } from '@/types/portal';

const PREVIEW_PORTALS: { value: PortalType; label: string }[] = [
  { value: 'visitante', label: '👁 Visitante' },
  { value: 'pre_iniciada', label: '👁 Pré-Iniciada' },
  { value: 'iniciada', label: '👁 Iniciada ORÁCULA' },
];

export function AdminPreviewBar() {
  const { user } = useAuth();
  const preview = useAdminPreviewOptional();

  // Only show for admins
  if (!user || user.portal !== 'admin' || !preview) return null;

  const { isPreviewMode, previewPortal, enablePreviewMode, disablePreviewMode } = preview;

  return (
    <>
      {/* Desktop/tablet: top preview bar */}
      <div
        className={`hidden sm:block fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isPreviewMode
            ? 'bg-amber-500/95 text-amber-950'
            : 'bg-muted/90 backdrop-blur-sm border-b'
        }`}
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isPreviewMode ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Modo Preview: Visualizando como{' '}
                  <strong>
                    {previewPortal === 'visitante' && 'Visitante'}
                    {previewPortal === 'pre_iniciada' && 'Pré-Iniciada'}
                    {previewPortal === 'iniciada' && 'Iniciada ORÁCULA'}
                  </strong>
                </span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Admin: Visualização completa</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isPreviewMode ? (
              <Select value="" onValueChange={(value) => enablePreviewMode(value as PortalType)}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue placeholder="Simular visão de..." />
                </SelectTrigger>
                <SelectContent className="z-[120]">
                  {PREVIEW_PORTALS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 gap-2 bg-amber-100 text-amber-900 hover:bg-amber-200"
                onClick={disablePreviewMode}
              >
                <EyeOff className="w-3 h-3" />
                Sair do Preview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: floating control so it doesn't block navigation */}
      <div className="sm:hidden fixed bottom-4 right-4 z-[100]">
        {!isPreviewMode ? (
          <Select value="" onValueChange={(value) => enablePreviewMode(value as PortalType)}>
            <SelectTrigger className="h-10 w-auto px-3 text-xs shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <Eye className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Simular" />
            </SelectTrigger>
            <SelectContent className="z-[120]">
              {PREVIEW_PORTALS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="h-10 gap-2 shadow-lg bg-amber-100 text-amber-900 hover:bg-amber-200"
            onClick={disablePreviewMode}
          >
            <EyeOff className="w-4 h-4" />
            Sair do Preview
          </Button>
        )}
      </div>
    </>
  );
}
