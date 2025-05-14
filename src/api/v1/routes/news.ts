import { Router } from "@oak/oak";
import * as newsHandler from "../handlers/newsHandler.ts";

const newsRouter = new Router({ prefix: "/news" });
newsRouter.post("/", newsHandler.postNewsDetails);

export default newsRouter;
