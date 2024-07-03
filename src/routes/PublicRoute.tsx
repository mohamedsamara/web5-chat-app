import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "lib/hooks";

const PublicRoute = () => {
  const { profileCreated } = useProfile();

  if (profileCreated) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;
