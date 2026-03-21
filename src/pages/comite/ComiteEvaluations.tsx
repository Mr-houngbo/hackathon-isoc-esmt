import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComiteEvaluations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers le dashboard qui contient la liste des évaluations
    navigate("/comite/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-blue-300">Redirection vers les évaluations...</p>
      </div>
    </div>
  );
};

export default ComiteEvaluations;
