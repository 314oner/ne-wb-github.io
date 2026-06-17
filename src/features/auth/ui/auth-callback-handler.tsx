// src/features/auth/ui/auth-callback-handler.tsx

import { userMapper } from "@/entities/user/model/user.mapper";
import { authApi } from "@/shared/api/auth-api";
import { Spinner } from "@/shared/ui";
import { setCredentials } from "@/store";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AuthCallbackHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isExchanging = useRef(false);

  useEffect(() => {
    if (isExchanging.current) return;
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      console.error("Код авторизации не найден в URL");
      navigate("/signin");
      return;
    }

    isExchanging.current = true;
    authApi
      .exchangeCode(code)
      .then((exchangeResponse) => {
        const { token } = exchangeResponse.data;
        localStorage.setItem("token", token);
        return authApi.getCurrentUser();
      })
      .then((userResponse) => {
        if (userResponse) {
          const userDto = userResponse.data;
          const user = userMapper.toEntity(userDto);
          dispatch(setCredentials({ user }));
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Ошибка при авторизации:", err);
        navigate("/signin");
      });
  }, [dispatch, navigate]);

  return <Spinner />;
};
