type NotesCountCardProps = {
  count: number;
};

export const NotesCountCard = ({ count }: NotesCountCardProps) => {
  return (
    <div className="rounded-[0.85rem_0.2rem_0.85rem_0.2rem] border border-[#d8d8e4] bg-[#f5f4f9] p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#6c6987]">Your Notes</p>
      <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.03em] text-slate-950">
        {count} {count === 1 ? "Note" : "Notes"}
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-[#66727d]">
        {count === 0 ? "No notes yet. Create one to get started!" : "Select a note to edit or delete it."}
      </p>
    </div>
  );
};
