import { fetchCurrentUser, useAppDispatch } from "@/store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../shared/api/auth-api";
import { Button } from "../../../shared/ui";

export const YandexLoginButton: React.FC = () => {
  const [authUrl, setAuthUrl] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .getYandexAuthUrl()
      .then((res) => setAuthUrl(res.data.url))
      .catch(console.error);
  }, []);

  const handleLogin = () => {
    if (authUrl) window.location.href = authUrl;
  };

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => navigate("/"))
      .catch(() => {});
  }, [dispatch, navigate]);

  return (
    <Button variant="primary" onClick={handleLogin} disabled={!authUrl}>
      Войти через Яндекс
    </Button>
  );
};
