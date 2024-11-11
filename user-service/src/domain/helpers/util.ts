import mongoose from "mongoose";
import { UnprocessableEntityError } from "../errors/app-errors";

export function getLimitAndSkip(pageNo: number) {
  const limit = 10;
  const skip = (pageNo - 1) * limit;
  return { limit, skip };
}

export function getObjectIds(ids: Array<string>) {
  return ids.map((id) => {
    if (!mongoose.isValidObjectId(id)) {
      throw new UnprocessableEntityError("not valid ObjectId");
    }
    return new mongoose.Types.ObjectId(id);
  });
}

export function getObjectId(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new UnprocessableEntityError("not valid ObjectId");
  }
  return new mongoose.Types.ObjectId(id);
}
