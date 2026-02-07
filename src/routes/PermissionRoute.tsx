import { Navigate } from "react-router-dom";
import { usePermissions } from "../hooks/usePermissions";

export default function PermissionRoute({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const permissions = usePermissions();

  if (!permissions.includes(permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
