import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { calendarRouter } from "./routes/calendarRoutes.js";
import { noteRouter } from "./routes/noteRoutes.js";
import { widgetRouter } from "./routes/widgetRoutes.js";


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

app.use("/api/calendar", calendarRouter);
app.use("/api/notes", noteRouter);
app.use("/api/widgets", widgetRouter);

