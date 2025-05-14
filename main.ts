// main.ts
import { startServer } from "./src/server.ts";
import "./src/core/db/client.ts";
import "./src/core/cache/client.ts";

console.log("Starting application...");
await startServer();
console.log("Application started.");
