export interface IStorageRepository {
  fileUpload(
    originalname: string,
    fileContent: any,
    fileUrl?: string
  ): Promise<string>;

  uploadFiles(files: Array<any>): Promise<string[]>;

  deleteFiles(urls: Array<string>): Promise<void>;
}
