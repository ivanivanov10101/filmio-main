import { Schema, model } from 'mongoose';

const postSchema = new Schema(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        image: {
            type: String,
            default:
                "https://firebasestorage.googleapis.com/v0/b/mern-site-2b794.appspot.com/o/no-image.jpg?alt=media&token=d8783116-f16d-4633-881d-a68550f457fc",
        },
        category: { type: String, default: 'uncategorized' },
    },
    { timestamps: true }
);

const Post = model('Post', postSchema);
export default Post;
