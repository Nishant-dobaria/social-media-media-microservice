import { MediaTypeEnum } from "@/domain/enum/user.enum";

export interface Media {
  _id: string;
  postId: string;
  userId: string;
  type: MediaTypeEnum;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}
