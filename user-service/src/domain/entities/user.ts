import { AuthTypeEnum } from "@/domain/enum/user.enum";
import { Session } from "@/domain/entities/session.entiry";
import { SocialLink } from "@/domain/entities/social-links";
import { GenderEnum, UserTypeEnum } from "@/domain/enum/user.enum";
import { generateUserName } from "@/domain/helpers/generateUserName";
import mongoose from "mongoose";

export class User {
  _id?: string;
  email!: string;
  password?: string;
  userName!: string;
  postCount?: number;
  followersCount?: number;
  followingCount?: number;
  authType: AuthTypeEnum = AuthTypeEnum.LOCAL;
  type: UserTypeEnum = UserTypeEnum.INDIVIDUAL;
  profilePicture?: string;
  bio?: string;
  interests?: Array<string>;
  sessions?: Array<Session>;
  socialLinks?: Array<SocialLink>;
  isVerified: boolean = false;
  fullName?: string;
  location?: string;
  gender?: GenderEnum;
  isPrivate: boolean = false;
  dateOfBirth?: Date;
  contactNumber?: string;
  businessName?: string;
  address?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    email: string,
    userName: string,
    password?: string,
    userId?: string
  ) {
    //@ts-ignore
    this._id = new mongoose.Types.ObjectId(userId);
    this.email = email;
    this.userName = generateUserName(userName);
    this.password = password;
    this.sessions = [];
    this.socialLinks = [];
    this.interests = [];
  }
}
