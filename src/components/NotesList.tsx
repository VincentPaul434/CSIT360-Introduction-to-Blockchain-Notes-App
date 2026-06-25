import { Trash2 } from "lucide-react";

import type { Note } from "../types/note";
import { Button } from "./ui/button";

type NotesListProps = {
  notes: Note[];
  activeNoteId: string | null;
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => Promise<void>;
  getRelativeAge: (value: string) => string;
};

export const NotesList = ({
  notes,
  activeNoteId,
  isLoading,
  onCreate,
  onEdit,
  onDelete,
  getRelativeAge,
}: NotesListProps) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading notes...</p>;
  }

  if (notes.length === 0) {
    return (
      <div className="rounded-[0.2rem_1rem_0.2rem_1rem] border border-dashed border-[#d4dce5] bg-[#f1f5f8] p-6">
        <p className="text-sm font-medium text-slate-900">No notes found.</p>
        <p className="mt-1 text-sm text-muted-foreground">Create a note or adjust your search query.</p>
        <Button type="button" className="mt-4 rounded-[0.15rem] border border-[#bdd2df] bg-[#dbe8f1] text-[#274256] hover:bg-[#cfdfeb]" onClick={onCreate}>
          Create note
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const isActive = note.id === activeNoteId;

        return (
          <article
            key={note.id}
            className={`cursor-pointer p-5 shadow-card transition ${
              isActive
                ? "rounded-[0.95rem_0.2rem_0.95rem_0.2rem] border border-[#bdd2df] bg-[#edf4fa] text-slate-950"
                : "rounded-[0.2rem_0.95rem_0.2rem_0.95rem] border border-[#d8dfe6] bg-white hover:border-[#c4d2de]"
            }`}
            onClick={() => onEdit(note)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold">{note.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-[#6f675d]">
                  {note.content}
                </p>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#6d7e8f]">
                {isActive ? "Active" : "Note"}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-xs text-[#6d7e8f]">{getRelativeAge(note.updatedAt)}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    void onDelete(note.id);
                  }}
                  className="rounded-[0.15rem] border border-[#e1d6cb] bg-[#faf3ea] p-2 text-[#7a6554] transition hover:bg-[#f4e8da]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="rounded-[0.7rem_0.15rem_0.7rem_0.15rem] border border-[#d4dce5] bg-[#f1f5f8] px-3 py-1 text-xs font-medium text-[#4e6576]">
                  Open
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
