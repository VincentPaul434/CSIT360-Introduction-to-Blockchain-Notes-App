import { noteService } from "../services/noteService.js";

const getId = (request) => String(request.params.id);

const parseCreateInput = (request) => {
  const { title, content } = request.body ?? {};

  if (typeof title !== "string" || typeof content !== "string") {
    return null;
  }

  return { title, content };
};

const parseUpdateInput = (request) => {
  const { title, content } = request.body ?? {};

  if (title !== undefined && typeof title !== "string") {
    return null;
  }

  if (content !== undefined && typeof content !== "string") {
    return null;
  }

  if (title === undefined && content === undefined) {
    return null;
  }

  return { title, content };
};

export const noteController = {
  async list(_request, response) {
    const notes = await noteService.getAll();
    response.status(200).json(notes);
  },

  async getById(request, response) {
    const note = await noteService.getById(getId(request));

    if (!note) {
      response.status(404).json({ message: "Note not found." });
      return;
    }

    response.status(200).json(note);
  },

  async create(request, response) {
    const input = parseCreateInput(request);

    if (!input) {
      response.status(400).json({ message: "title and content are required strings." });
      return;
    }

    const note = await noteService.create(input);
    response.status(201).json(note);
  },

  async update(request, response) {
    const input = parseUpdateInput(request);

    if (!input) {
      response.status(400).json({ message: "Provide title or content as strings." });
      return;
    }

    const note = await noteService.update(getId(request), input);

    if (!note) {
      response.status(404).json({ message: "Note not found." });
      return;
    }

    response.status(200).json(note);
  },

  async remove(request, response) {
    const removed = await noteService.remove(getId(request));

    if (!removed) {
      response.status(404).json({ message: "Note not found." });
      return;
    }

    response.status(204).send();
  },
};
