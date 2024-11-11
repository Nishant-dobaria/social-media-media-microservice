import { inject, injectable } from "tsyringe";
import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import { IUserService } from "@/domain/interface/service/user.interface";
import { User } from "@/domain/entities/user";
import { AuthTypeEnum, UserTypeEnum } from "@/domain/enum/user.enum";
import { IStorageRepository } from "@/domain/interface/repositories/storage.interface";
import { userSuccess } from "@/domain/messages/success/user.message";
import { googleOauthURL } from "@/infrastructure/oauth/google/create-url";
import { getGoogleProfile } from "@/infrastructure/oauth/google/get-token";
import { IFollowService } from "@/domain/interface/service/follow.interface";

@injectable()
export class UserController {
  constructor(
    @inject("UserService")
    private userService: IUserService,
    @inject("FollowService")
    private followService: IFollowService,
    @inject("StorageRepository")
    private storageRepository: IStorageRepository
  ) {}

  async profile(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const user = await this.userService.getOne({
      email: body?.email,
      userId: body?.userId,
      userName: body?.userName,
    });

    return h
      .response({
        statusCode: 200,
        data: user,
        message: userSuccess.SENT,
      })
      .code(200);
  }

  async get(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const users = await this.userService.get({
      userIds: body.userIds,
      createdAt: body.createdAt,
    });

    return h
      .response({
        statusCode: 200,
        data: users,
        message: userSuccess.SENT_USERS,
      })
      .code(200);
  }

  async getSuggestedUsers(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const followService = await this.followService.getFollowingsIds(
      user.userId
    );

    const users = await this.userService.get({
      excludeUserIds: followService,
    });

    return h
      .response({
        statusCode: 200,
        data: users,
        message: userSuccess.SENT_USERS,
      })
      .code(200);
  }

  async signUp(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const user = new User(body.email, body.userName, body.password);
    user.type = body?.type;
    user.bio = body?.bio;
    user.address = body?.address;
    user.contactNumber = body?.contactNumber;
    user.businessName = body?.businessName;
    user.dateOfBirth = body?.dateOfBirth;
    user.fullName = body?.fullName;
    user.gender = body?.gender;
    user.authType = AuthTypeEnum.LOCAL;
    user.location = body?.location;
    user.socialLinks = body?.socialLinks;
    user.interests = body?.interests;

    const newUser = await this.userService.create(user, body?.profilePicture);

    return h
      .response({
        statusCode: 201,
        data: newUser,
        message: userSuccess.SIGN_UP,
      })
      .code(201);
  }

  async login(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;

    const user = await this.userService.login(body.email, body.password);

    return h
      .response({
        statusCode: 200,
        data: user,
        message: userSuccess.LOGIN,
      })
      .code(200);
  }

  async googleRedirect(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const { userType } = request.query as any;
    const url = googleOauthURL(userType as UserTypeEnum);
    return h.redirect(url).code(200);
  }

  async individualGoogleCallBack(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const { code } = request.query as any;

    const responseUser = await getGoogleProfile(code, UserTypeEnum.INDIVIDUAL);

    const user = await this.userService.loginGoogle(responseUser.email);

    if (user) {
      return h
        .response({
          statusCode: 201,
          data: user,
          message: userSuccess.LOGIN,
        })
        .code(201);
    }

    const newUser = new User(responseUser.email, responseUser.given_name);
    newUser.type = UserTypeEnum.INDIVIDUAL;
    newUser.authType = AuthTypeEnum.GOOGLE;
    newUser.profilePicture = responseUser.picture;

    const newUserWithSession = await this.userService.create(newUser);

    return h
      .response({
        statusCode: 201,
        data: newUserWithSession,
        message: userSuccess.LOGIN,
      })
      .code(201);
  }

  async businessGoogleCallBack(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const { code } = request.query as any;

    const responseUser = await getGoogleProfile(code, UserTypeEnum.BUSINESS);

    const user = await this.userService.loginGoogle(responseUser.email);

    if (user) {
      return h
        .response({
          statusCode: 201,
          data: user,
          message: userSuccess.LOGIN,
        })
        .code(201);
    }

    const newUser = new User(responseUser.email, responseUser.given_name);
    newUser.type = UserTypeEnum.BUSINESS;
    newUser.authType = AuthTypeEnum.GOOGLE;
    newUser.profilePicture = responseUser.picture;

    const newUserWithSession = await this.userService.create(newUser);

    return h
      .response({
        statusCode: 201,
        data: newUserWithSession,
        message: userSuccess.UPDATE,
      })
      .code(201);
  }

  async update(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const {
      userId,
      bio,
      address,
      contactNumber,
      businessName,
      dateOfBirth,
      fullName,
      gender,
      socialLinks,
      userName,
      interests,
      profilePicture,
    } = request.payload as any;

    let user: Partial<User> = {
      ...(bio && { bio }),
      ...(address && { address }),
      ...(userName && { userName }),
      ...(contactNumber && { contactNumber }),
      ...(businessName && { businessName }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(fullName && { fullName }),
      ...(gender && { gender }),
      ...(socialLinks && { socialLinks }),
      ...(interests && { interests }),
    };

    if (profilePicture) {
      const oldUser = await this.userService.getOne({ userId: userId });
      const profileUrl = await this.storageRepository.fileUpload(
        profilePicture?.hapi?.filename,
        profilePicture,
        oldUser?.profilePicture
      );
      user.profilePicture = profileUrl;
    }

    const updatedUser = await this.userService.update(userId, user);

    return h
      .response({
        statusCode: 201,
        data: updatedUser,
        message: userSuccess.UPDATE,
      })
      .code(201);
  }

  async delete(
    request: Request<ReqRefDefaults>,
    h: ResponseToolkit<ReqRefDefaults>
  ) {
    const body = request.payload as any;
    const { credentials: user } = request.auth as any;

    const deletedUser = await this.userService.delete({
      email: body.email,
      userId: user.userId,
    });

    return h
      .response({
        statusCode: 201,
        data: deletedUser,
        message: userSuccess.DLETED,
      })
      .code(201);
  }
}
