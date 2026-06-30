import { Trash2 } from "lucide-react";
import type { Note } from "../types/note";

type NoteListItemProps = {
  note: Note;
  isSelected: boolean;
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
};

export const NoteListItem = ({ note, isSelected, onSelect, onDelete }: NoteListItemProps) => {
  return (
    <li
      className={`transition-colors cursor-pointer ${
        isSelected ? "bg-[#f5f4f9]" : "hover:bg-[#fafaf9]"
      }`}
    >
      <div className="px-5 py-4 flex items-start justify-between gap-3" onClick={() => onSelect(note)}>
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-medium text-slate-950">{note.title}</h3>
          <p className="mt-1 truncate text-sm text-[#66727d]">{note.content}</p>
          <p className="mt-2 text-xs text-[#b9ad9a]">
            {new Date(note.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="flex-shrink-0 bg-red-100 text-red-600 hover:bg-red-200 rounded-[0.2rem] p-2 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};
