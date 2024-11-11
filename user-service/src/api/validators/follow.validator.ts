import { FollowTypeEnum } from "@/domain/enum/user.enum";
import Joi from "joi";

export const createfollowValidator = Joi.object({
  followedId: Joi.string().required(),
}).required();

export const getFollowValidator = Joi.object({
  type: Joi.string()
    .valid(...Object.values(FollowTypeEnum))
    .required(),
  userId: Joi.string().required(),
});

export const getFollowingsValidator = Joi.object({
  userId: Joi.string().optional(),
}).unknown(true);

export const deletefollowValidator = Joi.object({
  followedId: Joi.string().required(),
}).required();
