import { Button, Label, Spinner, TextInput } from "flowbite-react";
import {lazy, useState} from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../config/api";
import { handleAxiosError } from "../utils/utils";

import {
    setUserError,
    signInFailure,
    signInStart,
    signInSuccess,
} from "../store/features/user/userSlice";

// React Icons...
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";
const OAuth = lazy(() => import("../components/OAuth"));
const ShowAlert = lazy(() => import("../components/showAlert"));

type SignInFormData = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Signin = () => {
    const { loading, error } = useAppSelector((state) => state.user);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<SignInFormData>();

    //Form Submit.....*;
    const handleFormSubmit = async (formData: SignInFormData) => {
        try {
            dispatch(signInStart());
            const { data } = await Axios.post(`/auth/login`, formData, {withCredentials: true});
            dispatch(signInSuccess(data.data.user));
            navigate("/");
        } catch (error) {
            const err = await handleAxiosError(error);
            dispatch(signInFailure(err));
        }
    };

    return (
        <div className="my-10">
            <div className="flex flex-row items-center justify-center max-w-5xl gap-5 p-3 mx-auto rounded-md">
                {/* Left */}
                <div className="flex-1 hidden md:block">
                    <div className="relative flex flex-col  max-h-[600px] md:max-w-[380px] lg:max-w-[400px]  items-center overflow-hidden rounded-md group ">
                        <img src="/assets/images/image.jpg" alt="" className="h-[700px] w-full" />
                        <div className="absolute hidden w-full h-full"></div>
                        <Link
                            to={"/"}
                            className="absolute flex justify-center mb-10 text-4xl font-bold  sm:text-xl dark:text-white"
                        ></Link>
                    </div>
                </div>

                {/* Right */}
                <div className="flex-1">
                    <div className="block md:hidden">
                        <Link
                            to={"/"}
                            className="flex justify-center mb-10 text-4xl font-bold sm:text-xl dark:text-white"
                        ></Link>
                    </div>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit(handleFormSubmit)}
                    >
                        <div>
                            <Label value="Your email" htmlFor="email" />
                            <TextInput
                                type="email"
                                placeholder="name@company.com"
                                id="email"
                                autoComplete="off"
                                {...register("email", {
                                    required: "email is required",
                                    pattern: {
                                        value:
                                            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                        message: "Invalid Email Id",
                                    },
                                    validate: {
                                        blockDomain: (value) => {
                                            return (
                                                !value.endsWith("test.com") ||
                                                "This is not a valid domain"
                                            );
                                        },
                                        lengthError: (value) => {
                                            return (
                                                value.length > 6 || "please enter a valid email address"
                                            );
                                        },
                                    },
                                })}
                            />
                            <p className="h-2 px-3 pt-1 pb-3 text-sm text-red-500">
                                {errors.email?.message}
                            </p>
                        </div>
                        <div className="relative">
                            <Label value="Your password" htmlFor="password" />
                            <TextInput
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="**********"
                                id="password"
                                autoComplete="off"
                                {...register("password", {
                                    required: "password is required",
                                    validate: {
                                        lengthError: (value) => {
                                            return (
                                                value.length >= 8 ||
                                                "password must be atleast 8 characters"
                                            );
                                        },
                                    },
                                })}
                            />
                            <span
                                className="absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-2 top-8 hover:bg-blue-900 hover:text-white"
                                onClick={() => setIsPasswordVisible((prev) => !prev)}
                            >
                {isPasswordVisible ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
              </span>
                            <p className="h-2 px-3 pt-1 pb-3 text-sm text-red-500">
                                {errors.password?.message}
                            </p>
                        </div>
                        <Button
                            className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size={"sm"} />
                                    <span className="pl-3">Loading...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-1 mt-5 text-sm">
                        <span>Don't have an account yet?</span>
                        <Link to={"/sign-up"} className="text-blue-400 underline hover:text-blue-200">
                            Sign Up
                        </Link>
                    </div>
                    {error && (
                        <ShowAlert
                            message={error}
                            type={"failure"}
                            className={"mt-5 text-center"}
                            onClose={() => dispatch(setUserError(null))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signin;
