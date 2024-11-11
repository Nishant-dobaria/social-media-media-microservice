import { inject, injectable } from "tsyringe";
import { IFollowRepository } from "@/domain/interface/repositories/follow.interface";
import { Follow } from "@/domain/entities/follow.entity";
import { IFollowService } from "@/domain/interface/service/follow.interface";

@injectable()
export class FollowService implements IFollowService {
  constructor(
    @inject("FollowRepository")
    private followRepository: IFollowRepository
  ) {}

  create(followerId: string, followedId: string): Promise<Follow> {
    const follow = new Follow(followerId, followedId);
    return this.followRepository.create(follow);
  }

  getFollowers(userId: string, createdAt?: Date): Promise<Follow[]> {
    return this.followRepository.getFollowers(userId, 10, createdAt);
  }

  getFollowingsIds(userId: string, createdAt?: Date): Promise<string[]> {
    return this.followRepository.getFollowingsIds(userId, 0, createdAt);
  }

  getFollowings(userId: string, createdAt?: Date): Promise<Follow[]> {
    return this.followRepository.getFollowings(userId, 10, createdAt);
  }

  delete(followerId: string, followedId: string): Promise<Follow> {
    return this.followRepository.delete(followerId, followedId);
  }

  deleteAll(followerId: string): Promise<void> {
    return this.followRepository.deleteAll(followerId);
  }
}
