import { Request, Response } from 'express';
import Notification from '../models/notification.js';

const getNofiications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
export default getNofiications;