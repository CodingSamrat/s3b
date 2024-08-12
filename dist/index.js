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
   * @param readStream  File ReadSteam. use `fs.createReadStream(file.path)`
   * @returns downloadUrl or null 
   */
  async uploadFile(filePath, readStream) {
    try {
      const formData = new FormData();
      formData.append("filePath", filePath);
      formData.append("file", readStream);
      const { data } = await this.ApiManager.post("/client/file/upload", formData);
      console.log(data);
      return data?.downloadURL;
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  }
  // =================================================================================
  // Name         : uploadMultipleFile
  // Description  : <{This feature is currently unavailable}>
  // Author       : Sam (Coding Samrat)
  // Params       : dir: string, files: File[]
  // Return       : [downloadUrl:string] | null
  // =================================================================================
  async #uploadMultipleFile(dir, files) {
    try {
      const formData = new FormData();
      formData.append("dir", dir);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append("file", file);
      }
      console.log("FormData:", formData);
      const { data } = await this.ApiManager.post("/client/file/upload-many", formData);
      return data.downloadURL;
    } catch (error) {
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
