// src/greeter.ts

import { getApiManager } from "./apiManager.js";
import FormData from "form-data";


export class Bucket {
    constructor(data) {
        this.bucketId = data.bucketId


        this.ApiManager = getApiManager({
            bucketId: data.bucketId,
            apiKey: data.apiKey,
            apiSecret: data.apiSecret,
            baseURL: data.baseURL
        })

    }

    /**
     * 
     * @param {string} dir 
     * @param {*} file 
     * @returns 
     */
    async uploadFile(dir, file) {
        try {
            // console.log(file)
            const formData = new FormData();
            await formData.append('dir', dir);
            await formData.append('file', file);
            const { data } = await this.ApiManager.post('/client/file/upload', formData);

            return data.downloadURL

        } catch (error) {
            console.error('Error:', error?.response?.data?.error);
            return null
        }
    }

    async uploadMultipleFile(dir, file) {
        try {
            // console.log(file)
            const formData = new FormData();
            await formData.append('dir', dir);
            await formData.append('file', file);
            const { data } = await this.ApiManager.post('/client/file/upload', formData);

            return data.downloadURL

        } catch (error) {
            console.error('Error:', error?.response?.data?.error);
            return null
        }
    }


}
