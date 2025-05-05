// components/ProtectedRoute.tsx
import { useAuth } from "../hooks/auth-context";
import { Route, useLocation } from "wouter";
import { ComponentType } from "react";

interface ProtectedRouteProps {
  path: string;
  component: ComponentType<any>;
}

const ProtectedRoute = ({ path, component }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/auth");
    return null;
  }

  return <Route path={path} component={component} />;
};

export default ProtectedRoute;
