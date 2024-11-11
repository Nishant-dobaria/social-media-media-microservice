import { injectable } from "tsyringe";
import { ProjectionFields, QueryOptions } from "mongoose";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { User } from "@/domain/entities/user";
import { getObjectId, getObjectIds } from "@/domain/helpers/util";
import { UserModel } from "@/infrastructure/database/models/user.model";
import { IUserRepository } from "@/domain/interface/repositories/user.interface";
import { Session } from "@/domain/entities/session.entiry";
import { userError } from "@/domain/messages/error/user.error";
import { userProjection } from "@/infrastructure/database/repositories/projections/user.projection";

@injectable()
export class UserRepository implements IUserRepository {
  async get({
    limit = 0,
    createdAt,
    userIds,
    excludeUserIds,
  }: {
    limit: number;
    createdAt?: Date;
    userIds: Array<string>;
    excludeUserIds?: Array<string>;
  }): Promise<User[]> {
    const query: QueryOptions = {};

    if (userIds?.length) {
      const userObjectIds = getObjectIds(userIds);
      query["_id"] = { $in: userObjectIds };
    }

    if (excludeUserIds?.length) {
      const userObjectIds = getObjectIds(excludeUserIds);
      query["_id"] = { $nin: userObjectIds };
    }

    if (createdAt) {
      query["createdAt"] = { $lt: createdAt };
    }

    const users = await UserModel.find(query, userProjection)
      .limit(limit || userIds.length)
      .sort({ createdAt: "descending" })
      .lean();

    if (!users.length) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return users;
  }

  async getOne({
    email,
    userId,
    userName,
  }: {
    email?: string;
    userId?: string;
    userName?: string;
  }): Promise<User> {
    if (!userId && !email && !userName) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const query: QueryOptions = {};

    if (userId) {
      const userObjectId = getObjectId(userId);
      query["_id"] = userObjectId;
    }
    if (email) {
      query["email"] = email;
    }
    if (userName) {
      query["userName"] = userName;
    }

    const user = await UserModel.findOne(query).lean();

    if (!user) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return user;
  }

  async updateFollowersCount(userId: string, count: number = 1): Promise<User> {
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { followersCount: count },
        $max: { followersCount: 0 },
      },
      { new: true }
    ).lean();

    if (!user) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return user;
  }

  async updateFollowingsCount(
    userId: string,
    count: number = 1
  ): Promise<User> {
    const userObjectId = getObjectId(userId);
    const user = await UserModel.findOneAndUpdate(
      { _id: userObjectId },
      {
        $inc: { followingCount: count },
        $max: { followingCount: 0 },
      },
      { new: true }
    ).lean();

    if (!user) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return user;
  }

  async updatePostCount(userId: string, count: number = 1): Promise<User> {
    const userObjectId = getObjectId(userId);

    const user = await UserModel.findOneAndUpdate(
      { _id: userObjectId },
      {
        $inc: { postCount: count },
        $max: { postCount: 0 },
      },
      { new: true }
    ).lean();

    if (!user) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return user;
  }

  async checkUserExist(email?: string, userName?: string): Promise<Boolean> {
    if (!userName && !email) {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const query: QueryOptions = {
      $or: [],
    };

    const projection: ProjectionFields<User> = {};

    projection["_id"] = 0;

    if (email) {
      query.$or.push({ email });
      projection["email"] = 1;
    }

    if (userName) {
      query.$or.push({ userName });
      projection["userName"] = 1;
    }

    const user = await UserModel.findOne(query, projection).lean();

    if (user) {
      return true;
    }

    return false;
  }

  create(user: User): Promise<User> {
    return UserModel.create(user);
  }

  async update(userId: string, updateUser: Partial<User>): Promise<User> {
    if (updateUser?.userName) {
      const isExist = await this.checkUserExist(
        undefined,
        updateUser?.userName
      );

      if (isExist) {
        throw new ConflictError(userError.ALREADY_EXIST);
      }
    }

    const userObjectId = getObjectId(userId);

    const user = await UserModel.findOneAndUpdate(
      { _id: userObjectId },
      updateUser,
      {
        new: true,
      }
    ).lean();

    if (!user) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return user;
  }

  async addSession(userId: string, session: Session): Promise<User> {
    const userObjectId = getObjectId(userId);
    const user = await UserModel.findOneAndUpdate(
      { _id: userObjectId },
      { $push: { sessions: { $each: [session], $slice: -6 } } },
      {
        new: true,
      }
    ).lean();

    if (!user) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return user;
  }

  async removeSession(userId: string, sessionId: string): Promise<User> {
    const userObjectId = getObjectId(userId);
    const sessionObjectId = getObjectId(sessionId);

    const user = await UserModel.findOneAndUpdate(
      { _id: userObjectId },
      {
        $pull: { sessions: { _id: sessionObjectId } },
      },
      { new: true }
    ).lean();

    if (!user) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return user;
  }

  async delete({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }): Promise<User> {
    const query: QueryOptions = {};

    if (email) {
      query["email"] = email;
    } else if (userId) {
      query["userId"] = getObjectId(userId);
    } else {
      throw new UnprocessableEntityError(userError.GET_PROFILE_QUEARY);
    }

    const deletedUser = await UserModel.findOneAndDelete(query).lean();

    if (!deletedUser) {
      throw new NotFoundError(userError.NOT_EXIST);
    }

    return deletedUser;
  }
}
