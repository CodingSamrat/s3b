interface BucketData {
    bucketId: string;
    apiKey: string;
    apiSecret: string;
    baseURL: string;
}
declare class Bucket {
    private ApiManager;
    constructor(data: BucketData);
    /**
     * Upload file to cloud storage
     * @param filePath Full path of file
     * @param file  File got from multer
     * @returns downloadUrl or null
     */
    uploadFile(filePath: string, file: {
        path: string;
        filename: string;
    }, options: {
        cleanup: false;
    }): Promise<string | null>;
    /**
     * Upload Multiple files. By default you can upload 20 files at a time.
     * Manage `MAX_FILES_LENGTH` of `.../s3b-server/s3b.config.js`
     * @param dirPath Destination directory (relative to bucket dir)
     * @param files Files array got from multer
     * @returns
     */
    uploadManyFile(dirPath: string, files: [{
        path: string;
        filename: string;
    }], options: {
        cleanup: false;
    }): Promise<string | null>;
    /**
     * Delete file from S3 Bucket
     * @param downloadUrl Download URL of file
     * @returns boolean
     */
    deleteFile(downloadUrl: string): Promise<boolean>;
    /**
     * Check if a file exist or not on cloud storage.
     * @param downloadUrl Download URL of file
     * @returns boolean
     */
    isExist(downloadUrl: String): Promise<boolean>;
    /**
     * Copy file from source to destination
     * @param source Current file path
     * @param destination Destination path
     * @returns boolean
     */
    copy(source: String, destination: String): Promise<boolean>;
    /**
     * Move file from source to destination
     * @param source Current file path
     * @param destination Destination path
     * @returns boolean
     */
    move(source: String, destination: String): Promise<boolean>;
    /**
     * Lists all dir & files, with flag of `isFile`
     * @param dir Target directory path
     * @returns Object of directory data or null
     */
    readDir(dir: String): Promise<Object[] | null>;
    /**
      * Create new directory
      * @param dir Directory path
      * @returns boolean
      */
    makeDir(dir: String): Promise<boolean>;
}

export { Bucket };
