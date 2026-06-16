import { useOwnership } from "@/shared/hooks/useOwnership";

interface IfOwnerProps {
  ownerId: string | undefined;
  children: JSX.Element;
}

export const IfOwner: React.FC<IfOwnerProps> = ({ ownerId, children }) => {
  const { isOwner } = useOwnership(ownerId);
  if (!isOwner) return null;
  return children;
};
