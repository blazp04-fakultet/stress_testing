import { type Context } from "@oak/oak";
import { HealthCheckDTO } from "../../../core/models/dto/healthModel.ts";
import { healthService } from "../../../server.ts";
import { Console } from "node:console";

export const postHealth = async (ctx: Context) => {
  try {
    const forwarded = ctx.request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0].trim() || ctx.request.ip;

    const droneId = ctx.request.headers.get("X-API-KEY");
    if (!droneId) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Unauthorized: Missing API Key" };
      return;
    }

    const requestBody = ctx.request.body;
    const body: HealthCheckDTO = await requestBody.json();
    if (!body) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid request body" };
      return;
    }

    const missionStatus = body.status;

    if (!missionStatus) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid request body" };
      return;
    }

    healthService.healthCheck(droneId, ip, missionStatus);

    ctx.response.status = 200;
    ctx.response.body = { message: "OK" };
    ctx.response.type = "json";
  } catch (e) {
    console.log(e);
  }
};
