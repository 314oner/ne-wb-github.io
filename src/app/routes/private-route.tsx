import { Spinner } from "@/shared/ui"; // или ваш компонент загрузки
import { selectIsAuthenticated, selectUserInitialized } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = ({ children }: { children?: JSX.Element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialized = useSelector(selectUserInitialized);

  if (!initialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children ? children : <Outlet />;
};
