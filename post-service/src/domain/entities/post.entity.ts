import { Media } from "@/domain/entities/media.entity";

export interface Post {
  _id: string;
  userId: string;
  content?: string;
  media?: Array<Media>;
  commentCount?: number;
  likeCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
