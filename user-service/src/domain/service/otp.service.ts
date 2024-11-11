import { inject, injectable } from "tsyringe";
import { IOtpService } from "@/domain/interface/service/otp.interface";
import { OTP } from "@/domain/entities/otp.entity";
import { NotFoundError, UnauthorizedError } from "@/domain/errors/app-errors";
import { IAuthService } from "@/domain/interface/service/auth.interface";
import { IOtpRepository } from "@/domain/interface/repositories/otp.interface";
import { IEmailService } from "../interface/service/email.interface";
import { OtpTypeEnum } from "../enum/email.enum";

@injectable()
export class OtpService implements IOtpService {
  constructor(
    @inject("OtpRepository")
    private otpRepository: IOtpRepository,
    @inject("AuthService")
    private authService: IAuthService,
    @inject("EmailService")
    private emailService: IEmailService
  ) {}

  async create(email: string, type: OtpTypeEnum): Promise<OTP> {
    const { otp, expirationTime } = this.authService.generateOTP();

    const newOtp = new OTP(email, otp, expirationTime);

    const createdOtp = await this.otpRepository.create(newOtp);

    await this.emailService.sendOtp(createdOtp.email, createdOtp.otp, type);

    return createdOtp;
  }

  async verify(email: string, otp: string): Promise<boolean> {
    const realOtp = await this.otpRepository.get({ email });

    const { success, message } = this.authService.verifyOTP(
      otp,
      realOtp.otp,
      realOtp.expirationTime
    );

    if (!success) {
      throw new UnauthorizedError(message);
    }

    await this.otpRepository.markVerified(email);

    return true;
  }

  async isVerified(email: string): Promise<boolean> {
    const otp = await this.otpRepository.get({ email });

    if (!otp?.isVerified) {
      return false;
    }

    return true;
  }

  async delete(email: string): Promise<void> {
    await this.otpRepository.delete(email);
  }
}
