import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { lazy, Suspense, useEffect } from "react";
import { Axios } from "./config/api";
import { handleAxiosError } from "./utils/utils";
import { useAppDispatch } from "./store/storeHooks";
import { setUserState } from "./store/userSlice.ts";
import { SkeletonTheme } from "react-loading-skeleton";

import Layout from "./Layouts/Layout";
import PrivateRoute from "./components/PrivateRoutes/PrivateRoute";
import PrivateAuthRoute from "./components/PrivateRoutes/PrivateAuthRoute";
import OnlyAdminPrivateRoute from "./components/PrivateRoutes/OnlyAdminPrivateRoute";
import Home from "./pages/Home";
import { Spinner } from "flowbite-react";
const About = lazy(() => import("./pages/AboutPage.tsx"));
const SignInPage = lazy(() => import("./pages/SignInPage.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.tsx"));
const Dashboard = lazy(
  () => import("./pages/DashboardComponents/Dashboard.tsx"),
);
const CreateArticlePage = lazy(() => import("./pages/CreateArticlePage.tsx"));
const UpdateArticlePage = lazy(() => import("./pages/UpdateArticlePage.tsx"));
const ArticlePage = lazy(() => import("./pages/ArticlePage.tsx"));
const Search = lazy(() => import("./pages/Search"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));

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
    <SkeletonTheme baseColor="#6C7A89" highlightColor="#525252">
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
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
              </Route>
              <Route element={<OnlyAdminPrivateRoute />}>
                <Route path="/create-post" element={<CreateArticlePage />} />
                <Route
                  path="/update-post/:postId"
                  element={<UpdateArticlePage />}
                />
              </Route>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/post/:postSlug" element={<ArticlePage />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </SkeletonTheme>
  );
};

export default App;
