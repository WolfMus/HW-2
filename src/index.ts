import express from "express";
import { setupApp } from "./setup-app";
import 'dotenv/config'
import { SETTINGS } from "./core/settings/settings";
import { runDb } from "./db/mongo.db";
 
const bootstrap = async () => {
  const app = express();
  setupApp(app);
  const PORT = SETTINGS.PORT;

  await runDb(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  return app;
}

bootstrap();