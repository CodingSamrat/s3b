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
  bucketId;
  ApiManager;
  constructor(data) {
    this.bucketId = data.bucketId;
    this.ApiManager = getApiManager({
      bucketId: data.bucketId,
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
      baseURL: data.baseURL
    });
  }
  async uploadFile(dir, file) {
    try {
      const formData = new FormData();
      formData.append("dir", dir);
      formData.append("file", file);
      const { data } = await this.ApiManager.post("/client/file/upload", formData);
      return data.downloadURL;
    } catch (error) {
      console.log(error);
      console.error("Error:", error?.response?.data?.error);
      return null;
    }
  }
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
  async deleteFile(downloadUrl) {
    try {
      const { data } = await this.ApiManager.post("/client/file/delete", { downloadUrl });
      return true;
    } catch (error) {
      console.error("Error:", error?.response?.data?.error);
      return false;
    }
  }
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
