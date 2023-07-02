import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { hasAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!hasAuth) navigate("/");
    },
    [hasAuth, navigate]
  );

  return hasAuth && children;
}

export default ProtectedRoute;
