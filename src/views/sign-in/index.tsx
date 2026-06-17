// src/views/sign-in/index.tsx

import { authApi } from "@/shared/api/auth-api";
import { selectIsAuthenticated } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const SignInPage = () => {
  const [authUrl, setAuthUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    document.title = "Вход | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    authApi
      .getYandexAuthUrl()
      .then((res) => {
        setAuthUrl(res.data.url);
      })
      .catch((err) => {
        console.error("Ошибка получения URL авторизации:", err);
        setError("Не удалось загрузить страницу входа. Попробуйте позже.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };
  return (
    <main className="container mx-auto px-4 py-12 sm:py-16 max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Вход в аккаунт</h1>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4" role="alert">
            {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-4" role="status" aria-live="polite">
            <div className="spinner-border animate-spin w-6 h-6 border-2 rounded-full border-t-blue-600" />
            <span className="sr-only">Загрузка...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogin}
            disabled={!authUrl}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Войти через Яндекс"
          >
            Войти через Яндекс
          </button>
        )}
      </div>
    </main>
  );
};

export default SignInPage;
