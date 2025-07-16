const fs = require('fs');
const axios = require('axios');
const Minio = require('minio');

endpoint = '52.78.170.191';
region = 'ap-northeast-2a';


// endpoint = 'localhost';
//region = 'us-east-1';

// Tạo client MinIO
const minioClient = new Minio.Client({
    endPoint: '52.78.170.191',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    region: 'ap-northeast-2a', // bắt buộc!
    pathStyle: true // đảm bảo hoạt động với proxy nginx
});

/**
 * Download file
 */
function getPresignedGetUrl(bucketName, objectName, expiry = 60 * 60) {
    return new Promise((resolve, reject) => {
        minioClient.presignedUrl('GET', bucketName, objectName, expiry, function (err, presignedUrl) {
            if (err) {
                console.error('Lỗi khi tạo presigned URL:', err);
                return reject(err);
            }
            resolve(presignedUrl);
        });
    });
}
async function downloadFile(presignedUrl, outputPath) {
    const response = await axios.get(presignedUrl, { responseType: 'stream' });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log('Tải file thành công:', outputPath);
            resolve();
        });
        writer.on('error', reject);
    });
}

async function download() {
    const bucketName = 'mybucket';
    const objectName = 'example.txt';
    const outputPath = './downloaded_example.txt';

    try {
        const url = await getPresignedGetUrl(bucketName, objectName);
        console.log('GET URL:', url);
        await downloadFile(url, outputPath);
    } catch (err) {
        console.error('Lỗi khi tải file:', err);
    }
}

download();
