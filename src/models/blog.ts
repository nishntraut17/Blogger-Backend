import mongoose, { Schema, Document } from "mongoose";

interface Blog extends Document {
    title: string;
    content: string;
    image: string;
    author: mongoose.Schema.Types.ObjectId;
}

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

export default mongoose.model<Blog>("Blog", blogSchema);