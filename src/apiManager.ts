
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

export function getApiManager({ bucketId, apiKey, apiSecret, baseURL }: ApiConfig): AxiosInstance {
    const headers = {
        'x-api-key': apiKey,
        'x-api-secret': apiSecret,
        'x-bucket-id': bucketId
    };

    const ApiManager = axios.create({
        baseURL: `${baseURL}/api/v1`,
        headers
    });

    return ApiManager;
}