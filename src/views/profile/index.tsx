// src/pages/profile/index.tsx

import { userApi } from "@/shared/api/user-api";
import { Spinner } from "@/shared/ui";
import { selectCurrentUser, selectIsAuthenticated, useAppSelector } from "@/store";
import type { User, UserId } from "@/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type ProfileRouteParams = {
  userId: string;
};

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<ProfileRouteParams>();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const brandedUserId = userId as UserId;

  const isOwnProfile = isAuthenticated && brandedUserId === currentUser?._id;

  useEffect(() => {
    if (profileUser) {
      document.title = `${profileUser.name} | Профиль | Маркетплейс`;
    } else if (brandedUserId) {
      document.title = `Профиль пользователя | Маркетплейс`;
    } else {
      document.title = "Профиль | Маркетплейс";
    }
    return () => {
      document.title = "Маркетплейс";
    };
  }, [profileUser, brandedUserId]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(false);
      try {
        if (isAuthenticated && brandedUserId === currentUser?._id && currentUser) {
          setProfileUser(currentUser);
        } else if (brandedUserId) {
          const response = await userApi.getUserById(brandedUserId);
          setProfileUser(response.data);
        } else {
          setError(true);
        }
      } catch (_err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [brandedUserId, currentUser, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status" aria-live="polite">
        <Spinner aria-label="Загрузка профиля" />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md text-center" role="alert">
          Пользователь не найден
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
        {/* Аватар */}
        {profileUser.profile_picture && (
          <div className="flex justify-center mb-4">
            <img
              src={profileUser.profile_picture}
              alt={`Аватар ${profileUser.name}`}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 break-words">{profileUser.name}</h1>

        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="font-semibold">Email:</span>
            <span className="break-all">{profileUser.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="font-semibold">Продавец:</span>
            <span>{profileUser.seller ? "Да" : "Нет"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="font-semibold">Дата регистрации:</span>
            <span>
              {profileUser.created
                ? new Date(profileUser.created).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>

        {isOwnProfile && (
          <div className="mt-8 text-center">
            <Link
              to={`/user/${profileUser._id}/edit`}
              className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Редактировать профиль
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
