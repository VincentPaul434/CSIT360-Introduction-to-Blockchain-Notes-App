import "dotenv/config";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { initializeDatabase } from "./services/db.js";

await initializeDatabase();

app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
