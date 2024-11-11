import mongoose from "mongoose";

export class Session {
  _id!: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(token: string) {
    this.token = token;
  }
}
