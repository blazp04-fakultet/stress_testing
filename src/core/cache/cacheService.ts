import { assertEquals } from "@std/assert/equals";
import redisClient from "./client.ts";

export const setCache = async (key: string, value: string) => {
  const reply = await redisClient.sendCommand(["SET", key, value]);
  assertEquals(reply, "OK");
};

export const getCache = async (key: string) => {
  const reply = await redisClient.sendCommand(["GET", key]);
  if (reply === null) {
    //TODO: Dodati logiku da povuče iz baze
    // getCache(key);
  }
  return reply;
};

export const deleteCache = async (key: string) => {
  const reply = await redisClient.sendCommand(["DEL", key]);
  assertEquals(reply, 1);
};

export const flushCache = async () => {
  const reply = await redisClient.sendCommand(["FLUSHDB"]);
  assertEquals(reply, "OK");
};
