import { query, dbEnabled } from "./db.js";

const now = () => new Date().toISOString();
const createId = () => crypto.randomUUID();

let notes = [
  {
    id: createId(),
    title: "Welcome note",
    content: "Your Notes CRUD API is connected.",
    createdAt: now(),
    updatedAt: now(),
  },
];

const sortByUpdatedAtDesc = (items) =>
  [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

const mapDbRow = (row) => ({
  id: row.id,
  title: row.title,
  content: row.content,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

export const noteService = {
  async getAll() {
    if (dbEnabled) {
      const result = await query(
        "SELECT id, title, content, created_at, updated_at FROM notes ORDER BY updated_at DESC",
      );
      return result.rows.map(mapDbRow);
    }

    return sortByUpdatedAtDesc(notes);
  },

  async getById(id) {
    if (dbEnabled) {
      const result = await query(
        "SELECT id, title, content, created_at, updated_at FROM notes WHERE id = $1 LIMIT 1",
        [id],
      );
      return result.rows.length ? mapDbRow(result.rows[0]) : null;
    }

    return notes.find((note) => note.id === id) ?? null;
  },

  async create(input) {
    if (dbEnabled) {
      const id = createId();
      const result = await query(
        "INSERT INTO notes (id, title, content, created_at, updated_at) VALUES ($1, $2, $3, now(), now()) RETURNING id, title, content, created_at, updated_at",
        [id, input.title.trim(), input.content.trim()],
      );
      return mapDbRow(result.rows[0]);
    }

    const timestamp = now();
    const note = {
      id: createId(),
      title: input.title.trim(),
      content: input.content.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    notes = [note, ...notes];
    return note;
  },

  async update(id, input) {
    if (dbEnabled) {
      const existing = await this.getById(id);
      if (!existing) {
        return null;
      }

      const title = input.title?.trim() ?? existing.title;
      const content = input.content?.trim() ?? existing.content;
      const result = await query(
        "UPDATE notes SET title = $1, content = $2, updated_at = now() WHERE id = $3 RETURNING id, title, content, created_at, updated_at",
        [title, content, id],
      );

      return result.rows.length ? mapDbRow(result.rows[0]) : null;
    }

    const existingNote = await this.getById(id);
    if (!existingNote) {
      return null;
    }

    const updatedNote = {
      ...existingNote,
      title: input.title?.trim() ?? existingNote.title,
      content: input.content?.trim() ?? existingNote.content,
      updatedAt: now(),
    };

    notes = notes.map((note) => (note.id === id ? updatedNote : note));
    return updatedNote;
  },

  async remove(id) {
    if (dbEnabled) {
      const result = await query("DELETE FROM notes WHERE id = $1", [id]);
      return result.rowCount > 0;
    }

    const initialLength = notes.length;
    notes = notes.filter((note) => note.id !== id);
    return notes.length < initialLength;
  },
};
