import { useEffect, useState } from "react";

import { notesApi } from "../api/notes";
import type { Note, NotePayload } from "../types/note";

type NotesState = {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
};

const initialState: NotesState = {
  notes: [],
  isLoading: true,
  error: null,
};

export const useNotes = () => {
  const [state, setState] = useState<NotesState>(initialState);

  const loadNotes = async (): Promise<void> => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const notes = await notesApi.getAll();

      // ✅ SORT PINNED FIRST
      const sorted = [...notes].sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });

      setState({ notes: sorted, isLoading: false, error: null });
    } catch (error) {
      setState({
        notes: [],
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load notes.",
      });
    }
  };

  useEffect(() => {
    void loadNotes();
  }, []);

  const createNote = async (payload: NotePayload): Promise<void> => {
    const createdNote = await notesApi.create({
      ...payload,
      isPinned: false, 
    });

    setState((current) => {
      const updated = [createdNote, ...current.notes];

      return {
        ...current,
        notes: sortNotes(updated),
      };
    });
  };

  const updateNote = async (id: string, payload: NotePayload): Promise<void> => {
    const updatedNote = await notesApi.update(id, payload);

    setState((current) => {
      const updated = current.notes.map((note) =>
        note.id === id ? updatedNote : note
      );

      return {
        ...current,
        notes: sortNotes(updated),
      };
    });
  };

  const deleteNote = async (id: string): Promise<void> => {
    await notesApi.remove(id);

    setState((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== id),
    }));
  };

  // ✅ PIN TOGGLE (API + UI)
  const togglePin = async (id: string): Promise<void> => {
    const note = state.notes.find((n) => n.id === id);
    if (!note) return;

    const updatedNote = await notesApi.update(id, {
      title: note.title,
      content: note.content,
      isPinned: !note.isPinned, 
    });

    setState((current) => {
      const updated = current.notes.map((n) =>
        n.id === id ? updatedNote : n
      );

      return {
        ...current,
        notes: sortNotes(updated),
      };
    });
  };

  // ✅ HELPER
  const sortNotes = (notes: Note[]) => {
    return [...notes].sort((a, b) => {
      if (a.isPinned === b.isPinned) return 0;
      return a.isPinned ? -1 : 1;
    });
  };

  return {
    ...state,
    reload: loadNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
  };
};