import { lazy, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Axios } from "../config/api";
import { handleAxiosError } from "../utils/utils";

import {
  setUserError,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../store/userSlice.ts";

import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";
const OAuth = lazy(() => import("../components/OAuth"));
const ShowAlert = lazy(() => import("../components/showAlert"));

type SignInData = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignInPage = () => {
  const { loading, error } = useAppSelector((state) => state.user);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInData>();

  //Form Submit.....*;
  const handleFormSubmit = async (formData: SignInData) => {
    try {
      dispatch(signInStart());
      const { data } = await Axios.post(`/auth/login`, formData, {
        withCredentials: true,
      });
      dispatch(signInSuccess(data.data.user));
      navigate("/");
    } catch (error) {
      const err = await handleAxiosError(error);
      dispatch(signInFailure(err));
    }
  };

  return (
    <div className="m-6">
      <div className="flex flex-row items-center gap-6 p-2 max-w-6xl mx-auto">
        <div className="flex-1 hidden md:block">
          <div className="relative flex flex-col max-h-[35rem] md:max-w-[25rem] lg:max-w-[25rem] overflow-hidden rounded-md">
            <img
              src="/assets/images/image.jpg"
              alt="Sign-in left side image"
              className="h-[700px]"
            />
          </div>
        </div>
        <div className="flex-1">
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div>
              <Label value="Your Email address:" htmlFor="email" />
              <TextInput
                type="email"
                placeholder="email@emailprovider.com"
                id="email"
                autoComplete="on"
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    message: "Invalid Email Format",
                  },
                })}
              />
              <p className="h-2 p-3 pb-5 text-neutral">
                {errors.email?.message}
              </p>
            </div>
            <div className="relative">
              <Label value="Your password: " htmlFor="password" />
              <TextInput
                type={passwordVisibility ? "text" : "password"}
                placeholder="Password"
                id="password"
                autoComplete="on"
                {...register("password", {
                  required: "Please enter your password.",
                  validate: {
                    lengthError: (value) => {
                      return (
                        value.length >= 8 ||
                        "Your password must be at least 8 characters long."
                      );
                    },
                  },
                })}
              />
              <span
                className="absolute p-1.5 rounded-full cursor-pointer right-3 top-8 hover:bg-blue-900 hover:text-white"
                onClick={() => setPasswordVisibility((prev) => !prev)}
              >
                {passwordVisibility ? (
                  <BsFillEyeFill />
                ) : (
                  <BsFillEyeSlashFill />
                )}
              </span>
              <p className="h-2 p-3 pb-8 text-neutral">
                {errors.password?.message}
              </p>
            </div>
            <Button
              className="text-white bg-[#63d052] focus:ring-[#63d052] rounded-md py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#63d052]"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner/>
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="h-2 p-3 pb-5 text-neutral">
            <span className="pr-2">Don't have an account yet?</span>
            <Link
              to={"/sign-up"}
              className="text-blue-500 hover:text-blue-100"
            >
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

export default SignInPage;
