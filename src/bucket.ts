// src/bucket.ts

import { getApiManager } from "./apiManager";
import FormData from "form-data";
import { AxiosInstance } from "axios";
import fs from 'fs'

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




    /**
     * Upload file to cloud storage
     * @param filePath Full path of file
     * @param file  File got from multer
     * @returns downloadUrl or null 
     */
    async uploadFile(filePath: string, file: { path: string, filename: string }, options: { cleanup: false }): Promise<string | null> {

        try {

            const readStream = await fs.createReadStream(file.path)

            // Create instance of FormData
            const formData = new FormData();

            // Append `dir` & ` `file` to the dormData
            formData.append('filePath', filePath);
            formData.append('file', readStream);


            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/upload', formData);

            // cleanup
            if (data?.downloadURL && options.cleanup) {
                fs.unlinkSync(file.path)
            }

            // return `downloadURL`
            return data?.downloadURL;
        }
        catch (error: any) {
            console.log(error?.message)
            // console.error('Error:', error?.response?.data?.error);
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
    async uploadManyFile(dirPath: string, files: [{ path: string, filename: string }], options: { cleanup: false }): Promise<string | null> {
        try {

            const formData: FormData = new FormData();
            formData.append('dirPath', dirPath);


            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileStream = await fs.createReadStream(file.path)
                formData.append('file', fileStream);
            }

            const { data } = await this.ApiManager.post('/client/file/upload-many', formData);

            // cleanup
            if (data?.downloadURLs.length === files.length && options?.cleanup) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    fs.unlinkSync(file.path)
                }
            }
            return data.downloadURLs;
        } catch (error: any) {
            console.log(error.message)
            console.error('Error:', error?.response?.data?.error);
            return null;
        }
    }




    /**
     * Delete file from S3 Bucket
     * @param downloadUrl Download URL of file
     * @returns boolean
     */
    async deleteFile(downloadUrl: string): Promise<boolean> {
        try {

            const { data } = await this.ApiManager.post('/client/file/delete', { downloadUrl });

            // Check if file deleted or not
            if (data?.success) {
                return true;
            } else {
                return false
            }
        }
        catch (error: any) {

            if (error.response.data.error === 'File dose not exist!') {
                throw new Error('File dose not exist!')
            }
            console.log(error)
            // console.error('Error:', error?.response?.data?.error);
            return false;
        }
    }




    /**
     * Check if a file exist or not on cloud storage.
     * @param downloadUrl Download URL of file
     * @returns boolean
     */
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




    /**
     * Copy file from source to destination
     * @param source Current file path
     * @param destination Destination path 
     * @returns boolean
     */
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



    /**
     * Move file from source to destination
     * @param source Current file path
     * @param destination Destination path 
     * @returns boolean
     */
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




    /**
     * Lists all dir & files, with flag of `isFile`
     * @param dir Target directory path
     * @returns Object of directory data or null
     */
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


    /**
      * Create new directory
      * @param dir Directory path
      * @returns boolean
      */
    async makeDir(dir: String): Promise<boolean> {
        try {
            // API call by axios
            const { data } = await this.ApiManager.post('/client/file/make-dir', { dir });

            // return dirData. list of dir & files
            return true
        } catch (error: any) {
            console.error('Error:', error?.response?.data?.error);
            return false;
        }
    }
}
