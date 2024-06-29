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
  // Params       : dir: string, file: File
  // Return       : downloadUrl: string | null
  // =================================================================================
  async uploadFile(dir, file) {
    try {
      const formData = new import_form_data.default();
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
  // =================================================================================
  // Name         : uploadMultipleFile
  // Description  : <{This feature is currently unavailable}>
  // Author       : Sam (Coding Samrat)
  // Params       : dir: string, files: File[]
  // Return       : [downloadUrl:string] | null
  // =================================================================================
  async #uploadMultipleFile(dir, files) {
    try {
      const formData = new import_form_data.default();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Bucket
});
