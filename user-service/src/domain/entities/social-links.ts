export class SocialLink {
  url: string;
  logoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(url: string, logoUrl?: string) {
    this.url = url;
    this.logoUrl = logoUrl;
  }
}
