import { useState } from "react";
import { Search } from "lucide-react";

import { ConfirmDialog } from "./components/ConfirmDialog";
import { ToastContainer } from "./components/ToastContainer";

import { CurrentNoteCard } from "./components/CurrentNoteCard";
import { ErrorAlert } from "./components/ErrorAlert";
import { NoteForm } from "./components/NoteForm";
import { NotesList } from "./components/NotesList";
import { NotesCountCard } from "./components/NotesCountCard";
import { NotesHeader } from "./components/NotesHeader";
import { SubmitErrorAlert } from "./components/SubmitErrorAlert";

import { useNotes } from "./hooks/useNotes";
import type { Note, NotePayload } from "./types/note";

export const App = () => {
  const {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    reload,
    togglePin,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // ✅ SEARCH
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ TOAST
  const [toasts, setToasts] = useState<
    { id: number; message: string; type?: "success" | "error" }[]
  >([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // ✅ CONFIRM
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: "delete" | "leave" | "save";
    payload?: any;
  }>({ open: false, type: "delete" });

  const handleSubmit = async (payload: NotePayload) => {
    setConfirmState({ open: true, type: "save", payload });
  };

  const handleDelete = (id: string) => {
    setConfirmState({ open: true, type: "delete", payload: id });
  };

  const handleSelectNote = (note: Note) => {
    if (isDirty) {
      setConfirmState({ open: true, type: "leave", payload: note });
      return;
    }
    setSelectedNote(note);
  };

  const handleConfirm = async () => {
    try {
      if (confirmState.type === "delete") {
        await deleteNote(confirmState.payload);
        showToast("Note deleted");
      }

      if (confirmState.type === "leave") {
        setSelectedNote(confirmState.payload);
      }

      if (confirmState.type === "save") {
        setIsSubmitting(true);

        if (selectedNote) {
          await updateNote(selectedNote.id, confirmState.payload);
          showToast("Note updated");
        } else {
          await createNote(confirmState.payload);
          showToast("Note created");
          setSelectedNote(null);
        }

        setIsDirty(false);
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
      setConfirmState({ open: false, type: "delete" });
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2f6] px-4 py-6 text-foreground md:px-8">
      <main className="mx-auto w-full max-w-[1380px] border border-[#ced7e0] bg-[#f8fbfd] p-5 shadow-shell md:p-8">
        <NotesHeader />

        {error && <ErrorAlert message={error} onRetry={() => void reload()} />}
        {submitError && <SubmitErrorAlert message={submitError} />}

        <section className="mt-10 grid gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* LEFT */}
          <div className="space-y-6">
            <NotesCountCard count={notes.length} />

            {/* 🔍 SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-9 pr-3 py-2 border border-[#d4dce5] rounded-md bg-white text-sm"
              />
            </div>

            <NotesList
              notes={filteredNotes}
              isLoading={isLoading}
              selectedNoteId={selectedNote?.id ?? null}
              onSelectNote={handleSelectNote}
              onDeleteNote={handleDelete}
              onTogglePin={togglePin}
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <CurrentNoteCard selectedNote={selectedNote} />

            <NoteForm
              selectedNote={selectedNote}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancelEdit={() => setSelectedNote(null)}
              setIsDirty={setIsDirty}
            />
          </div>
        </section>

        <ConfirmDialog
          open={confirmState.open}
          title={
            confirmState.type === "delete"
              ? "Delete note?"
              : confirmState.type === "leave"
              ? "Unsaved changes"
              : "Save changes?"
          }
          description={
            confirmState.type === "delete"
              ? "This action cannot be undone."
              : confirmState.type === "leave"
              ? "You have unsaved changes."
              : "Are you sure you want to save?"
          }
          confirmText={
            confirmState.type === "delete"
              ? "Delete"
              : confirmState.type === "leave"
              ? "Continue"
              : "Save"
          }
          onConfirm={handleConfirm}
          onCancel={() =>
            setConfirmState({ open: false, type: "delete" })
          }
        />

        <ToastContainer toasts={toasts} />
      </main>
    </div>
  );
};