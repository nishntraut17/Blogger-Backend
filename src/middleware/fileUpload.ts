import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

dotenv.config();
const randomBytes = crypto.randomBytes(8).toString('hex');

const s3 = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
    }
});

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/posts', upload.single('image'), async (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    if (!req.file) {
        return res.status(400).send({ message: 'Please upload a file' });
    }

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${randomBytes}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    }
    const command = new PutObjectCommand(params);

    await s3.send(command);

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
    console.log("imageUrl", imageUrl);
    res.status(200).send({ message: 'File uploaded successfully', imageUrl });
});