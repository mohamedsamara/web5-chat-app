import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "lib/hooks";

const ProtectedRoute = () => {
  const { profileReady } = useProfile();

  if (!profileReady) return <Navigate to="/create-profile" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
