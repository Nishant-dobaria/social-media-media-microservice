import { Follow } from "@/domain/entities/follow.entity";
import mongoose, { Schema } from "mongoose";

const FollowSchema: Schema = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const FollowModel = mongoose.model<Follow>("Follow", FollowSchema);
