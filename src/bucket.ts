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
    private bucketId: string;
    private ApiManager: AxiosInstance;

    constructor(data: BucketData) {
        this.bucketId = data.bucketId;

        this.ApiManager = getApiManager({
            bucketId: data.bucketId,
            apiKey: data.apiKey,
            apiSecret: data.apiSecret,
            baseURL: data.baseURL
        });
    }

    async uploadFile(dir: string, file: File): Promise<string | null> {
        try {
            const formData = new FormData();
            formData.append('dir', dir);
            formData.append('file', file);
            const { data } = await this.ApiManager.post('/client/file/upload', formData);

            return data.downloadURL;
        } catch (error: any) {
            console.log(error)
            console.error('Error:', error?.response?.data?.error);
            return null;
        }
    }

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



    async deleteFile(downloadUrl: string): Promise<boolean> {
        try {
            const { data } = await this.ApiManager.post('/client/file/delete', { downloadUrl });

            return true;
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
            return false;
        }
    }



    async isExist(downloadUrl: String): Promise<boolean> {
        try {
            const { data } = await this.ApiManager.post('/client/file/is-exist', { downloadUrl });

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


    async copy(source: String, destination: String): Promise<boolean> {
        try {
            const { data } = await this.ApiManager.post('/client/file/copy', { source, destination });
            console.log(data)

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


    async move(source: String, destination: String): Promise<boolean> {
        try {
            const { data } = await this.ApiManager.post('/client/file/move', { source, destination });
            console.log(data)

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



    async readDir(dir: String): Promise<Object[] | null> {
        try {
            const { data } = await this.ApiManager.post('/client/file/read-dir', { dir });

            return data.dirData
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
            return null;
        }
    }
}
