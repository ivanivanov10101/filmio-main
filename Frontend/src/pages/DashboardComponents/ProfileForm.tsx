import { Button, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdEditOff, MdEmail, MdModeEdit } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { UseFormRegister } from "react-hook-form";
import { profileFormData } from "./DashboardProfile.tsx";
import {
  currentAccount,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserSuccess,
} from "../../store/userSlice.ts";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useAppDispatch } from "../../store/storeHooks.ts";
import { handleAxiosError } from "../../utils/utils.ts";
import { Axios } from "../../config/api.ts";
import {FaPerson} from "react-icons/fa6";

type PropsType = {
  register: UseFormRegister<profileFormData>;
  currentUser: currentAccount | null;
  loading: boolean;
};

const ProfileForm = ({ register, currentUser, loading }: PropsType) => {
  const [isUsernameDisabled, setIsUsernameDisabled] = useState<boolean>(true);
  const [isFullnameDisabled, setIsFullnameDisabled] = useState<boolean>(true);
  const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState<boolean>(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // Delete User....*:
  const handleDeleteUser = async () => {
    setShowModal(false);
    dispatch(deleteUserStart());
    try {
      await Axios.delete(`/user/delete/${currentUser?._id}`);
      dispatch(deleteUserSuccess());
    } catch (error) {
      const err = await handleAxiosError(error);
      dispatch(deleteUserFailure(err));
    }
  };

  // SignOut User....*:
  const handleSignout = async () => {
    setShowModal(false);
    try {
      await Axios.post(`/user/logout/${currentUser?._id}`);
      dispatch(signoutUserSuccess());
    } catch (error) {
      const err = await handleAxiosError(error);
      dispatch(deleteUserFailure(err));
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <label className="relative" htmlFor="fullName">
          <TextInput
              type="text"
              id="fullName"
              placeholder="Your full name."
              icon={FaPerson}
              defaultValue={currentUser?.fullName}
              disabled={isFullnameDisabled}
              {...register("fullName")}
          />
          <span
              className="absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-3 top-2 hover:bg-blue-900 hover:text-white"
              onClick={() => setIsFullnameDisabled((prev) => !prev)}
          >
            {isFullnameDisabled ? <MdModeEdit/> : <MdEditOff/>}
          </span>
        </label>
        <label className="relative" htmlFor="userName">
          <TextInput
              type="text"
              id="userName"
              placeholder="Your username"
              icon={FaUserCircle}
              defaultValue={currentUser?.userName}
              disabled={isUsernameDisabled}
              {...register("userName")}
          />
          <span
              className="absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-3 top-2 hover:bg-blue-900 hover:text-white"
              onClick={() => setIsUsernameDisabled((prev) => !prev)}
          >
            {isUsernameDisabled ? <MdModeEdit/> : <MdEditOff/>}
          </span>
        </label>
        <label className="relative" htmlFor="email">
          <TextInput
              type="email"
              id="email"
              placeholder="Your email"
              icon={MdEmail}
              defaultValue={currentUser?.email}
              disabled={isEmailDisabled}
              {...register("email", {
                pattern: {
                  value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                  message: "Invalid Email Id",
                },
              })}
          />
          <span
              className="absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-3 top-2 hover:bg-blue-900 hover:text-white"
              onClick={() => setIsEmailDisabled((prev) => !prev)}
          >
            {isEmailDisabled ? <MdModeEdit/> : <MdEditOff/>}
          </span>
        </label>

        <label className="relative" htmlFor="password">
          <TextInput
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              disabled={isPasswordDisabled}
              icon={RiLockPasswordFill}
              placeholder="*************"
              {...register("password", {
                validate: {
                  lengthError: (value) => {
                    if (!isPasswordDisabled && value) {
                      return (
                          value.length >= 8 ||
                          "password must be at least 8 characters"
                      );
                    }
                  },
                },
              })}
          />
          <span
              className="absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-10 top-2 hover:bg-blue-900 hover:text-white"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? <BsFillEyeFill/> : <BsFillEyeSlashFill/>}
          </span>
          <span
              className="absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-3 top-2 hover:bg-blue-900 hover:text-white"
              onClick={() => setIsPasswordDisabled((prev) => !prev)}
          >
            {isPasswordDisabled ? <MdModeEdit/> : <MdEditOff/>}
          </span>
        </label>
        <Button
            type="submit"
            disabled={loading}
            className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973]"
        >
          {loading ? "Loading..." : "Update"}
        </Button>
      </div>
      <div className="flex justify-between mt-4 text-red-500">
        <Button
            className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973] cursor-pointer"
            onClick={() => setShowModal(true)}
        >
          Delete Account
        </Button>
        <Button
            className="text-white bg-[#63d052] hover:bg-[#81d973] focus:outline-none focus:ring-[#81d973] font-medium rounded-md text-sm py-0.5 text-center dark:bg-[#63d052] dark:hover:bg-[#63d052] dark:focus:ring-[#81d973] cursor-pointer"
            onClick={handleSignout}
        >
          Sign Out
        </Button>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-5">
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
                color="gray"
                outline
              >
                No
              </Button>
              <Button color="failure" onClick={handleDeleteUser}>
                Yes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileForm;
