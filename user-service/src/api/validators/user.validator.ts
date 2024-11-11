import Joi from "joi";
import { GenderEnum, UserTypeEnum } from "@/domain/enum/user.enum";

export const socialLinkValidator = Joi.object({
  url: Joi.string().required(),
  logoUrl: Joi.string().required(),
}).required();

export const individualUserSignUpValidator = Joi.object({
  type: Joi.string().valid(UserTypeEnum.INDIVIDUAL).required(),
  email: Joi.string().email().required(),
  userName: Joi.string().min(3).required(),
  fullName: Joi.string().min(3).required(),
  password: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  profilePicture: Joi.any().optional(),
  phoneNumber: Joi.string().optional(),
  gender: Joi.string()
    .valid(...Object.values(GenderEnum))
    .optional(),
  socialLinks: Joi.array().items(socialLinkValidator).optional(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().optional(),
  interests: Joi.array().items(Joi.string()).optional(),
}).required();

export const businessUserSignUpValidator = Joi.object({
  type: Joi.string().valid(UserTypeEnum.BUSINESS).required(),
  email: Joi.string().email().required(),
  userName: Joi.string().min(3).required(),
  businessName: Joi.string().max(255).required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().optional(),
  websiteUrl: Joi.string().optional(),
  profilePicture: Joi.any().optional(),
  industry: Joi.string().optional(),
  businessCategory: Joi.string().max(255).optional(),
  bio: Joi.string().max(500).optional(),
  socialLinks: Joi.array().items(socialLinkValidator).optional(),
  interests: Joi.array().items(Joi.string()).optional(),
}).required();

export const userSignUpValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
})
  .when(
    Joi.object({
      type: Joi.valid(UserTypeEnum.INDIVIDUAL).required(),
    }).unknown(),
    {
      then: individualUserSignUpValidator,
    }
  )
  .when(
    Joi.object({ type: Joi.valid(UserTypeEnum.BUSINESS).required() }).unknown(),
    {
      then: businessUserSignUpValidator,
    }
  );

export const individualUserUpdateValidator = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
  userName: Joi.string().min(3).optional(),
  fullName: Joi.string().min(3).optional(),
  dateOfBirth: Joi.date().optional(),
  profilePicture: Joi.any().optional(),
  phoneNumber: Joi.string().optional(),
  gender: Joi.string()
    .valid(...Object.values(GenderEnum))
    .optional(),
  socialLinks: Joi.array().items(Joi.string().uri()).optional(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(500).optional(),
  interests: Joi.array().items(socialLinkValidator).optional(),
}).required();

export const businessUserUpdateValidator = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
  userName: Joi.string().min(3).optional(),
  businessName: Joi.string().max(255).optional(),
  address: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  websiteUrl: Joi.string().optional(),
  profilePicture: Joi.any().optional(),
  industry: Joi.string().optional(),
  businessCategory: Joi.string().max(255).optional(),
  bio: Joi.string().max(500).optional(),
  socialLinks: Joi.array().items(socialLinkValidator).optional(),
  interests: Joi.array().items(Joi.string()).optional(),
}).required();

export const userUpdateValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(UserTypeEnum))
    .required(),
})
  .when(
    Joi.object({
      type: Joi.valid(UserTypeEnum.INDIVIDUAL).required(),
    }).unknown(),
    {
      then: individualUserUpdateValidator,
    }
  )
  .when(
    Joi.object({ type: Joi.valid(UserTypeEnum.BUSINESS).required() }).unknown(),
    {
      then: businessUserUpdateValidator,
    }
  );

export const getUsersValidator = Joi.object({
  userIds: Joi.array().items(Joi.string().required()).required(),
  createdAt: Joi.date().optional(),
}).required();

export const getUserProfileValidator = Joi.object({
  email: Joi.string().email().optional(),
  userName: Joi.string().optional(),
  userId: Joi.string().optional(),
})
  .required()
  .or("email", "userName", "userId");

export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();

export const otpValidator = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const verifyOtpValidator = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
}).required();

export const resetPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().required(),
}).required();
