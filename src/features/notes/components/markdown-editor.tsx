"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Eye, Edit3, Loader2 } from "lucide-react";
import { UserNote } from "../types";
import { saveNote } from "../actions";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

interface MarkdownEditorProps {
  note?: UserNote;
  onSave?: (note: UserNote) => void;
}

export function MarkdownEditor({ note, onSave }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [confidence, setConfidence] = useState<"Low" | "Medium" | "High">(note?.confidence_level || "Medium");
  const [isSaving, setIsSaving] = useState(false);

  // Debounce content for autosave
  const [debouncedContent] = useDebounce(content, 2000);
  const [debouncedTitle] = useDebounce(title, 2000);

  const handleSave = async (isAutosave = false) => {
    if (!title.trim()) {
      if (!isAutosave) toast.error("Title is required");
      return;
    }
    
    setIsSaving(true);
    const result = await saveNote({
      id: note?.id,
      title,
      content,
      confidence_level: confidence,
    });
    setIsSaving(false);

    if (result.error) {
      if (!isAutosave) toast.error(result.error);
    } else if (result.data) {
      if (!isAutosave) toast.success("Note saved successfully");
      if (onSave) onSave(result.data);
    }
  };

  useEffect(() => {
    // Autosave logic
    if ((debouncedContent !== note?.content || debouncedTitle !== note?.title) && debouncedTitle) {
      const timer = setTimeout(() => handleSave(true), 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent, debouncedTitle]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-xl">
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            className="border-0 bg-transparent text-lg font-semibold focus-visible:ring-0 px-2"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <select 
            value={confidence}
            onChange={(e) => setConfidence(e.target.value as "Low" | "Medium" | "High")}
            className={`text-xs font-medium px-2 py-1.5 rounded-md border-0 outline-none ${
              confidence === 'Low' ? 'bg-red-500/20 text-red-500' :
              confidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-emerald-500/20 text-emerald-500'
            }`}
          >
            <option value="Low" className="bg-background text-foreground">Low Confidence</option>
            <option value="Medium" className="bg-background text-foreground">Medium Confidence</option>
            <option value="High" className="bg-background text-foreground">High Confidence</option>
          </select>

          <div className="w-px h-6 bg-white/10 mx-2" />
          
          <Button variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)} className="gap-2">
            {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button size="sm" onClick={() => handleSave(false)} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {isPreview ? (
          <div className="absolute inset-0 overflow-y-auto p-6 prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({inline, className, children, ...props}: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      // @ts-expect-error - React Syntax Highlighter types mismatch
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content || "*No content provided.*"}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes in Markdown..."
            className="w-full h-full border-0 rounded-none resize-none focus-visible:ring-0 p-6 bg-transparent font-mono text-sm leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}
