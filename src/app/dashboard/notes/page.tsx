import { BookOpen } from "lucide-react";
import { getNotes } from "@/features/notes/actions";
import { NotesLayout } from "@/features/notes/components/notes-layout";

export default async function NotesPage() {
  const { data: notes, error } = await getNotes();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          Notes & Revision
        </h1>
        <p className="text-muted-foreground">
          Markdown notes with spaced repetition and confidence tracking.
        </p>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
          Failed to load notes: {error}
        </div>
      ) : (
        <NotesLayout initialNotes={notes || []} />
      )}
    </div>
  );
}
