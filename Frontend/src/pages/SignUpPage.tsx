import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { lazy, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Axios } from "../config/api";

import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

import { handleAxiosError } from "../utils/utils";

const OAuth = lazy(() => import("../components/OAuth"));
const ShowAlert = lazy(() => import("../components/showAlert"));

type SignUpData = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null | undefined>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<SignUpData>();

  //Form Submit.....*;
  const handleFormSubmit = async (formData: SignUpData) => {
    setLoading(true);
    try {
      setError(null);
      await Axios.post(`/auth/register`, formData);
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      const err = await handleAxiosError(error);
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="m-6">
      <div className="flex flex-row items-center gap-6 p-2 max-w-6xl mx-auto">
        <div className="flex-1 hidden md:block">
          <div className="relative flex flex-col max-h-[35rem] md:max-w-[25rem] lg:max-w-[25rem] overflow-hidden rounded-md">
            <img
              src="/assets/images/image.jpg"
              alt="Sign-up left side image"
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
              <Label value="Your name: " htmlFor="fullname" />
              <TextInput
                type="text"
                placeholder="Your Full Name"
                id="fullname"
                autoComplete="on"
                {...register("fullName", {
                  required: "Full name is required.",
                })}
              />
              <p className="h-2 p-3 pb-5 text-neutral">
                {errors.fullName?.message}
              </p>
            </div>
            <div>
              <Label value="Your username: " htmlFor="username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                autoComplete="n"
                {...register("userName", {
                  required: "Please enter your username.",
                })}
              />
              <p className="h-2 p-3 pb-8 text-neutral">
                {errors.userName?.message}
              </p>
            </div>
            <div>
              <Label value="Your email: " htmlFor="email" />
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
            <div>
              <Label
                value="Confirm your password: "
                htmlFor="confirmPassword"
              />
              <TextInput
                type="password"
                placeholder="Password confirmation"
                id="confirmPassword"
                autoComplete="on"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Please confirm your password.",
                  },
                  validate: (value) => {
                    return (
                      watch("password") === value ||
                      "The password doesn't match."
                    );
                  },
                })}
              />
              <p className="h-2 p-3 pb-5 text-neutral">
                {errors.confirmPassword?.message}
              </p>
            </div>
            <Button
              className="text-white bg-[#63d052] focus:ring-[#63d052] rounded-md py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#63d052]"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="h-2 p-3 pb-5 text-neutral">
            <span>Have an account already?</span>
            <Link to={"/sign-in"} className="text-blue-400 hover:text-blue-200">
              Sign In
            </Link>
          </div>
          {error && (
            <ShowAlert
              message={error}
              type={"failure"}
              className={"mt-5 text-center"}
              onClose={() => setError(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
