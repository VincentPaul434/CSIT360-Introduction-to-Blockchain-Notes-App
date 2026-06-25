import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { noteRouter } from "./routes/noteRoutes.js";

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  }),
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api/notes", noteRouter);
