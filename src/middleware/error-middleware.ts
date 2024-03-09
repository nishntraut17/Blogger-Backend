import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
    extraDetails?: string;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    const extraDetails = err.extraDetails || '';
    res.status(500).send({ message, extraDetails });
}

export default errorMiddleware;
