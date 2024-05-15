import { Schema, model } from "mongoose";

const articleSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/mern-site-2b794.appspot.com/o/image-not-available.svg?alt=media&token=564ebb50-ae76-446a-89dd-d05776535df7",
    },
    category: { type: String, default: "uncategorized" },
  },
  { timestamps: true },
);

const Article = model("Post", articleSchema);
export default Article;
