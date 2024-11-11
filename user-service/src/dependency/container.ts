import { container } from "tsyringe";
import { FollowRepository } from "@/infrastructure/database/repositories/follow.repository";
import { OtpRepository } from "@/infrastructure/database/repositories/otp.repository";
import { UserRepository } from "@/infrastructure/database/repositories/user.repository";
import { AuthService } from "@/domain/service/auth.service";
import { UserService } from "@/domain/service/user.service";
import { OtpService } from "@/domain/service/otp.service";
import { FollowService } from "@/domain/service/follow.service";
import { UserController } from "@/api/controllers/user.controller";
import { OtpController } from "@/api/controllers/otp.controller";
import { FollowController } from "@/api/controllers/follow.controller";
import { EmailService } from "@/domain/service/email.service";
import { StorageRepository } from "@/infrastructure/aws/s3/repositories/s3.repository";

//repository registation
container.register("UserRepository", {
  useClass: UserRepository,
});
container.register("FollowRepository", {
  useClass: FollowRepository,
});
container.register("OtpRepository", {
  useClass: OtpRepository,
});
container.register("StorageRepository", {
  useClass: StorageRepository,
});

// services registation
container.register("UserService", {
  useClass: UserService,
});
container.register("AuthService", {
  useClass: AuthService,
});
container.register("OtpService", {
  useClass: OtpService,
});
container.register("EmailService", {
  useClass: EmailService,
});
container.register("FollowService", {
  useClass: FollowService,
});

// controllers registation
container.register("UserController", {
  useClass: UserController,
});
container.register("OtpController", {
  useClass: OtpController,
});
container.register("FollowController", {
  useClass: FollowController,
});

export default container;
