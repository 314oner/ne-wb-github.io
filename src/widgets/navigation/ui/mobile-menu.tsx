// src/widgets/navigation/ui/mobile-menu.tsx

import { useAuth } from "@/hooks/useAuth";
import { selectCartItems, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { NavLink } from "react-router-dom";

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isAuthenticated, user, handleLogout } = useAuth();
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const onLogout = () => {
    handleLogout();
    closeMenu();
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={isOpen}
      >
        {isOpen ? <HiX className="w-6 h-6" aria-hidden="true" /> : <HiMenu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 p-4 space-y-2">
          <NavLink to="/" className={linkClass} onClick={closeMenu}>
            Главная
          </NavLink>
          <NavLink to="/shops/all" className={linkClass} onClick={closeMenu}>
            Магазины
          </NavLink>
          <NavLink to="/auctions/all" className={linkClass} onClick={closeMenu}>
            Аукционы
          </NavLink>
          <NavLink to="/cart" className={linkClass} onClick={closeMenu}>
            Корзина {cartCount > 0 && `(${cartCount})`}
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink to="/signin" className={linkClass} onClick={closeMenu}>
                Войти
              </NavLink>
            </>
          ) : (
            <>
              {user?.seller && (
                <>
                  <NavLink to="/seller/shops" className={linkClass} onClick={closeMenu}>
                    Мои магазины
                  </NavLink>
                  <NavLink to="/myauctions" className={linkClass} onClick={closeMenu}>
                    Мои аукционы
                  </NavLink>
                </>
              )}
              <NavLink to={`/user/${user?._id}/edit`} className={linkClass} onClick={closeMenu}>
                Мой профиль
              </NavLink>
              <button
                type="button"
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Выйти
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};
