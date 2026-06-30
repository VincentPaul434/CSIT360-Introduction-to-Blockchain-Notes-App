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
  setIsDirty: (value: boolean) => void; // ✅ NEW
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
  setIsDirty,
}: NoteFormProps) => {
  const [formState, setFormState] = useState<NotePayload>(emptyForm);
  const [originalState, setOriginalState] = useState<NotePayload>(emptyForm);

  // Load note
  useEffect(() => {
    if (!selectedNote) {
      setFormState(emptyForm);
      setOriginalState(emptyForm);
      return;
    }

    const data = {
      title: selectedNote.title,
      content: selectedNote.content,
    };

    setFormState(data);
    setOriginalState(data);
  }, [selectedNote]);

  // Detect dirty state
  useEffect(() => {
    const dirty =
      formState.title !== originalState.title ||
      formState.content !== originalState.content;

    setIsDirty(dirty);
  }, [formState, originalState, setIsDirty]);

  // Protect refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isDirty =
        formState.title !== originalState.title ||
        formState.content !== originalState.content;

      if (!isDirty) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formState, originalState]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const wasCreating = !selectedNote;

    await onSubmit(formState);

    if (wasCreating) {
      setFormState(emptyForm);
      setOriginalState(emptyForm);
    }
  };

  // ✅ NEW DRAFT WITH CONFIRM
  const handleNewDraft = () => {
    const isDirty =
      formState.title !== originalState.title ||
      formState.content !== originalState.content;

    if (isDirty) {
      const confirmLeave = window.confirm("Discard current changes?");
      if (!confirmLeave) return;
    }

    onCancelEdit();
  };

  return (
    <form className="rounded-[1rem_0.2rem_0.2rem_1rem] border border-[#d4dce5] bg-white p-6 shadow-card" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#b9ad9a]">Editor</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            {selectedNote ? "Update note" : "Create note"}
          </h3>
        </div>

        <div className="flex items-center gap-2 rounded border border-[#e1d6cb] bg-[#faf3ea] px-3 py-2 text-xs text-[#7a6554]">
          <Clock3 className="h-3.5 w-3.5" />
          {selectedNote ? "Existing draft" : "Unsaved draft"}
        </div>
      </div>

      <Separator className="my-5 bg-[#f2eadf]" />

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-800">Title</label>
          <Input
            value={formState.title}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800">Content</label>
          <Textarea
            value={formState.content}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, content: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {selectedNote ? "Save changes" : "Create note"}
        </Button>

        <Button type="button" variant="secondary" onClick={handleNewDraft}>
          <PencilLine className="mr-2 h-4 w-4" />
          New draft
        </Button>
      </div>
    </form>
  );
};