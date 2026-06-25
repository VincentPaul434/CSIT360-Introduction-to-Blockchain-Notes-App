import type { Note, NotePayload } from "../types/note";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/notes";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "API request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const notesApi = {
  getAll(): Promise<Note[]> {
    return request<Note[]>("");
  },

  create(payload: NotePayload): Promise<Note> {
    return request<Note>("", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: NotePayload): Promise<Note> {
    return request<Note>(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  remove(id: string): Promise<void> {
    return request<void>(`/${id}`, {
      method: "DELETE",
    });
  },
};
