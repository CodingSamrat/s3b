"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Bucket: () => Bucket
});
module.exports = __toCommonJS(src_exports);

// src/apiManager.ts
var import_axios = __toESM(require("axios"), 1);
function getApiManager({ bucketId, apiKey, apiSecret, baseURL }) {
  const headers = {
    "x-api-key": apiKey,
    "x-api-secret": apiSecret,
    "x-bucket-id": bucketId
  };
  const ApiManager = import_axios.default.create({
    baseURL: `${baseURL}/api/v1`,
    headers
  });
  return ApiManager;
}

// src/bucket.ts
var import_form_data = __toESM(require("form-data"), 1);
var import_fs = __toESM(require("fs"), 1);
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
      const readStream = await import_fs.default.createReadStream(file.path);
      const formData = new import_form_data.default();
      formData.append("filePath", filePath);
      formData.append("file", readStream);
      const { data } = await this.ApiManager.post("/client/file/upload", formData);
      if (data?.downloadURL && options.cleanup) {
        import_fs.default.unlinkSync(file.path);
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
      const formData = new import_form_data.default();
      formData.append("dirPath", dirPath);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileStream = await import_fs.default.createReadStream(file.path);
        formData.append("file", fileStream);
      }
      const { data } = await this.ApiManager.post("/client/file/upload-many", formData);
      if (data?.downloadURLs.length === files.length && options?.cleanup) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          import_fs.default.unlinkSync(file.path);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Bucket
});
