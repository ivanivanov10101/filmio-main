import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { postRoutes } from './routes/post.routes.js';
import { commentRoutes } from './routes/comment.routes.js';
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import mongoose from "mongoose";
// import passport from "passport";

const app = express();
const corsOptions = {
    origin: process.env.FRONTEND,
    credentials: true,
    optionSuccessStatus: 200,
    Headers: true,
    exposedHeaders: 'Set-Cookie',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     saveUninitialized: true,
//     resave: false,
//     cookie: {
//         maxAge: 60 * 60 * 1000,
//     },
//     store: MongoStore.create({
//         client: mongoose.connection.getClient(),
//     })
// }
// ))
// app.use(passport.initialize())
// app.use(passport.session())
app.use(cookieParser(process.env.COOKIE_SECRET));


// Routes declaration...
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment', commentRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server working.',
    });
});

export default app;
