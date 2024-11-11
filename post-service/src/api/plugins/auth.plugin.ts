import {
  Request,
  ResponseToolkit,
  Server,
  ServerApplicationState,
} from "@hapi/hapi";
import { env } from "@/config/env";
import { networkRequest } from "@/domain/helpers/networkRequest";
import { apiUrl } from "@/config/api.url";

export default {
  name: "auth-strategy",
  register: async (server: Server<ServerApplicationState>) => {
    server.auth.strategy("jwt", "jwt", {
      key: env.JWT_PUBLIC_KEY,
      validate: async (decoded: any, request: Request, h: ResponseToolkit) => {
        try {
          const user = await networkRequest(
            "GET",
            apiUrl.USER_PROFILE,
            {},
            {},
            { userId: decoded.userId }
          );

          //@ts-ignore
          if (!user || !user?.sessions?.includes(request?.auth?.token)) {
            return { isValid: false };
          }

          return { isValid: true, credentials: user };
        } catch (error) {
          console.error("JWT validation error:", error);
          return { isValid: false };
        }
      },
    });

    server.auth.default("jwt");
  },
};
