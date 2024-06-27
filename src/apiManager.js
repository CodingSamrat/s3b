
// --------------------------------------------
// Author: Sam (Coding Samrat)
// Name  : api.config
// Desc  : ... 
// --------------------------------------------

import axios from 'axios';


export function getApiManager({ bucketId, apiKey, apiSecret, baseURL }) {
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
