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
  // =================================================================================
  // Name         : uploadFile
  // Description  : Upload file to S3 Bucket
  // Author       : Sam (Coding Samrat)
  // Params       : dir: string - file full path, file: File
  // Return       : downloadUrl: string | null
  // =================================================================================
  async uploadFile(filePath, file) {
    try {
      const formData = new FormData();
      formData.append("dir", filePath);
      formData.append("file", file);
      const { data } = await this.ApiManager.post("/client/file/upload", formData);
      return data.downloadURL;
    } catch (error) {
      console.log(error);
      console.error("Error:", error?.response?.data?.error);
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
      console.log(data);
      return data.downloadURL;
    } catch (error) {
      console.log(error);
      console.error("Error:", error?.response?.data?.error);
      return null;
    }
  }
  // =================================================================================
  // Name         : deleteFile
  // Description  : Delete file from S3 Bucket
  // Author       : Sam (Coding Samrat)
  // Params       : downloadUrl: string
  // Return       : boolean
  // =================================================================================
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
  // =================================================================================
  // Name         : isExist
  // Description  : Check if file exist of not
  // Author       : Sam (Coding Samrat)
  // Params       : downloadUrl: string
  // Return       : boolean
  // =================================================================================
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
  // =================================================================================
  // Name         : copy
  // Description  : Copy file from source to destination
  // Author       : Sam (Coding Samrat)
  // Params       : source: String, destination: String
  // Return       : boolean
  // =================================================================================
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
  // =================================================================================
  // Name         : move
  // Description  : Move file from source to destination
  // Author       : Sam (Coding Samrat)
  // Params       : source: String, destination: String
  // Return       : boolean
  // =================================================================================
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
  // =================================================================================
  // Name         : readDir
  // Description  : Lists all dir & files, with flag of `isFile`
  // Author       : Sam (Coding Samrat)
  // Params       : dir: string
  // Return       : [Object] | null
  // =================================================================================
  async readDir(dir) {
    try {
      const { data } = await this.ApiManager.post("/client/file/read-dir", { dir });
      return data.dirData;
    } catch (error) {
      console.error("Error:", error?.response?.data?.error);
      return null;
    }
  }
};
export {
  Bucket
};
