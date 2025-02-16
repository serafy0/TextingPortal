import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

type Props = { children: React.ReactNode };

const PublicRoute = ({ children }: Props) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default PublicRoute;
