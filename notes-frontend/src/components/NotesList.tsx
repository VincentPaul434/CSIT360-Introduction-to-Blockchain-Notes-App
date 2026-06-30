import { Pin, Trash2 } from "lucide-react";
import type { Note } from "../types/note";

type Props = {
  notes: Note[];
  isLoading: boolean;
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
};

export const NotesList = ({
  notes,
  isLoading,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
}: Props) => {
  if (isLoading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`p-4 border rounded cursor-pointer transition ${
            selectedNoteId === note.id ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <h3 className="font-medium text-slate-900">
                {note.title}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-2">
                {note.content}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>

              {note.isPinned && (
                <span className="text-xs text-yellow-600 font-medium">
                  📌 Pinned
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {/* PIN */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className={`p-2 rounded transition ${
                  note.isPinned
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-400 hover:text-gray-600"
                }`}
              >
                <Pin className="h-4 w-4" />
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="p-2 bg-red-100 text-red-600 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};