// src/widgets/navigation/ui/navigation.tsx

import { useAuth } from "@/hooks/useAuth";
import { selectCartItems, useAppSelector } from "@/store";
import React from "react";
import { HiHome, HiLogin, HiLogout, HiShoppingBag, HiShoppingCart, HiUser } from "react-icons/hi";
import { NavLink } from "react-router-dom";

export const Navigation: React.FC = () => {
  const { isAuthenticated, user, handleLogout } = useAuth();
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="hidden md:flex items-center gap-2">
      <NavLink to="/" className={linkClass}>
        <HiHome className="w-4 h-4" /> Главная
      </NavLink>
      <NavLink to="/shops/all" className={linkClass}>
        <HiShoppingCart className="w-4 h-4" /> Магазины
      </NavLink>
      <NavLink to="/auctions/all" className={linkClass}>
        <HiShoppingBag className="w-4 h-4" /> Аукционы
      </NavLink>
      <NavLink to="/cart" className={linkClass}>
        <span className="relative">
          Корзина
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </span>
      </NavLink>

      {!isAuthenticated ? (
        <>
          <NavLink to="/signin" className={linkClass}>
            <HiLogin className="w-4 h-4" /> Войти
          </NavLink>
        </>
      ) : (
        <>
          {user?.seller && (
            <>
              <NavLink to="/seller/shops" className={linkClass}>
                Мои магазины
              </NavLink>
              <NavLink to="/myauctions" className={linkClass}>
                Мои аукционы
              </NavLink>
            </>
          )}
          <NavLink to={`/user/${user?._id}/edit`} className={linkClass}>
            <HiUser className="w-4 h-4" /> Мой профиль
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <HiLogout className="w-4 h-4" /> Выйти
          </button>
        </>
      )}
    </div>
  );
};
