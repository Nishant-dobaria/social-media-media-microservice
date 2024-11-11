import { Session } from "@/domain/entities/session.entiry";
import { User } from "@/domain/entities/user";

export interface IUserRepository {
  get({
    limit,
    createdAt,
    userIds,
    excludeUserIds,
  }: {
    limit: number;
    createdAt?: Date;
    userIds?: Array<string>;
    excludeUserIds?: Array<string>;
  }): Promise<User[]>;

  getOne({
    email,
    userId,
    userName,
  }: {
    email?: string;
    userId?: string;
    userName?: string;
  }): Promise<User>;

  updateFollowersCount(userId: string, count: number): Promise<User>;

  updateFollowingsCount(userId: string, count: number): Promise<User>;

  updatePostCount(userId: string, count: number): Promise<User>;

  checkUserExist(email?: string, userName?: string): Promise<Boolean>;

  create(user: User): Promise<User>;

  update(userId: string, updateUser: Partial<User>): Promise<User>;

  addSession(userId: string, session: Session): Promise<User>;

  removeSession(userId: string, sessionId: string): Promise<User>;

  delete({ userId, email }: { userId?: string; email?: string }): Promise<User>;
}
