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

const formatDateSingapore = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const NotesList = ({
  notes,
  isLoading,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
}: Props) => {
  if (isLoading) return <p className="text-xs text-gray-500">Loading...</p>;

  return (
    <ul className="space-y-2 max-h-[600px] overflow-y-auto">
      {notes.map((note) => (
        <li
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`p-3 border rounded-md cursor-pointer transition ${
            selectedNoteId === note.id
              ? "border-[#d8d8e4] bg-[#f5f4f9]"
              : "border-[#e7e1da] bg-white hover:border-[#d8d8e4]"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-900 text-sm truncate">
                {note.title}
              </h4>

              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                {note.content}
              </p>

              <p className="text-[0.65rem] text-gray-400 mt-1">
                {formatDateSingapore(note.updatedAt)}
              </p>

              {note.isPinned && (
                <span className="text-[0.65rem] text-yellow-600 font-medium mt-1 inline-block">
                  📌 Pinned
                </span>
              )}
            </div>

            <div className="flex gap-1">
              {/* PIN */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className={`p-1.5 rounded transition ${
                  note.isPinned
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-400 hover:text-gray-600"
                }`}
              >
                <Pin className="h-3.5 w-3.5" />
              </button>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="p-1.5 bg-red-100 text-red-600 rounded"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};