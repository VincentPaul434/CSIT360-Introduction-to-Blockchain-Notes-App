import { Router } from "express";

import { calendarController } from "../controllers/calendarController.js";

export const calendarRouter = Router();

calendarRouter.get("/holidays", calendarController.getHolidays);
