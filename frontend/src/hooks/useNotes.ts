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
      setState({ notes, isLoading: false, error: null });
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
    const createdNote = await notesApi.create(payload);

    setState((current) => ({
      ...current,
      notes: [createdNote, ...current.notes],
    }));
  };

  const updateNote = async (id: string, payload: NotePayload): Promise<void> => {
    const updatedNote = await notesApi.update(id, payload);

    setState((current) => ({
      ...current,
      notes: current.notes.map((note) => (note.id === id ? updatedNote : note)),
    }));
  };

  const deleteNote = async (id: string): Promise<void> => {
    await notesApi.remove(id);

    setState((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== id),
    }));
  };

  return {
    ...state,
    reload: loadNotes,
    createNote,
    updateNote,
    deleteNote,
  };
};
