import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {lazy, Suspense, useEffect} from "react";
import { Axios } from "./config/api";
import { handleAxiosError } from "./utils/utils";
import { useAppDispatch } from "./store/storeHooks";
import { setUserState } from "./store/features/user/userSlice";
import { SkeletonTheme } from "react-loading-skeleton";

const About = lazy(() => import("./pages/About"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
import Layout from "./Layouts/Layout";
import CreatePost from "./pages/CreatePost";
import PrivateRoute from "./components/PrivateRoutes/PrivateRoute";
import PrivateAuthRoute from "./components/PrivateRoutes/PrivateAuthRoute";
import OnlyAdminPrivateRoute from "./components/PrivateRoutes/OnlyAdminPrivateRoute";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Error from "./pages/Error";

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
        <Suspense fallback={null}>
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
