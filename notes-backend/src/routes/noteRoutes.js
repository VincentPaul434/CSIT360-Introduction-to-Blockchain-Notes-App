import { Router } from "express";

import { noteController } from "../controllers/noteController.js";

export const noteRouter = Router();

noteRouter.get("/", noteController.list);
noteRouter.get("/:id", noteController.getById);
noteRouter.post("/", noteController.create);
noteRouter.put("/:id", noteController.update);
noteRouter.delete("/:id", noteController.remove);
