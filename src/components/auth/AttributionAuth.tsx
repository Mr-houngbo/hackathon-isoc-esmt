import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";

interface AttributionAuthProps {
  children: React.ReactNode;
}

const AttributionAuth = ({ children }: AttributionAuthProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si déjà authentifié dans cette session
    const auth = sessionStorage.getItem('attribution_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password === "enverse") {
      setIsAuthenticated(true);
      sessionStorage.setItem('attribution_auth', 'true');
    } else {
      setError("Mot de passe incorrect");
      setPassword("");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('attribution_auth');
    setPassword("");
    navigate("/admin/dashboard");
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-950">
        {/* Alertive header */}
        <div className="bg-red-800 border-b border-red-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-300" />
              <div>
                <h1 className="text-xl font-bold text-white">Espace Attribution - Zone Sensible</h1>
                <p className="text-red-300 text-sm">Décisions finales de sélection</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600 text-red-300 hover:bg-red-800 hover:text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              Quitter la zone sensible
            </Button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-950 flex items-center justify-center p-4">
      {/* Background décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float-elegant"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-red-700/30 bg-red-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-6">
            {/* Icône d'avertissement */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">
                Espace Attribution
              </CardTitle>
              <CardDescription className="text-red-300">
                Zone à accès restreint - Décisions irréversibles
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Alertes de sécurité */}
            <Alert className="border-red-500/30 bg-red-900/50 text-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Attention :</strong> Cet espace contient des décisions sensibles et irréversibles.
              </AlertDescription>
            </Alert>

            <Alert className="border-orange-500/30 bg-orange-900/50 text-orange-200">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Double authentification requise pour accéder aux fonctions d'attribution.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="border-red-500/30 bg-red-900/50 text-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-red-300 text-sm font-medium">
                  Mot de passe de sécurité
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez le mot de passe secret"
                    className="bg-red-800/50 border-red-600/30 text-white placeholder-red-300/50 focus:border-red-400 focus:ring-red-400/20 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-red-300 hover:text-white hover:bg-red-700/50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-red-500/25"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Vérification...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Accéder à l'espace sensible</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-red-400/50">
                Session sécurisée • Déconnexion automatique à la fermeture
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttributionAuth;
