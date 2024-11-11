import { inject, injectable } from "tsyringe";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "@/domain/errors/app-errors";
import { AuthTypeEnum, UserTypeEnum } from "@/domain/enum/user.enum";
import { IUserRepository } from "@/domain/interface/repositories/user.interface";
import { User } from "@/domain/entities/user";
import { IAuthService } from "@/domain/interface/service/auth.interface";
import { JwtPayload } from "@/domain/entities/jwt.entity";
import { Session } from "@/domain/entities/session.entiry";
import { IUserService } from "@/domain/interface/service/user.interface";
import { IOtpService } from "../interface/service/otp.interface";
import { userError } from "../messages/error/user.error";
import { generateUserName } from "../helpers/generateUserName";
import { otpError } from "../messages/error/otp.error";
import { IStorageRepository } from "../interface/repositories/storage.interface";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("AuthService")
    private authService: IAuthService,
    @inject("OtpService")
    private otpService: IOtpService,
    @inject("StorageRepository")
    private storageRepository: IStorageRepository
  ) {}

  get({
    userIds,
    excludeUserIds,
    createdAt,
  }: {
    userIds?: Array<string>;
    excludeUserIds?: Array<string>;
    createdAt?: Date;
  }): Promise<User[]> {
    const limit = 20;
    return this.userRepository.get({
      limit,
      createdAt,
      userIds,
      excludeUserIds,
    });
  }

  getOne({
    email,
    userId,
    userName,
  }: {
    email?: string;
    userId?: string;
    userName?: string;
  }): Promise<User> {
    return this.userRepository.getOne({ email, userId, userName });
  }

  async loginGoogle(email: string): Promise<User | null> {
    const user = await this.userRepository.getOne({ email });

    if (!user || !user._id || user.authType !== AuthTypeEnum.GOOGLE) {
      return null;
    }

    const tokenPayload = new JwtPayload(
      user._id as string,
      user.email,
      user.authType
    );

    const sessionToken = this.authService.createSessionToken(tokenPayload);

    const session = new Session(sessionToken);

    session._id = tokenPayload.sessionId;

    const userWithSession = await this.userRepository.addSession(
      user._id,
      session
    );

    return userWithSession;
  }

  async signUpGoogle({
    email,
    userName,
    userType,
  }: {
    email: string;
    userName: string;
    userType: UserTypeEnum;
  }): Promise<User> {
    const validUserName = generateUserName(userName);

    const user = new User(email, validUserName);

    user.type = userType;

    user.authType = AuthTypeEnum.GOOGLE;

    const newUser = await this.create(user);

    return newUser;
  }

  async create(user: User, profilePicture?: any): Promise<User> {
    const isExist = await this.isUser(user.email, user.userName);

    if (isExist) {
      throw new ConflictError(userError.ALREADY_EXIST);
    }

    if (profilePicture) {
      const [profileUrl] = await this.storageRepository.uploadFiles([
        profilePicture,
      ]);
      user.profilePicture = profileUrl;
    }

    if (user.authType === AuthTypeEnum.LOCAL) {
      if (!user.password) {
        throw new UnprocessableEntityError(userError.PASSWORD_REQURED);
      }

      const isOtpVerified = await this.otpService.isVerified(user.email);

      if (!isOtpVerified) {
        throw new UnprocessableEntityError(otpError.NOT_EXIST);
      }

      const encryptedPassword = this.authService.encryptPassword(user.password);

      user.password = encryptedPassword;
    }

    const tokenPayload = new JwtPayload(
      user._id as string,
      user.email,
      user.authType
    );

    const sessionToken = this.authService.createSessionToken(tokenPayload);

    const session = new Session(sessionToken);

    session._id = tokenPayload.sessionId;

    user.sessions = [session];

    const newUser = await this.userRepository.create(user);

    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.getOne({ email });

    if (!user?._id) {
      throw new NotFoundError(userError.NOT_FOUND);
    }

    if (user.authType == AuthTypeEnum.GOOGLE || !user?.password) {
      throw new NotFoundError(userError.LOGIN_GOOGLE);
    }

    const isValidPassword = this.authService.verifyPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError(userError.INVALID_CREDENCIAL);
    }

    const tokenPayload = new JwtPayload(
      user._id as string,
      user.email,
      user.authType
    );

    const sessionToken = this.authService.createSessionToken(tokenPayload);

    const session = new Session(sessionToken);

    session._id = tokenPayload.sessionId;

    const userWithSession = await this.userRepository.addSession(
      user._id,
      session
    );

    return userWithSession;
  }

  update(userId: string, user: Partial<User>): Promise<User> {
    return this.userRepository.update(userId, user);
  }

  incrementFollowerCount(userId: string): Promise<User> {
    return this.userRepository.updateFollowersCount(userId, 1);
  }

  incrementFollowingCount(userId: string): Promise<User> {
    return this.userRepository.updateFollowingsCount(userId, 1);
  }

  decrementFollowerCount(userId: string): Promise<User> {
    return this.userRepository.updateFollowersCount(userId, -1);
  }

  decrementFollowingCount(userId: string): Promise<User> {
    return this.userRepository.updateFollowingsCount(userId, -1);
  }

  delete({
    email,
    userId,
  }: {
    email?: string;
    userId?: string;
  }): Promise<User> {
    return this.userRepository.delete({ email, userId });
  }

  isUser(email: string, userName?: string): Promise<Boolean> {
    return this.userRepository.checkUserExist(email, userName);
  }
}
