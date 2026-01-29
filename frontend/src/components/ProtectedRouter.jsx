import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRouter({
  adminRoute = false,
  children,
}) {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminRoute && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRouter;

export const AuthRouteWrapper = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.user);
  return isAuthenticated ? <Navigate to="/profile" replace /> : children;
};

