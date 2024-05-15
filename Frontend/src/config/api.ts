import axios from 'axios';
import { apiBaseUrl } from './environmental_data.ts';
import {handleAxiosError} from "../utils/utils.ts";
import { currentAccount } from '../store/userSlice.ts';

export const Axios = axios.create({
    withCredentials: true,
    baseURL: apiBaseUrl,
});

export const getUsers = async (currentUser: currentAccount | null) => {
    try {
        const { data } = await Axios(`/user/getusers?limit=5`);
        if (currentUser?.isAdmin) {
            return data.data;
        }
    } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
    }
}

export const getPosts = async (currentUser: currentAccount | null) => {
    try {
        const { data } = await Axios(`/post/getposts?limit=5`);
        if (currentUser?.isAdmin) {
            return data.data;
        }
    } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
    }
}

export const getComments = async (currentUser: currentAccount | null) => {
    try {
        const { data } = await Axios(`/comment/getAllComments?limit=5`);
        if (currentUser?.isAdmin) {
            return data.data;
        }
    } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
    }
}

export const getSinglePost = async (postSlug: string | undefined) => {
    try {
        const { data } = await Axios(`/post/getposts?slug=${postSlug}`);
        return data.data.posts[0];
    } catch (error) {
        const err = handleAxiosError(error);
        console.log(err);
    }
}

export const getRecentPosts = async () => {
    try {
        const { data } = await Axios(`/post/getallposts`);
        return data.data.posts.reverse().slice(0, 10);
    } catch (error) {
        const err = handleAxiosError(error);
        console.log(err);
    }
}

export const getAllArticlesCategory = async (category: string) => {
    try {
        const { data } = await Axios(`/post/getallposts?category=${category}`);
        return data.data.posts.reverse().slice(0, 9);
    } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
        return err;
    }
}