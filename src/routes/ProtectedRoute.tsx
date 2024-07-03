import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "lib/hooks";

const ProtectedRoute = () => {
  const { profileCreated } = useProfile();

  if (!profileCreated) return <Navigate to="/create-profile" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
