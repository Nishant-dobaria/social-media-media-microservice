import { Follow } from "@/domain/entities/follow.entity";

export interface IFollowRepository {
  getFollowers(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<Follow[]>;

  getFollowings(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<Follow[]>;

  getFollowingsIds(
    userId: string,
    limit: number,
    createdAt?: Date
  ): Promise<string[]>;

  create(follow: Follow): Promise<Follow>;

  delete(followerId: string, followedId: string): Promise<Follow>;

  deleteAll(followerId: string): Promise<void>;
}
