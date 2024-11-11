import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import container from "dependency/container";
import {
  getUserProfileValidator,
  getUsersValidator,
  loginValidator,
  userSignUpValidator,
  userUpdateValidator,
} from "@/api/validators/user.validator";
import { UserController } from "@/api/controllers/user.controller";

const baseUrl = "/api/user";

const userController = container.resolve<UserController>("UserController");

const userRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getUserProfileValidator,
      },
    },
    handler: userController.profile.bind(userController),
  },
  {
    method: "GET",
    path: `${baseUrl}/suggest`,
    handler: userController.getSuggestedUsers.bind(userController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: getUsersValidator,
      },
    },
    handler: userController.get.bind(userController),
  },
  {
    method: "POST",
    path: `${baseUrl}/sign-up`,
    options: {
      validate: {
        payload: userSignUpValidator,
      },
      auth: false,
    },
    handler: userController.signUp.bind(userController),
  },
  {
    method: "POST",
    path: `${baseUrl}/login`,
    options: {
      validate: {
        payload: loginValidator,
      },
      auth: false,
    },
    handler: userController.login.bind(userController),
  },
  {
    method: "PATCH",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: userUpdateValidator,
      },
    },
    handler: userController.update.bind(userController),
  },
];

export default {
  name: "user-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of userRoutes) {
      server.route(route);
    }
  },
};
