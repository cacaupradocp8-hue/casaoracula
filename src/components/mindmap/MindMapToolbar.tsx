import { ZoomIn, ZoomOut, Maximize, Download, FileText, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MindMapToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onExportPng: () => void;
  onExportText: () => void;
  saving: boolean;
  lastSaved: Date | null;
}

export function MindMapToolbar({
  title,
  onTitleChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onExportPng,
  onExportText,
  saving,
  lastSaved
}: MindMapToolbarProps) {
  return (
    <div className="h-14 border-b bg-card px-4 flex items-center justify-between gap-4">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="max-w-[200px] h-8 font-medium"
          placeholder="Nome do mapa..."
        />
        
        {/* Save indicator */}
        <div className={cn(
          "flex items-center gap-1.5 text-xs transition-opacity",
          saving ? "opacity-100" : "opacity-60"
        )}>
          {saving ? (
            <>
              <Save className="h-3.5 w-3.5 animate-pulse" />
              <span>Salvando...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-muted-foreground">Salvo</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Zoom controls */}
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={onZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={onZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onZoomReset}
          title="Resetar zoom"
        >
          <Maximize className="h-4 w-4" />
        </Button>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportPng}>
              <Download className="h-4 w-4 mr-2" />
              Exportar como PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportText}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar como Texto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
