import { injectable } from "tsyringe";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { s3 } from "@/infrastructure/aws/s3/client";
import { env } from "@/config/env";
import { awsUrls } from "@/config/aws.s3";
import { IStorageRepository } from "@/domain/interface/repositories/storage.interface";

@injectable()
export class StorageRepository implements IStorageRepository {
  client: S3Client;

  constructor() {
    this.client = s3;
  }

  async fileUpload(originalname: string, fileContent: any, fileUrl?: string) {
    let key = `post/${randomUUID()}_${originalname}`;

    if (fileUrl) {
      const urlParts = fileUrl.split(awsUrls.S3_BUCKET_URL);

      if (urlParts.length !== 2) {
        throw new UnprocessableEntityError("Invalid S3 file URL.");
      }

      key = urlParts[1];
    }

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileContent,
      },
    });

    await upload.done();

    const url = `${awsUrls.S3_BUCKET_URL}${key}`;

    return url;
  }

  uploadFiles(files: Array<any>) {
    const uploadPromises = files.map(async (file) => {
      const filename = file.hapi.filename;
      const contentType = file.hapi.headers["content-type"];

      return this.fileUpload(filename, file);
    });

    return Promise.all(uploadPromises);
  }

  async deleteFiles(urls: Array<string>): Promise<void> {
    if (!urls?.length) {
      return;
    }

    const objects = urls.map((url) => {
      const urlParts = url.split(awsUrls.S3_BUCKET_URL);

      if (urlParts.length !== 2) {
        throw new Error("Invalid S3 file URL.");
      }

      return { Key: urlParts[1] };
    });

    const deleteParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Delete: {
        Objects: objects,
        Quiet: false,
      },
    };

    const command = new DeleteObjectsCommand(deleteParams);

    const response = await this.client.send(command);

    if (response.Errors && response.Errors.length > 0) {
      console.error("Errors occurred while deleting:", response.Errors);
      throw new UnprocessableEntityError("Some files could not be deleted.");
    }

    return;
  }
}
