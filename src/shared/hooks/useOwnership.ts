import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/slices/user-slice";
import { useMemo } from "react";

export const useOwnership = (resourceOwnerId: string | undefined) => {
  const currentUser = useAppSelector(selectCurrentUser);

  const isOwner = useMemo(() => {
    if (!currentUser?._id || !resourceOwnerId) return false;
    return currentUser._id === resourceOwnerId;
  }, [currentUser?._id, resourceOwnerId]);

  return { isOwner, isLoading: false };
};
