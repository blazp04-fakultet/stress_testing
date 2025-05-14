import { Router } from "@oak/oak";
import * as userHandlers from "../handlers/userHandlers.ts";
import { apiKeyAuthMiddleware } from "../../../core/auth/apiKeyAuth.ts";

const userRouter = new Router({ prefix: "/users" });

userRouter.get("/", apiKeyAuthMiddleware, userHandlers.getAllUsers);

export default userRouter;
