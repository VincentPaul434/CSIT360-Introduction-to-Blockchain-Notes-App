import { Router } from "express";

import { weatherController } from "../controllers/weatherController.js";

export const widgetRouter = Router();

widgetRouter.get("/weather", weatherController.getCurrent);
