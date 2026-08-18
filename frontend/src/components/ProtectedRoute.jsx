import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  adminOnly = false
}) {

  const {
    user,
    isLoggedIn
  } = useAuth();


  // =========================
  // NOT LOGGED IN
  // =========================

  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // =========================
  // ADMIN ONLY
  // =========================

  if (
    adminOnly &&
    user?.role !== "admin"
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  // =========================
  // ALLOW ACCESS
  // =========================

  return children;

}

export default ProtectedRoute;