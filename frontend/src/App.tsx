import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { FilePlus2, Search, Trash2 } from "lucide-react";

import { NoteForm } from "./components/NoteForm";
import { NotesList } from "./components/NotesList";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { useNotes } from "./hooks/useNotes";
import type { Note, NotePayload } from "./types/note";

const formatRelativeAge = (value: string): string => {
  const elapsed = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(elapsed / 60000));

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""}`;
};

const buildTags = (note: Note): string[] => {
  return note.content
    .split(/\s+/)
    .map((token) => token.replace(/[^\w-]/g, ""))
    .filter((token) => token.length > 4)
    .slice(0, 3)
    .map((token) => `#${token.toLowerCase()}`);
};

export const App = () => {
  const { notes, isLoading, error, createNote, updateNote, deleteNote, reload } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    if (!selectedNote && notes.length > 0) {
      setSelectedNote(notes[0]);
      return;
    }

    if (selectedNote) {
      const freshSelection = notes.find((note) => note.id === selectedNote.id) ?? null;
      setSelectedNote(freshSelection);
    }
  }, [notes, selectedNote]);

  const filteredNotes = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(query));
  }, [deferredSearchTerm, notes]);

  const handleSubmit = async (payload: NotePayload): Promise<void> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (selectedNote) {
        await updateNote(selectedNote.id, payload);
      } else {
        await createNote(payload);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteNote(id);

      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to delete note.");
    }
  };

  const activeTags = selectedNote ? buildTags(selectedNote) : ["#ideas", "#notes", "#draft"];

  return (
    <div className="min-h-screen bg-[#edf2f6] px-4 py-6 text-foreground md:px-8">
      <main className="mx-auto w-full max-w-[1380px] border border-[#ced7e0] bg-[#f8fbfd] p-5 shadow-shell md:p-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-sm border border-[#d4dce5] bg-[#f1f5f8] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[#4f6677]">
              Notes workspace
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-[4.25rem]">Notes</h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#66727d]">
                A simple CRUD notes app.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
            <div className="relative min-w-0 flex-1 sm:min-w-[360px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8091a3]" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search notes"
                className="h-12 rounded-[0.2rem] border-[#ced7e0] bg-[#ffffff] pl-11"
              />
            </div>
            <Button
              type="button"
              onClick={() => setSelectedNote(null)}
              className="h-12 rounded-[0.1rem] border border-[#bdd2df] bg-[#dbe8f1] px-5 text-[#274256] hover:bg-[#cfdfeb]"
            >
              <FilePlus2 className="mr-2 h-4 w-4" />
              New note
            </Button>
          </div>
        </header>

        {error ? (
          <div className="mt-6 rounded-[0.4rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <Button type="button" variant="ghost" className="mt-2 px-0" onClick={() => void reload()}>
              Retry loading notes
            </Button>
          </div>
        ) : null}

        {submitError ? (
          <div className="mt-6 rounded-[0.15rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}

        <section className="mt-10 grid gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-[0.85rem_0.2rem_0.85rem_0.2rem] border border-[#d8d8e4] bg-[#f5f4f9] p-5 shadow-card">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#6c6987]">Current note</p>
              <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-slate-950">
                {selectedNote?.title || "Write down your ideas"}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeTags.map((tag) => (
                  <span key={tag} className="rounded-[0.7rem_0.15rem_0.7rem_0.15rem] border border-[#e1d6cb] bg-[#faf3ea] px-3 py-1 text-xs font-medium text-[#7a6554]">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[15px] leading-7 text-[#66727d]">
                {selectedNote?.content || "Select a note to preview it here, or start a new draft from the editor."}
              </p>
            </div>

            <NotesList
              notes={filteredNotes}
              activeNoteId={selectedNote?.id ?? null}
              isLoading={isLoading}
              onCreate={() => setSelectedNote(null)}
              onEdit={setSelectedNote}
              onDelete={handleDelete}
              getRelativeAge={formatRelativeAge}
            />
          </div>

          <div className="space-y-6">
            <NoteForm
              selectedNote={selectedNote}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancelEdit={() => setSelectedNote(null)}
            />

            <div className="rounded-[0.2rem_1rem_0.2rem_1rem] border border-[#d8dfe6] bg-[#ffffff] p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Note details</p>
                  <p className="text-sm text-muted-foreground">Simple context for the selected draft</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-[0.15rem] border border-[#d8dfe6] bg-[#f3f7fa]"
                  onClick={() => (selectedNote ? void handleDelete(selectedNote.id) : undefined)}
                  disabled={!selectedNote}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-5 bg-[#f2eadf]" />

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#b9ad9a]">Status</p>
                  <p className="mt-2 font-medium text-slate-950">
                    {selectedNote ? "Editing existing note" : "Creating new note"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#b9ad9a]">Updated</p>
                  <p className="mt-2 text-slate-700">
                    {selectedNote ? new Date(selectedNote.updatedAt).toLocaleString() : "Not saved yet"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#b9ad9a]">Actions</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" className="rounded-[0.8rem_0.2rem_0.8rem_0.2rem] border border-[#e1d6cb] bg-[#faf3ea] text-[#705d4f]" onClick={() => void reload()}>
                      Refresh
                    </Button>
                    <Button type="button" variant="secondary" className="rounded-[0.15rem_0.8rem_0.15rem_0.8rem] border border-[#d4dce5] bg-[#f1f5f8] text-[#4e6576]" onClick={() => setSelectedNote(null)}>
                      New draft
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
