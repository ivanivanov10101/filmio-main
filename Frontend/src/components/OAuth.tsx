import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Button, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { firebaseApp } from "../utils/firebase.ts";
import { handleAxiosError } from "../utils/utils";
import { useAppDispatch } from "../store/storeHooks";
import { signInFailure, signInSuccess } from "../store/userSlice.ts";
import { Axios } from "../config/api";
import { useState } from "react";
import {FaGoogle} from "react-icons/fa";

const OAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const firebaseAuth = getAuth(firebaseApp);
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({ prompt: "select_account" });

    setLoading(true);
    try {
      const firebaseOAuthLoginResult = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const completeLoginData = {
        name: firebaseOAuthLoginResult.user.displayName,
        email: firebaseOAuthLoginResult.user.email,
        googlePhotoUrl: firebaseOAuthLoginResult.user.photoURL,
      };

      const { data } = await Axios.post(`/auth/google`, completeLoginData);
      dispatch(signInSuccess(data.data.user));
      setLoading(false);
      navigate("/");
    } catch (error) {
      const err = await handleAxiosError(error);
      dispatch(signInFailure(err));
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogin}
    >
      {loading ? (
        <>
          <Spinner/>
          <span className="pl-3">Loading...</span>
        </>
      ) : (
        <>
          <FaGoogle className="w-6 h-5 mr-2" />
          Continue with Google
        </>
      )}
    </Button>
  );
};

export default OAuth;
