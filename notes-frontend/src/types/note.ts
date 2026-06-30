export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
};

export type NotePayload = {
  title: string;
  content: string;
  isPinned?: boolean;
};
