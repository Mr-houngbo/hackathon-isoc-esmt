import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useComiteAuth } from "@/context/ComiteAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Users, Lock } from "lucide-react";

const ComiteLogin = () => {
  const [nomPrenom, setNomPrenom] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn } = useComiteAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn(nomPrenom, password);
    
    if (result.success) {
      navigate("/comite/dashboard");
    } else {
      setError(result.error || "Erreur de connexion");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      {/* Background décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float-elegant"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-blue-700/30 bg-blue-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-6">
            {/* Logo et titre */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white">
                Espace Comité
              </CardTitle>
              <CardDescription className="text-blue-200">
                Accès réservé aux membres du comité de sélection
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-500/30 bg-red-900/50 text-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomPrenom" className="text-blue-200 text-sm font-medium">
                  Nom complet
                </Label>
                <Input
                  id="nomPrenom"
                  type="text"
                  value={nomPrenom}
                  onChange={(e) => setNomPrenom(e.target.value)}
                  placeholder="Entrez votre nom complet"
                  className="bg-blue-800/50 border-blue-600/30 text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-blue-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-200 text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez le mot de passe du comité"
                    className="bg-blue-800/50 border-blue-600/30 text-white placeholder-blue-300/50 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-blue-300 hover:text-white hover:bg-blue-700/50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg transition-all duration-200 hover:shadow-blue-500/25"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Se connecter</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-blue-300/70">
                Accès sécurisé • Session expire à la fermeture du navigateur
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComiteLogin;
