import User from "../models/user";
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        const user = await newUser.save();
        res.status(201).json(user);

    } catch (error: any) {
        next(error);
    }
}

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json("user not found");
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).json("wrong password");
            return;
        }
        const token = jsonwebtoken.sign({ _id: user._id, name: user.name }, process.env.JWT_TOKEN as string);
        res.status(200).json(token);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { register, login };