import { Router } from "@oak/oak";
import { apiKeyAuthMiddleware } from "../../../core/auth/apiKeyAuth.ts";
import healthRouter from "./health.ts";
import { jwtAuthMiddleware } from "../../../core/auth/jwtAuth.ts";
import newsRouter from "./news.ts";

// Koristi se za komunikaciju baze i apija
const privateRouter = new Router({ prefix: "/api/v1/private" });
privateRouter.use(apiKeyAuthMiddleware);
privateRouter.use(healthRouter.routes(), healthRouter.allowedMethods());

// Koristi se za komunikaciju aplikacije i apija
const publicRouter = new Router({ prefix: "/api/v1" });
publicRouter.use(newsRouter.routes(), newsRouter.allowedMethods());

// Samo spaja ova dva rutera da bude lakše
const v1Router = new Router();
v1Router.use(privateRouter.routes(), privateRouter.allowedMethods());
v1Router.use(publicRouter.routes(), publicRouter.allowedMethods());

export default v1Router;
