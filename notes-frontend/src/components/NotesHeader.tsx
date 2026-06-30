export const NotesHeader = () => {
  return (
    <header className="mb-8">
      <div className="space-y-3">
        <div className="inline-flex items-center rounded-sm border border-[#d4dce5] bg-[#f1f5f8] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[#4f6677]">
          Notes App
        </div>
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-[4.25rem]">Notes</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#66727d]">
            Create, edit, and manage your notes.
          </p>
        </div>
      </div>
    </header>
  );
};
