import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "lib/hooks";

const PublicRoute = () => {
  const { profileReady } = useProfile();

  if (profileReady) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;
