import blog from "../models/blog";
import { Request, Response } from 'express';
import { redisClient } from "../db/redis";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const randomBytes = crypto.randomBytes(8).toString('hex');

interface AuthRequest extends Request {
    user?: {
        _id: string,
        name: string,
    };
}

const s3 = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
    }
});

const createBlog = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json('No image provided');
        }
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${randomBytes}-${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }
        const command = new PutObjectCommand(params);
        await s3.send(command);

        const image = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;

        const rateLimit = await redisClient.get(`RATE_LIMIT:${req.user?._id}`);
        if (rateLimit && parseInt(rateLimit) >= 5) {
            return res.status(429).json('Too many requests');
        }

        await redisClient.del('blogs');
        const newBlog = new blog({
            title: req.body.title,
            content: req.body.content,
            image,
            author: req.user?._id
        });
        await redisClient.setex(`RATE_LIMIT:${req.user?._id}`, 60, '0');
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    }
    catch (error: any) {
        console.log("Here is the error 1");
        res.status(500).json({ message: error.message });
    }
}

const getBlogs = async (req: Request, res: Response) => {
    try {
        const cachedBlogs = await redisClient.get('blogs');
        if (cachedBlogs) {
            return res.status(200).json(JSON.parse(cachedBlogs));
        }
        const blogs = await blog.find();
        await redisClient.setex('blogs', 3600, JSON.stringify(blogs));
        res.status(200).json(blogs);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const getBlog = async (req: Request, res: Response) => {
    try {
        const cachedBlog = await redisClient.get(`blog:${req.params.id}`);
        if (cachedBlog) {
            return res.status(200).json(JSON.parse(cachedBlog));
        }
        const blogPost = await blog.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).json('Blog not found');
        }
        await redisClient.setex(`blog:${req.params.id}`, 3600, JSON.stringify(blogPost));
        res.status(200).json(blogPost);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { getBlogs, getBlog, createBlog };