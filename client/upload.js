const fs = require('fs');
const axios = require('axios');
const Minio = require('minio');

endpoint = '52.78.170.191';
region = 'ap-northeast-2a';


// endpoint = 'localhost';
//region = 'us-east-1';


// Tạo client MinIO
const minioClient = new Minio.Client({
    endPoint: endpoint,
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    region: region, // bắt buộc!
    pathStyle: true // đảm bảo hoạt động với proxy nginx
});


/** 
 * Upload file
*/

// Hàm để lấy presigned URL
function getPresignedUrl(bucketName, objectName, expiry = 60 * 60) {
    return new Promise((resolve, reject) => {
        minioClient.presignedUrl('PUT', bucketName, objectName, expiry, function (err, presignedUrl) {
            if (err) {
                console.error('Lỗi khi tạo presigned URL:', err);
                return reject(err);
            }
            console.log('Presigned URL: ', presignedUrl);
            resolve(presignedUrl);
        });
    });
}

const filePath = './example.txt'; // đường dẫn đến file local

async function uploadFile(presignedUrl, filePath) {
    const fileStream = fs.createReadStream(filePath);
    try {
        const response = await axios.put(presignedUrl, fileStream, {
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
        console.log('Upload thành công!');
    } catch (err) {
        console.error('Upload thất bại:', err);
    }
}

async function upload() {
    const bucketName = 'mybucket';
    const objectName = 'example.txt';
    const filePath = './example.txt';

    try {
        const url = await getPresignedUrl(bucketName, objectName);
        console.log('URL đã lấy:', url);
        await uploadFile(url, filePath);
    } catch (err) {
        console.error('Có lỗi xảy ra:', err);
    }
}

upload();
