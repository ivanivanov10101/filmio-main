import { Schema, model } from 'mongoose';

const commentsSchema = new Schema(
    {
        content: { type: String, required: true },
        postId: { type: String, required: true },
        userId: { type: String, required: true },
        likes: { type: Array, default: [] },
        numberOfLikes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Comments = model('Comment', commentsSchema);
export default Comments;
