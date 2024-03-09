require('dotenv').config();
import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

export function uploadFile(file: any) {
    const fileStream = fs.createReadStream(file.path);
    const bucketName = process.env.AWS_S3_BUCKET_NAME; // Add this line

    if (!bucketName) {
        throw new Error('AWS S3 bucket name is not defined.');
    }

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };

    return s3.upload(uploadParams).promise();
}

export function getFileStream(fileKey: string) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME; // Add this line

    if (!bucketName) {
        throw new Error('AWS S3 bucket name is not defined.');
    }

    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };

    return s3.getObject(downloadParams).createReadStream();
}