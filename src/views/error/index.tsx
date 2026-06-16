// src/views/error/index.tsx

import { useTitle } from "@/hooks";
import { Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError() as Error;
  useTitle("Ошибка");

  return (
    <div className="flex items-center justify-center min-h-screen" role="alert">
      <div className="mx-auto my-auto text-center">
        <h1 className="text-xl">Ой, что-то пошло не так...</h1>
        <pre>{error?.message || JSON.stringify(error)}</pre>
        <Link
          to="/"
          className="inline-flex px-4 py-2 rounded-lg transition bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
