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

    const getCodeFromUrl = (): string | null => {
      const hash = window.location.hash;
      const search = window.location.search;

      if (hash.includes("?")) {
        const hashParams = new URLSearchParams(hash.split("?")[1]);
        return hashParams.get("code");
      }

      if (search) {
        const searchParams = new URLSearchParams(search);
        return searchParams.get("code");
      }

      return null;
    };

    const code = getCodeFromUrl();

    if (!code) {
      console.error("Код авторизации не найден в URL");
      navigate("/signin", { replace: true });
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
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error("Ошибка при авторизации:", err);
        navigate("/signin", { replace: true });
      });
  }, [dispatch, navigate]);

  return <Spinner />;
};
