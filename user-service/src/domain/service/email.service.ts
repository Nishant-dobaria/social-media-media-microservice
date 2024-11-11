import { injectable } from "tsyringe";
import { Email } from "@/domain/entities/email.entity";
import sendgrid from "@/infrastructure/email/twilio/client";
import { env } from "@/config/env";
import {
  changeEmailTemplate,
  signupOtpTemplate,
  verifyPasswordTemplate,
} from "../templates/emails/otp.email";
import { IEmailService } from "@/domain/interface/service/email.interface";
import { OtpTypeEnum } from "../enum/email.enum";
import { UnprocessableEntityError } from "../errors/app-errors";

@injectable()
export class EmailService implements IEmailService {
  constructor() {}

  async send(email: Email): Promise<void> {
    await sendgrid.send(email);
  }

  async sendOtp(to: string, otp: string, template: OtpTypeEnum): Promise<void> {
    let html: string;
    let subject: string;
    let text: string;

    switch (template) {
      case OtpTypeEnum.SIGNUP:
        html = signupOtpTemplate(otp);
        subject = "OTP for email registration";
        text = "OTP for email registration";
        break;
      case OtpTypeEnum.CHANGE_PASSWORD:
        html = verifyPasswordTemplate(otp);
        subject = "OTP for reset password";
        text = "OTP for reset password";
        break;
      case OtpTypeEnum.CHANGE_EMAIL:
        html = changeEmailTemplate(otp);
        subject = "OTP for change email";
        text = "OTP for change email";
        break;
      default:
        throw new UnprocessableEntityError(`${template} is not supported!`);
    }

    const email = new Email(env.FROM_EMAIL, to, subject, text, html);

    // await this.send(email);
  }
}
