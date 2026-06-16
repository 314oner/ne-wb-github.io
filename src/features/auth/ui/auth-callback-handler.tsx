// src/features/auth/ui/auth-callback-handler.tsx

import { userMapper } from "@/entities/user/model/user.mapper";
import { authApi } from "@/shared/api/auth-api";
import { Spinner } from "@/shared/ui";
import { setCredentials } from "@/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AuthCallbackHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then((response) => {
        const userDto = response.data;
        const user = userMapper.toEntity(userDto);
        dispatch(setCredentials({ user }));
        navigate("/");
      })
      .catch((err) => {
        console.error("Auth failed", err);
        navigate("/signin");
      });
  }, [dispatch, navigate]);

  return <Spinner />;
};
