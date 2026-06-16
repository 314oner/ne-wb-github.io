// src/views/_layouts/app-layout.tsx

import { Header } from "@/app/layouts/header";
import ScrollToTop from "@/app/routes/scroll-to-top";
import { Spinner } from "@/shared/ui";
import { fetchCurrentUser, selectUserInitialized, useAppDispatch, useAppSelector } from "@/store";
import { Suspense, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

const useTranslation = () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      loading: "Загрузка...",
      skip_to_content: "Перейти к содержанию",
    };
    return translations[key] || key;
  },
});

export function AppLayout(): React.ReactElement {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector(selectUserInitialized);
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized]);

  const handleSkip = () => {
    mainRef.current?.focus();
  };

  return (
    <div className="flex flex-col min-h-screen antialiased bg-background text-foreground">
      <ScrollToTop />

      <button
        type="button"
        onClick={handleSkip}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md cursor-pointer"
      >
        {t("skip_to_content")}
      </button>

      <Header />

      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 flex flex-col gap-4 pb-6 pt-6 px-4 sm:px-6 md:px-8 focus:outline-none"
        aria-label="Основное содержимое страницы"
      >
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[50vh]" role="status" aria-live="polite">
              <Spinner aria-label={t("loading")} />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default AppLayout;
