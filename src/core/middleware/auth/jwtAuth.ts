import { Context } from "@oak/oak";
import { verify } from "jsr:@wok/djwt";
import { config } from "../../config/mod.ts";

export const jwtAuthMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Missing or invalid JWT" };
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret: string = config.superbaseSecret;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    await verify(token, cryptoKey);

    await next();
  } catch (_) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Invalid JWT" };
    return;
  }
};
