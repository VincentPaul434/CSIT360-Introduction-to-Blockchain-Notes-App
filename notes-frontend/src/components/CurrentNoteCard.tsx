import type { Note } from "../types/note";

type CurrentNoteCardProps = {
  selectedNote: Note | null;
};

export const CurrentNoteCard = ({ selectedNote }: CurrentNoteCardProps) => {
  return (
    <div className="rounded-[0.85rem_0.2rem_0.85rem_0.2rem] border border-[#d8d8e4] bg-[#f5f4f9] p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#6c6987]">Current note</p>
      <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-slate-950">
        {selectedNote?.title || "No note selected"}
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-[#66727d] line-clamp-3">
        {selectedNote?.content || "Select a note to preview and edit it."}
      </p>
      {selectedNote && (
        <p className="mt-4 text-xs text-[#b9ad9a]">
          Updated: {new Date(selectedNote.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};
