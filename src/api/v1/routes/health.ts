import { Router } from "@oak/oak";
import * as healthHandlers from "../handlers/healthHandlers.ts";

const healthRouter = new Router({ prefix: "/health" });

healthRouter.post("/", healthHandlers.postHealth);

export default healthRouter;
