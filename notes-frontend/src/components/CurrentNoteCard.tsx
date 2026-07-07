import type { Note } from "../types/note";

type CurrentNoteCardProps = {
  selectedNote: Note | null;
};

const formatDateSingapore = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const CurrentNoteCard = ({ selectedNote }: CurrentNoteCardProps) => {
  return (
    <div className="rounded-[0.85rem_0.2rem_0.85rem_0.2rem] border border-[#d8d8e4] bg-[#f5f4f9] p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#6c6987]">Current note</p>
      <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">
        {selectedNote?.title || "No note selected"}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#66727d] line-clamp-4">
        {selectedNote?.content || "Select a note to preview it here."}
      </p>
      {selectedNote && (
        <p className="mt-3 text-xs text-[#b9ad9a]">
          Updated: {formatDateSingapore(selectedNote.updatedAt)} SGT
        </p>
      )}
    </div>
  );
};
