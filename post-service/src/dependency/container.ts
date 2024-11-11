import { container } from "tsyringe";
import { FollowRepository } from "@/infrastructure/database/repositories/follow.repository";
import { OtpRepository } from "@/infrastructure/database/repositories/otp.repository";
import { UserRepository } from "@/infrastructure/database/repositories/post.repository";
import { AuthService } from "@/domain/service/auth.service";
import { UserService } from "@/domain/service/user.service";
import { OtpService } from "@/domain/service/otp.service";
import { FollowService } from "@/domain/service/follow.service";

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
// container.register("EmailService", {
//   useClass: EmailService,
// });
container.register("FollowService", {
  useClass: FollowService,
});

//controllers registation
// container.register("NormalUserController", {
//   useClass: NormalUserController,
// });
// container.register("UserController", {
//   useClass: UserController,
// });
// container.register("EmailController", {
//   useClass: EmailController,
// });
// container.register("FollowController", {
//   useClass: FollowController,
// });

export default container;
