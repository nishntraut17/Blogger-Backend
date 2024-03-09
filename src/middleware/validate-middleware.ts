import { Request, Response, NextFunction } from 'express';
const validate = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error: any) {
        const message = error.errors[0].message;
        console.log(message);
        res.status(400).send({ message });
    }
}

export default validate;