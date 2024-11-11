import { AuthTypeEnum } from "@/domain/enum/user.enum";
import mongoose from "mongoose";

export class JwtPayload {
  userId: string;
  email: string;
  authType: AuthTypeEnum;
  //@ts-ignore
  sessionId: string;

  constructor(
    userId: string,
    email: string,
    authType: AuthTypeEnum,
    sessionId?: string
  ) {
    //@ts-ignore
    this.sessionId = new mongoose.Types.ObjectId(sessionId);
    this.userId = userId;
    this.email = email;
    this.authType = authType;
  }
}
