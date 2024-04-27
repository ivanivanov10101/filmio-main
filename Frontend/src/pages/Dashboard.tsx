import {lazy, useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
const DashSidebar = lazy(() => import("../components/DashBoard/DashSidebar"));
const DashProfile = lazy(() => import("../components/DashBoard/DashProfile"));
const DashPosts = lazy(() => import("../components/DashBoard/DashPosts"));
const DashUsers = lazy(() => import("../components/DashBoard/DashUsers"));
const DashComments = lazy(() => import("../components/DashBoard/DashComments"));
const DashBoardComp = lazy(() => import("../components/DashBoard/DashBoardComp"));

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState<string | null>();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        setTab(tabFromUrl);
    }, [location.search]);

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:min-h-screen min-w-56">
                <DashSidebar />
            </div>
            {tab === null && <DashBoardComp />}
            {tab === "profile" && <DashProfile />}
            {tab === "posts" && <DashPosts />}
            {tab === "users" && <DashUsers />}
            {tab === "comments" && <DashComments />}
        </div>
    );
};

export default Dashboard;
