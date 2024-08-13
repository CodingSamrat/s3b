# s3b
**s3b** is a powerful and user-friendly client designed to interact with the [s3b-server](https://github.com/codingsamrat/s3b-server), a self-hosted S3-compatible storage solution. This client facilitates seamless communication with the server, enabling efficient data storage, retrieval, and management within self-hosted S3 buckets. With an intuitive interface and robust functionality, s3b simplifies the process of handling S3 operations, making it an ideal tool for developers and organizations utilizing self-hosted S3 storage systems.


## Installation
Install the s3b package 
``` bash
npm install s3b
```
#### For `s3b-server` Installation go through [this docs](https://github.com/codingsamrat/s3b). 


## Usage
First of all make a config file for s3b & export bucket instance from it.
``` javascript
// s3b.config.js

import { Bucket } from 's3b'

const bucket = new Bucket({
    baseURL: 'YOUR_s3b-server_HOST_NAME', // Ex: https://cdn.example.com
    bucketId: 'YOUR_BUCKET_ID',
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET_KEY',
})

export {bucket}
```

Now bucket instance can be used wherever it needed. Suppose, here we are using it to store user avatar, in user controller of your express app. 
``` javascript
// user.controller.js

import { bucket } from '/path/to/s3b.config.js'
import fs from 'fs'

const avatar = req.file
const file = await fs.createReadStream(avatar.path)
const downloadUrl = await bucket.uploadFile('/user/avatar/user-1.png', file)
```

> ### For better experience you can use the bellow utility function:
> Assuming the file (filename.png) is stored temporarily to the `public/temp` directory by `multer`. This function will do following:
> * Create Read Stream of `public/temp/filename.png`
> * Upload the Read Stream to the cloud by `s3b`
> * Finally delete the `public/temp/filename.png` from local machine

``` javascript
// s3b.config.js

...

async function uploadFile(filePath, file) {
    try {
        const _file = await fs.createReadStream(file.path)
        const downloadUrl = await bucket.uploadFile(filePath, _file)

        // unlink: delete the file from public/temp file
        try {
            await fs.unlinkSync(file.path)
            return downloadUrl

        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
}

export {bucket, uploadFile}
```



## Other Bucket Methods

``` javascript
// Upload single image
// Params  : filePath, file
// Returns : downloadUrl
bucket.uploadFile(filePath, file)

// Delete file from bucket
// Params  : downloadUrl
// Returns : boolean
bucket.deleteFile(downloadUrl)

// Check if file exist or not
// Params  : downloadUrl
// Returns : boolean
bucket.isExist(downloadUrl)

// Get info of a directory
// Params  : dir - directory path
// Returns : [{path, isFile, name},]
bucket.readDir(dir)

// Copy file
// Params  : source, destination 
// Returns : boolean
bucket.Copy(source, destination) // relative path from bucket

// Move file
// Params  : source, destination
// Returns : boolean
bucket.Move(source, destination) // relative path from bucket
```






## Contributing
Thank you for investing your time in contributing to our project! Whether it's a bug report, new feature, correction, or additional documentation, we greatly value feedback and contributions from our community. Any contribution you make will be reflected on `github.com/CodingSamrat/s3b`.

Contributions to _s3b_ are welcome! Here's how to get started:

- Open an [issue](https://github.com/CodingSamrat/s3b/issues) or find for related issues to start a discussion around a feature idea or a bug.
- Fork the [repository](https://github.com/CodingSamrat/s3b) on GitHub.
- Create a new branch of the master branch and start making your changes.
- Make a meaning-full commit.
- Write a test, which shows that the bug is fixed or the feature works as expected.
- Send a pull request and wait until it gets merged and published.
