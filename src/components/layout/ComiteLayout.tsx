import { ReactNode } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useComiteAuth } from "@/context/ComiteAuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  Users,
  CheckCircle,
  Clock
} from "lucide-react";

const ComiteLayout = ({ children }: { children: ReactNode }) => {
  const { comiteMember, signOut } = useComiteAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/comite/login";
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Background décoratif */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-float-elegant"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-float-elegant" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900/80 backdrop-blur-xl border-r border-blue-700/30 min-h-screen">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Espace Comité</h1>
                  <p className="text-xs text-blue-300/70">Évaluation des dossiers</p>
                </div>
              </div>

              {/* User info */}
              {comiteMember && (
                <div className="bg-blue-800/50 rounded-lg p-3 border border-blue-700/30">
                  <p className="text-sm font-medium text-white truncate">
                    {comiteMember.nom_prenom}
                  </p>
                  <p className="text-xs text-blue-300/70 truncate">
                    {comiteMember.email}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <Link
                to="/comite/dashboard"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActiveLink("/comite/dashboard")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-300/70 hover:bg-blue-800/50 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </nav>

            {/* Logout */}
            <div className="pt-4 border-t border-blue-700/30">
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-blue-300/70 hover:bg-blue-800/50 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="text-sm font-medium">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="bg-blue-900/60 backdrop-blur-xl border-b border-blue-700/30 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-white">
                  Bienvenue, {comiteMember?.nom_prenom}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-blue-300/70">
                  <Clock className="w-3 h-3" />
                  <span>Session sécurisée</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs text-blue-300/70">
                  <CheckCircle className="w-3 h-3" />
                  <span>Évaluateur authentifié</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="p-8">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComiteLayout;
