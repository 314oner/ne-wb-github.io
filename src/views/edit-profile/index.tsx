// src/pages/edit-profile/index.tsx

import { userMapper } from "@/entities/user/model/user.mapper";
import { Button, Input, Spinner } from "@/shared/ui";
import { deleteUserAccount, selectCurrentUser, selectUserLoading, updateUserProfile, useAppDispatch, useAppSelector } from "@/store";
import type { UserId } from "@/types";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type EditProfileRouteParams = {
  userId: string;
};

export const EditProfilePage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const isLoadingGlobal = useAppSelector(selectUserLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userId } = useParams<EditProfileRouteParams>();

  // Локальное состояние формы
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [seller, setSeller] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [touched, setTouched] = useState({ name: false, email: false });

  const brandedUserId = userId as UserId;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setSeller(user.seller || false);
    }
  }, [user]);

  useEffect(() => {
    document.title = "Редактирование профиля | Маркетплейс";
    return () => {
      document.title = "Маркетплейс";
    };
  }, []);

  const nameError = touched.name && !name.trim() ? "Имя обязательно" : "";
  const emailError = touched.email && (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) ? "Введите корректный email" : "";

  const isFormValid = name.trim() && email.trim() && !nameError && !emailError;

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка профиля" />
      </div>
    );
  }

  if (user._id !== brandedUserId) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const updateData = userMapper.toDto({ name: name.trim(), email: email.trim(), seller });
      await dispatch(updateUserProfile(updateData)).unwrap();
      toast.success("Профиль успешно обновлён");
      navigate("/profile");
    } catch (err: unknown) {
      const backendError = err as { message?: string } | undefined;
      const errorMessage = backendError?.message || (err instanceof Error ? err.message : "Ошибка обновления профиля");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Вы уверены? Удаление аккаунта необратимо. Все ваши данные будут потеряны.");
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteUserAccount()).unwrap();
      toast.success("Аккаунт удалён");
      navigate("/");
    } catch (err: unknown) {
      const backendError = err as { message?: string } | undefined;
      const errorMessage = backendError?.message || (err instanceof Error ? err.message : "Ошибка удаления аккаунта");
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isSubmitting || isDeleting || isLoadingGlobal;

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Редактирование профиля</h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Поле имени */}
          <div>
            <Input
              label="Имя"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              required
              aria-required="true"
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : undefined}
              disabled={isLoading}
            />
            {nameError && (
              <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">
                {nameError}
              </p>
            )}
          </div>

          {/* Поле email */}
          <div>
            <Input
              label="Email"
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              required
              aria-required="true"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              disabled={isLoading}
            />
            {emailError && (
              <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                {emailError}
              </p>
            )}
          </div>

          {/* Чекбокс продавца */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="edit-seller"
              checked={seller}
              onChange={(e) => setSeller(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="edit-seller" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Я продавец (возможность создавать магазины и товары)
            </label>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={!isFormValid || isLoading} isLoading={isSubmitting}>
              Сохранить изменения
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/profile")} disabled={isLoading}>
              Отмена
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {isDeleting ? "Удаление..." : "Удалить аккаунт"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
