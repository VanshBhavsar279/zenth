'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function normalizeHtml(html: string): string {
  const cleaned = html.replace(/<div><br><\/div>/g, '').replace(/<br>/g, '<br />').trim();
  return cleaned === '<br />' ? '' : cleaned;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Write here...',
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const run = (command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    onChange(normalizeHtml(editorRef.current?.innerHTML || ''));
  };

  const addLink = () => {
    const link = window.prompt('Enter URL (https://...)');
    if (!link) return;
    run('createLink', link);
  };

  const onInput = () => {
    onChange(normalizeHtml(editorRef.current?.innerHTML || ''));
  };

  return (
    <label className={cn('block space-y-2', className)}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <div className="overflow-hidden rounded-sm border border-white/10 bg-primary">
        <div className="flex flex-wrap gap-1 border-b border-white/10 bg-black/30 p-2">
          <ToolButton text="B" onClick={() => run('bold')} />
          <ToolButton text="I" onClick={() => run('italic')} />
          <ToolButton text="U" onClick={() => run('underline')} />
          <ToolButton text="•" onClick={() => run('insertUnorderedList')} />
          <ToolButton text="1." onClick={() => run('insertOrderedList')} />
          <ToolButton text="🔗" onClick={addLink} />
          <ToolButton text="⟲" onClick={() => run('removeFormat')} />
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={onInput}
          data-placeholder={placeholder}
          className="min-h-[140px] whitespace-pre-wrap px-3 py-3 font-sans text-sm leading-relaxed text-accent outline-none empty:before:pointer-events-none empty:before:text-muted empty:before:content-[attr(data-placeholder)]"
          suppressContentEditableWarning
        />
      </div>
    </label>
  );
}

function ToolButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex min-w-8 items-center justify-center rounded border border-white/15 px-2 py-1 font-mono text-xs text-accent transition hover:border-secondary hover:text-secondary"
    >
      {text}
    </button>
  );
}
