// ============================================
// Rich Text Editor — TipTap wrapper
// ============================================

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Quote
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Placeholder.configure({ placeholder: placeholder || 'Escreva aqui...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return null;

  const ToolBtn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn('h-7 w-7 p-0', active && 'bg-muted text-foreground')}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn('border border-input rounded-md bg-background', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1 border-b border-border">
        <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrito">
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Itálico">
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Sublinhado">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Título">
          <Heading2 className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Subtítulo">
          <Heading3 className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">
          <List className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citação">
          <Quote className="w-3.5 h-3.5" />
        </ToolBtn>
      </div>
      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 min-h-[120px] focus-within:outline-none
          prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground
          prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
          [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  );
}
