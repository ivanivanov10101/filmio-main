import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { lazy, Suspense, useEffect } from "react";
import { Axios } from "./config/api";
import { handleAxiosError } from "./utils/utils";
import { useAppDispatch } from "./store/storeHooks";
import { setUserState } from "./store/features/user/userSlice";
import { SkeletonTheme } from "react-loading-skeleton";

import Layout from "./Layouts/Layout";
import PrivateRoute from "./components/PrivateRoutes/PrivateRoute";
import PrivateAuthRoute from "./components/PrivateRoutes/PrivateAuthRoute";
import OnlyAdminPrivateRoute from "./components/PrivateRoutes/OnlyAdminPrivateRoute";
import Home from "./pages/Home";
import { Spinner } from "flowbite-react";
const About = lazy(() => import("./pages/About"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const UpdatePost = lazy(() => import("./pages/UpdatePost"));
const PostPage = lazy(() => import("./pages/PostPage"));
const Search = lazy(() => import("./pages/Search"));
const Error = lazy(() => import("./pages/Error"));

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data },
        } = await Axios.get("/auth/validate-token");
        dispatch(setUserState(data.user));
      } catch (error) {
        const err = await handleAxiosError(error);
        console.log(err);
        dispatch(setUserState(null));
      }
    })();
  }, [dispatch]);

  return (
    <SkeletonTheme baseColor="#313131" highlightColor="#525252">
      <Router>
        <Suspense
          fallback={
            <div className="grid w-full min-h-screen place-content-center">
              <Spinner size={"xl"} />
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<PrivateAuthRoute />}>
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/sign-up" element={<Signup />} />
              </Route>
              <Route element={<OnlyAdminPrivateRoute />}>
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/update-post/:postId" element={<UpdatePost />} />
              </Route>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/post/:postSlug" element={<PostPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </SkeletonTheme>
  );
};

export default App;
