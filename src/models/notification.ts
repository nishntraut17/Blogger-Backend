import mongoose, { Schema, Document } from 'mongoose';

interface Notification extends Document {
    message: string;
    read: boolean;
}

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    }
});

const Notification = mongoose.model<Notification>('Notification', notificationSchema);
export default Notification;