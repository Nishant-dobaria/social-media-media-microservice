import { Follow } from "@/domain/entities/follow.entity";

export interface IFollowService {
  create(followerId: string, followedId: string): Promise<Follow>;

  getFollowers(userId: string, createdAt?: Date): Promise<Follow[]>;

  getFollowings(userId: string, createdAt?: Date): Promise<Follow[]>;

  getFollowingsIds(userId: string, createdAt?: Date): Promise<string[]>;

  delete(followerId: string, followedId: string): Promise<Follow>;

  deleteAll(followerId: string): Promise<void>;
}
