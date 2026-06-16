
import { Spinner } from "@/shared/ui";
import { Suspense } from "react";

export const LazyLoad = (Comp: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<Spinner />}>
    <Comp />
  </Suspense>
);

export default LazyLoad;
