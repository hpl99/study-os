"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Plus, BookOpen, Clock, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "./markdown-editor";
import { UserNote } from "../types";
import { deleteNote } from "../actions";

export function NotesLayout({ initialNotes }: { initialNotes: UserNote[] }) {
  const [notes, setNotes] = useState<UserNote[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [search, setSearch] = useState("");

  const activeNote = notes.find(n => n.id === activeNoteId);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateNew = () => {
    setActiveNoteId("new");
  };

  const handleSave = (savedNote: UserNote) => {
    setNotes(prev => {
      const exists = prev.find(n => n.id === savedNote.id);
      if (exists) {
        return prev.map(n => n.id === savedNote.id ? savedNote : n);
      }
      return [savedNote, ...prev];
    });
    if (activeNoteId === "new") {
      setActiveNoteId(savedNote.id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-6">
      {/* Sidebar List */}
      <div className="w-80 flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          <Button onClick={handleCreateNew} size="icon" className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeNoteId === note.id 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <h3 className="font-medium text-sm line-clamp-1">{note.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content.substring(0, 100) || "No content"}</p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {format(new Date(note.updated_at), 'MMM d')}
                </div>
                <div className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ${
                  note.confidence_level === 'Low' ? 'bg-red-500/20 text-red-500' :
                  note.confidence_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-emerald-500/20 text-emerald-500'
                }`}>
                  <Brain className="w-3 h-3" /> {note.confidence_level}
                </div>
              </div>
            </div>
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center p-8 text-sm text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-20" />
              No notes found
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1">
        {activeNoteId === "new" ? (
          <MarkdownEditor onSave={handleSave} />
        ) : activeNote ? (
          <MarkdownEditor key={activeNote.id} note={activeNote} onSave={handleSave} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground border border-white/10 rounded-xl bg-white/5 border-dashed">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
