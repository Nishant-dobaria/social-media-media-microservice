import { container } from "tsyringe";
import { ReqRefDefaults, Server, ServerRoute } from "@hapi/hapi";
import { FollowController } from "@/api/controllers/follow.controller";
import {
  createfollowValidator,
  deletefollowValidator,
  getFollowValidator,
} from "@/api/validators/follow.validator";

const baseUrl = "/api/user/follow";

const followController =
  container.resolve<FollowController>("FollowController");

const followRoutes: Array<ServerRoute<ReqRefDefaults>> = [
  {
    method: "GET",
    path: `${baseUrl}`,
    options: {
      validate: {
        query: getFollowValidator,
      },
    },
    handler: followController.get.bind(followController),
  },
  {
    method: "POST",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: createfollowValidator,
      },
    },
    handler: followController.create.bind(followController),
  },
  {
    method: "DELETE",
    path: `${baseUrl}`,
    options: {
      validate: {
        payload: deletefollowValidator,
      },
    },
    handler: followController.delete.bind(followController),
  },
];

export default {
  name: "follow-routes",
  version: "1.0.0",
  register: async (server: Server) => {
    for (const route of followRoutes) {
      server.route(route);
    }
  },
};
