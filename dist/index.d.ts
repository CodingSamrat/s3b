interface BucketData {
    bucketId: string;
    apiKey: string;
    apiSecret: string;
    baseURL: string;
}
declare class Bucket {
    #private;
    private bucketId;
    private ApiManager;
    constructor(data: BucketData);
    uploadFile(dir: string, file: File): Promise<string | null>;
    deleteFile(downloadUrl: string): Promise<boolean>;
    isExist(downloadUrl: String): Promise<boolean>;
    copy(source: String, destination: String): Promise<boolean>;
    move(source: String, destination: String): Promise<boolean>;
    readDir(dir: String): Promise<Object[] | null>;
}

export { Bucket };
