import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IFollowService } from "@/domain/interface/service/follow.interface";
import { FollowTypeEnum } from "@/domain/enum/user.enum";
import { Follow } from "@/domain/entities/follow.entity";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { followSuccess } from "@/domain/messages/success/follow.message";

@injectable()
export class FollowController {
  constructor(
    @inject("FollowService")
    private followService: IFollowService
  ) {}

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const query = request.query as any;
    const { credentials: user } = request.auth as any;

    let users: Array<Follow>;

    switch (query.type) {
      case FollowTypeEnum.FOLLOWER:
        users = await this.followService.getFollowers(
          user.userId,
          query.createdAt
        );
        break;
      case FollowTypeEnum.FOLLOWING:
        users = await this.followService.getFollowings(
          user.userId,
          query.createdAt
        );
        break;
      default:
        throw new UnprocessableEntityError(
          `${query.type} query perameter is not supported`
        );
    }

    return h
      .response({
        statusCode: 200,
        data: users,
        message:
          query.type === FollowTypeEnum.FOLLOWER
            ? followSuccess.SENT_FOLLOWERS
            : followSuccess.SENT_FOLLOWINGS,
      })
      .code(200);
  }

  async create(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const follow = await this.followService.create(
      user.userId,
      body.followedId
    );

    return h
      .response({
        statusCode: 201,
        data: follow,
        message: "followed successFully",
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const deletedFollow = await this.followService.delete(
      user.userId,
      body.followedId
    );

    return h
      .response({
        statusCode: 201,
        data: deletedFollow,
        message: "unfollowed successFully",
      })
      .code(201);
  }
}
