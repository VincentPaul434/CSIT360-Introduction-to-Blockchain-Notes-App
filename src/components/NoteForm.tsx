import { FormEvent, useEffect, useState } from "react";
import { Clock3, PencilLine, Save } from "lucide-react";

import type { Note, NotePayload } from "../types/note";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type NoteFormProps = {
  selectedNote: Note | null;
  isSubmitting: boolean;
  onSubmit: (payload: NotePayload) => Promise<void>;
  onCancelEdit: () => void;
};

const emptyForm: NotePayload = {
  title: "",
  content: "",
};

export const NoteForm = ({
  selectedNote,
  isSubmitting,
  onSubmit,
  onCancelEdit,
}: NoteFormProps) => {
  const [formState, setFormState] = useState<NotePayload>(emptyForm);

  useEffect(() => {
    if (!selectedNote) {
      setFormState(emptyForm);
      return;
    }

    setFormState({
      title: selectedNote.title,
      content: selectedNote.content,
    });
  }, [selectedNote]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formState);

    if (!selectedNote) {
      setFormState(emptyForm);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1rem_0.2rem_0.2rem_1rem] border border-[#d4dce5] bg-white p-6 shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#b9ad9a]">Editor</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            {selectedNote ? "Update note" : "Create note"}
          </h3>
        </div>
        <div className="rounded-[0.2rem_0.8rem_0.2rem_0.8rem] border border-[#e1d6cb] bg-[#faf3ea] px-3 py-2 text-xs font-medium text-[#7a6554]">
          <Clock3 className="h-3.5 w-3.5" />
          {selectedNote ? "Existing draft" : "Unsaved draft"}
        </div>
      </div>

      <Separator className="my-5 bg-[#f2eadf]" />

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-slate-800">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formState.title}
            onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
            placeholder="Write a clear note title"
            className="h-12 rounded-[0.15rem] border-[#d4dce5] bg-[#fbfcfd]"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium text-slate-800">
            Content
          </label>
          <Textarea
            id="content"
            name="content"
            value={formState.content}
            onChange={(event) => setFormState((current) => ({ ...current, content: event.target.value }))}
            placeholder="Write the body of your note"
            className="min-h-[260px] rounded-[0.9rem_0.2rem_0.2rem_0.9rem] border-[#d4dce5] bg-[#fbfcfd]"
            required
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting} className="rounded-[0.15rem] border border-[#bdd2df] bg-[#dbe8f1] px-6 text-[#274256] hover:bg-[#cfdfeb]">
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {selectedNote ? "Save changes" : "Create note"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={onCancelEdit}
          className="rounded-[0.85rem_0.15rem_0.85rem_0.15rem] border border-[#e1d6cb] bg-[#faf3ea] text-[#705d4f]"
        >
          <PencilLine className="mr-2 h-4 w-4" />
          New draft
        </Button>
      </div>
    </form>
  );
};
