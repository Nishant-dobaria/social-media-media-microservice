import { Post } from "@/domain/entities/post.entity";
import { MediaTypeEnum } from "@/domain/enum/user.enum";
import mongoose, { Schema } from "mongoose";

const MediaSchema: Schema = new Schema(
  {
    postId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    type: { type: String, enum: Object.values(MediaTypeEnum), required: true },
    url: { type: String },
  },
  { timestamps: true }
);

const PostSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String },
    media: { type: [MediaSchema] },
    commentCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PostModel = mongoose.model<Post>("Post", PostSchema);
