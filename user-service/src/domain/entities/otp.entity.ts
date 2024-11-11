export class OTP {
  email: string;
  expirationTime: number;
  otp: string;
  isVerified: boolean = false;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(email: string, otp: string, expirationTime: number) {
    this.email = email;
    this.otp = otp;
    this.expirationTime = expirationTime;
  }
}
