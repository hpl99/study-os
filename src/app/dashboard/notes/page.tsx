import { BookOpen } from "lucide-react";
import { getNotes } from "@/features/notes/actions";
import { NotesLayout } from "@/features/notes/components/notes-layout";
import { Suspense } from "react";

async function NotesContent() {
  const { data: notes, error } = await getNotes();

  if (error) {
    return (
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-lg text-sm">
        <p className="font-medium mb-1">Unable to load notes</p>
        <p className="opacity-80">We couldn't fetch your notes right now. Please make sure your database is initialized and try again.</p>
      </div>
    );
  }

  return <NotesLayout initialNotes={notes || []} />;
}

export default function NotesPage() {
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

      <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-xl border border-white/10" />}>
        <NotesContent />
      </Suspense>
    </div>
  );
}
