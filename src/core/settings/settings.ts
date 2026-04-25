import dotenv from "dotenv";
dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  // MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/localhost",
  MONGO_URL:
    process.env.MONGO_URL ||
    "mongodb://MrSevere:qwertyadmin@ac-4suh2hg-shard-00-00.rtpcxjn.mongodb.net:27017,ac-4suh2hg-shard-00-01.rtpcxjn.mongodb.net:27017,ac-4suh2hg-shard-00-02.rtpcxjn.mongodb.net:27017/?ssl=true&replicaSet=atlas-sa4lbn-shard-0&authSource=admin&appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "localhost",
  JWT_SECRET: "123",
};

console.log(process.env.MONGO_URL);
