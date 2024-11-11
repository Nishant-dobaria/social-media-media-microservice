export class Follow {
  followerId: string;
  followedId: string;
  createdAt!: string;
  updatedAt!: string;

  constructor(followerId: string, followedId: string) {
    this.followedId = followedId;
    this.followerId = followerId;
  }
}
