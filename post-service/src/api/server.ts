import Hapi from "@hapi/hapi";
import JWT2 from "hapi-auth-jwt2";
import authPlugin from "@/api/plugins/auth.plugin";
import { ValidationError } from "joi";
import { AppError } from "@/domain/errors/app-errors";
import { env } from "@/config/env";

export async function registerServer() {
  const routes = [JWT2, authPlugin];

  const server = Hapi.server({
    port: env.PORT,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        allow: ["multipart/form-data", "application/json"],
        maxBytes: 25 * 1024 * 1024,
        timeout: false,
      },
    },
  });

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response instanceof ValidationError) {
      const validationErrorString = response.details
        .map((detail) => `${detail?.context?.label}: ${detail.message}`)
        .join(", ");
      return h
        .response({
          statusCode: 400,
          error: response.name,
          message: validationErrorString,
        })
        .code(400)
        .takeover();
    }

    if (response instanceof AppError) {
      return h
        .response({
          statusCode: response.statusCode,
          error: response.name,
          message: response.message,
        })
        .code(response.statusCode)
        .takeover();
    }

    return h.continue;
  });

  for (const route of routes) {
    //@ts-ignore
    await server.register(route);
  }

  return server;
}
