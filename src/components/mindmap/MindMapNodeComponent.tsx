import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { MindMapNode } from '@/types/mindmap';
import { cn } from '@/lib/utils';

interface MindMapNodeComponentProps {
  node: MindMapNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onUpdateTitle: (title: string) => void;
  onAddChild: () => void;
}

export function MindMapNodeComponent({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onUpdateTitle,
  onAddChild
}: MindMapNodeComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(node.title);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== node.title) {
      onUpdateTitle(editValue.trim());
    } else {
      setEditValue(node.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(node.title);
      setIsEditing(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      onDragStart(e);
    }
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild();
  };

  return (
    <div
      className={cn(
        "absolute group cursor-move select-none",
        "min-w-[120px] max-w-[200px]"
      )}
      style={{
        left: node.position_x,
        top: node.position_y,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-lg border-2 transition-all",
          "bg-card shadow-md hover:shadow-lg",
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-primary/50"
        )}
        style={{
          backgroundColor: node.color ? `${node.color}20` : undefined,
          borderColor: isSelected ? undefined : node.color || undefined
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-center text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm font-medium text-center block break-words">
            {node.title}
          </span>
        )}

        {/* Tags */}
        {node.tags && node.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
            {node.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add child button */}
      <button
        onClick={handleAddChild}
        className={cn(
          "absolute -bottom-3 left-1/2 -translate-x-1/2",
          "w-6 h-6 rounded-full bg-primary text-primary-foreground",
          "flex items-center justify-center shadow-md",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "hover:scale-110"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
