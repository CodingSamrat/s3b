// src/bucket.ts

import { getApiManager } from "./apiManager";
import FormData from "form-data";
import { AxiosInstance } from "axios";

interface BucketData {
    bucketId: string;
    apiKey: string;
    apiSecret: string;
    baseURL: string;
}

export class Bucket {
    private ApiManager: AxiosInstance;

    constructor(data: BucketData) {
        // Create instance of ApiManager
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
    async uploadFile(dir: string, file: File): Promise<string | null> {
        try {
            // Create instance of FormData
            const formData = new FormData();

            // Append `dir` & ` `file` to the dormData
            formData.append('dir', dir);
            formData.append('file', file);

            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/upload', formData);

            // return `downloadURL`
            return data.downloadURL;
        }
        catch (error: any) {
            console.log(error)
            console.error('Error:', error?.response?.data?.error);
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
    async #uploadMultipleFile(dir: string, files: File[]): Promise<string | null> {
        try {
            const formData: FormData = new FormData();
            formData.append('dir', dir);



            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                formData.append('file', file);
            }

            console.log('FormData:', formData)
            const { data } = await this.ApiManager.post('/client/file/upload-many', formData);
            console.log(data)
            return data.downloadURL;
        } catch (error: any) {
            console.log(error)
            console.error('Error:', error?.response?.data?.error);
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
    async deleteFile(downloadUrl: string): Promise<boolean> {
        try {
            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/delete', { downloadUrl });

            // Check if file deleted or not
            if (data.success) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
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
    async isExist(downloadUrl: String): Promise<boolean> {
        try {
            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/is-exist', { downloadUrl });

            // Check if file exists or not
            if (data.isExist) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
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
    async copy(source: String, destination: String): Promise<boolean> {
        try {
            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/copy', { source, destination });
            console.log(data)

            // Check if file copied or not
            if (data.success) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
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
    async move(source: String, destination: String): Promise<boolean> {
        try {
            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/move', { source, destination });
            console.log(data)

            // Check if file moved or not
            if (data.success) {
                return true;
            } else {
                return false
            }
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
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
    async readDir(dir: String): Promise<Object[] | null> {
        try {
            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/read-dir', { dir });

            // return dirData. list of dir & files
            return data.dirData
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
            return null;
        }
    }
}
