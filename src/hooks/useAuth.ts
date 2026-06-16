import { logoutUser, selectCurrentUser, selectIsAuthenticated, useAppDispatch, useAppSelector } from "@/store";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      // если запрос упал всё равно очищаем локальный стейт
      dispatch({ type: "user/clearUser" });
      console.error("Logout failed", err);
    }
    navigate("/");
  }, [dispatch, navigate]);

  return { isAuthenticated, user, handleLogout };
};
