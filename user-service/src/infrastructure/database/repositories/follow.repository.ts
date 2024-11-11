import { injectable } from "tsyringe";
import { Follow } from "@/domain/entities/follow.entity";
import { FollowModel } from "@/infrastructure/database/models/follow.model";
import { NotFoundError } from "@/domain/errors/app-errors";
import { IFollowRepository } from "@/domain/interface/repositories/follow.interface";
import { userProjection } from "@/infrastructure/database/repositories/projections/user.projection";

@injectable()
export class FollowRepository implements IFollowRepository {
  async getFollowers(
    userId: string,
    limit: number = 10,
    createdAt?: Date
  ): Promise<Follow[]> {
    const followers = await FollowModel.find({
      followedId: userId,
      ...(createdAt && { createdAt: { $lt: createdAt } }),
    })
      .limit(limit)
      .populate("followerId", userProjection);

    if (!followers.length) {
      throw new NotFoundError("followers not found!!");
    }

    return followers;
  }

  async getFollowings(
    userId: string,
    limit: number = 10,
    createdAt?: Date
  ): Promise<Follow[]> {
    const followings = await FollowModel.find({
      followerId: userId,
      ...(createdAt && { createdAt: { $lt: createdAt } }),
    })
      .limit(limit)
      .populate("followerId", userProjection);

    if (!followings.length) {
      throw new NotFoundError("followers not found!!");
    }

    return followings;
  }

  async getFollowingsIds(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<string[]> {
    const followings = await FollowModel.find(
      {
        followerId: userId,
        ...(createdAt && { createdAt: { $lt: createdAt } }),
      },
      { followedId: 1, _id: 0 }
    )
      .limit(limit)
      .lean();

    if (!followings.length) {
      throw new NotFoundError("followers not found!!");
    }

    const followingIds = followings.map((obj) => obj.followedId);

    return followingIds;
  }

  create(follow: Follow): Promise<Follow> {
    return FollowModel.create(follow);
  }

  async delete(followerId: string, followedId: string): Promise<Follow> {
    const deletedFollow = await FollowModel.findOneAndDelete({
      followerId,
      followedId,
    });

    if (!deletedFollow) {
      throw new NotFoundError("followed user not found!!");
    }

    return deletedFollow;
  }

  async deleteAll(followerId: string): Promise<void> {
    await FollowModel.deleteMany({ followerId });
  }
}
