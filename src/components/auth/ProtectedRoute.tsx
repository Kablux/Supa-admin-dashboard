import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.ReactElement {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
