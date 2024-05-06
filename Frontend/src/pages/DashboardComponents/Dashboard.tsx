import { lazy, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const DashboardSidebar = lazy(
  () => import("./DashboardSidebar.tsx"),
);
const DashboardProfile = lazy(
  () => import("./DashboardProfile.tsx"),
);
const DashboardPosts = lazy(
  () => import("./DashboardPosts.tsx"),
);
const DashboardUsers = lazy(
  () => import("./DashboardUsers.tsx"),
);
const DashboardComments = lazy(
  () => import("./DashboardComments.tsx"),
);
const DashboardMainPage = lazy(
  () => import("./DashboardMainPage.tsx"),
);

const Dashboard = () => {
  const location = useLocation();
  const [tabNameFromParam, setTabNameFromParam] = useState<string | null>();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrlParam = urlParams.get("tab");
    setTabNameFromParam(tabUrlParam);
  }, [location.search]);

  return (
    <div className="md:flex-row flex flex-col">
      <div>
        <DashboardSidebar />
      </div>
      {tabNameFromParam === null && <DashboardMainPage />}
      {tabNameFromParam === "profile" && <DashboardProfile />}
      {tabNameFromParam === "posts" && <DashboardPosts />}
      {tabNameFromParam === "users" && <DashboardUsers />}
      {tabNameFromParam === "comments" && <DashboardComments />}
    </div>
  );
};

export default Dashboard;