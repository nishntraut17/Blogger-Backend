import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        _id: string,
        name: string,
    };
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json('Access Denied');
        return;
    }

    const token = authHeader.split(' ')[1];

    jsonwebtoken.verify(token, process.env.JWT_TOKEN as string, (err: any, decoded: any) => {
        if (err) {
            console.error("JWT verification error:", err);
            res.status(401).send("Yaha pe error hai");
            return;
        }
        req.user = decoded;
        next();
    });
}

export default auth;