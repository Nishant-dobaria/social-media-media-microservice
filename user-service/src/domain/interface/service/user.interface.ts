import { User } from "@/domain/entities/user";
import { UserTypeEnum } from "@/domain/enum/user.enum";

export interface IUserService {
  get({
    userIds,
    excludeUserIds,
    createdAt,
  }: {
    userIds?: Array<string>;
    excludeUserIds?: Array<string>;
    createdAt?: Date;
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

  create(user: User, profilePicture?: any): Promise<User>;

  login(email: string, password: string): Promise<User>;

  loginGoogle(email: string): Promise<User | null>;

  signUpGoogle({
    email,
    userName,
    userType,
  }: {
    email: string;
    userName: string;
    userType: UserTypeEnum;
  }): Promise<User>;

  update(userId: string, user: Partial<User>): Promise<User>;

  incrementFollowerCount(userId: string): Promise<User>;

  incrementFollowingCount(userId: string): Promise<User>;

  decrementFollowerCount(userId: string): Promise<User>;

  decrementFollowingCount(userId: string): Promise<User>;

  delete({ email, userId }: { email?: string; userId?: string }): Promise<User>;

  isUser(email: string, userName?: string): Promise<Boolean>;
}
