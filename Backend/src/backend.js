import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authorizationRoutes } from './routing/auth.js';
import { userRoutes } from './routing/user.js';
import { newsArticleRoutes } from './routing/post.js';
import { userCommentRoutes } from './routing/comment.js';

const backend = express();
const configurationCors = {
    origin: process.env.FRONTEND,
    optionSuccessStatus: 200,
    credentials: true,
    Headers: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type', 'Authorization'],
    exposedHeaders: 'Set-Cookie',

};
backend.use(cors(configurationCors));
backend.use(express.json());
backend.use(express.urlencoded({ extended: true }));
backend.use(express.static('public'));
backend.use(cookieParser());


backend.use('/api/auth', authorizationRoutes);
backend.use('/api/user', userRoutes);
backend.use('/api/post', newsArticleRoutes);
backend.use('/api/comment', userCommentRoutes);

backend.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server working.',
    });
});

export default backend;
