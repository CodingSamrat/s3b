
// --------------------------------------------
// Author: Sam (Coding Samrat)
// Name  : api.config
// Desc  : ... 
// --------------------------------------------
import axios, { AxiosInstance } from 'axios';

interface ApiConfig {
    bucketId: string;
    apiKey: string;
    apiSecret: string;
    baseURL: string;
}




// =================================================================================
// Name         : getApiManager
// Description  : Get instance of Axios...
// Author       : Sam (Coding Samrat)
// Params       : object: { bucketId, apiKey, apiSecret, baseURL }
// Return       : ApiManager: AxiosInstance
// =================================================================================
export function getApiManager({ bucketId, apiKey, apiSecret, baseURL }: ApiConfig): AxiosInstance {
    const headers = {
        'x-api-key': apiKey,
        'x-api-secret': apiSecret,
        'x-bucket-id': bucketId
    };

    // Creating instance of Axios
    const ApiManager = axios.create({
        baseURL: `${baseURL}/api/v1`,
        headers
    });

    // return ApiManager
    return ApiManager;
}