// src/apiManager.ts
import axios from "axios";
function getApiManager({ bucketId, apiKey, apiSecret, baseURL }) {
  const headers = {
    "x-api-key": apiKey,
    "x-api-secret": apiSecret,
    "x-bucket-id": bucketId
  };
  const ApiManager = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers
  });
  return ApiManager;
}

// src/bucket.ts
import FormData from "form-data";
import fs from "fs";
var Bucket = class {
  ApiManager;
  constructor(data) {
    this.ApiManager = getApiManager({
      bucketId: data.bucketId,
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
      baseURL: data.baseURL
    });
  }
  /**
   * Upload file to cloud storage
   * @param filePath Full path of file
   * @param file  File got from multer
   * @returns downloadUrl or null 
   */
  async uploadFile(filePath, file, options) {
    try {
      const readStream = await fs.createReadStream(file.path);
      const formData = new FormData();
      formData.append("filePath", filePath);
      formData.append("file", readStream);
      const { data } = await this.ApiManager.post("/client/file/upload", formData);
      if (data?.downloadURL && options.cleanup) {
        fs.unlinkSync(file.path);
      }
      return data?.downloadURL;
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  }
  /**
   * Upload Multiple files. By default you can upload 20 files at a time.
   * Manage `MAX_FILES_LENGTH` of `.../s3b-server/s3b.config.js`
   * @param dirPath Destination directory (relative to bucket dir)
   * @param files Files array got from multer
   * @returns 
   */
  async uploadManyFile(dirPath, files, options) {
    try {
      const formData = new FormData();
      formData.append("dirPath", dirPath);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStream = await fs.createReadStream(file.path);
        formData.append("file", fileStream);
      }
      const { data } = await this.ApiManager.post("/client/file/upload-many", formData);
      if (data?.downloadURLs.length === files.length && options?.cleanup) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          fs.unlinkSync(file.path);
        }
      }
      return data.downloadURLs;
    } catch (error) {
      console.log(error.message);
      console.error("Error:", error?.response?.data?.error);
      return null;
    }
  }
  /**
   * Delete file from S3 Bucket
   * @param downloadUrl Download URL of file
   * @returns boolean
   */
  async deleteFile(downloadUrl) {
    try {
      const { data } = await this.ApiManager.post("/client/file/delete", { downloadUrl });
      if (data?.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.data.error === "File dose not exist!") {
        throw new Error("File dose not exist!");
      }
      console.log(error);
      return false;
    }
  }
  /**
   * Check if a file exist or not on cloud storage.
   * @param downloadUrl Download URL of file
   * @returns boolean
   */
  async isExist(downloadUrl) {
    try {
      const { data } = await this.ApiManager.post("/client/file/is-exist", { downloadUrl });
      if (data.isExist) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error:", error?.response?.data?.error);
      return false;
    }
  }
  /**
   * Copy file from source to destination
   * @param source Current file path
   * @param destination Destination path 
   * @returns boolean
   */
  async copy(source, destination) {
    try {
      const { data } = await this.ApiManager.post("/client/file/copy", { source, destination });
      console.log(data);
      if (data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error:", error?.response?.data?.error);
      return false;
    }
  }
  /**
   * Move file from source to destination
   * @param source Current file path
   * @param destination Destination path 
   * @returns boolean
   */
  async move(source, destination) {
    try {
      const { data } = await this.ApiManager.post("/client/file/move", { source, destination });
      console.log(data);
      if (data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error:", error?.response?.data?.error);
      return false;
    }
  }
  /**
   * Lists all dir & files, with flag of `isFile`
   * @param dir Target directory path
   * @returns Object of directory data or null
   */
  async readDir(dir) {
    try {
      const { data } = await this.ApiManager.post("/client/file/read-dir", { dir });
      return data.dirData;
    } catch (error) {
      console.error("Error:", error?.response?.data?.error);
      return null;
    }
  }
  /**
    * Create new directory
    * @param dir Directory path
    * @returns boolean
    */
  async makeDir(dir) {
    try {
      const { data } = await this.ApiManager.post("/client/file/make-dir", { dir });
      return true;
    } catch (error) {
      console.error("Error:", error?.response?.data?.error);
      return false;
    }
  }
};
export {
  Bucket
};
