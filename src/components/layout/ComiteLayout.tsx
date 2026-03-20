import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Home, 
  FileText, 
  LogOut, 
  User, 
  Menu, 
  X,
  ClipboardList,
  Settings
} from "lucide-react";

const ComiteLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et est un membre du comité
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Vérifier si c'est un membre du comité
      const { data: comiteMember } = await supabase
        .from('comite')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (!comiteMember) {
        toast.error("Accès non autorisé. Vous n'êtes pas membre du comité.");
        navigate('/admin/login');
        return;
      }

      setUser({
        ...session.user,
        ...comiteMember,
        role: 'comite'
      });
      setLoading(false);
    };

    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      icon: FileText,
      label: "Notation des dossiers",
      path: "/comite/notation",
      description: "Évaluer les dossiers assignés"
    },
    {
      icon: User,
      label: "Mon profil",
      path: "/comite/profil",
      description: "Gérer mes informations"
    }
  ];

  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white flex">
      {/* Sidebar pour mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="p-4 border-b border-[#E9ECEF]">
            <div className="flex items-center justify-between">
              <h2 
                className="font-display text-lg font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Comité
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors"
              >
                <X size={20} className="text-[#6C757D]" />
              </button>
            </div>
          </div>
          
          <nav className="p-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
                    : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#212529]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs opacity-75">{item.description}</p>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r border-[#E9ECEF]">
        <div className="p-6 border-b border-[#E9ECEF]">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
              <ClipboardList size={16} className="text-white" />
            </div>
            <div>
              <h1 
                className="font-display text-lg font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Hackathon ISOC-ESMT
              </h1>
              <p 
                className="text-xs text-[#6C757D]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Espace Comité
              </p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
                  : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#212529]'
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <item.icon size={18} />
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs opacity-75">{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E9ECEF]">
          <div className="flex items-center gap-3 mb-4 p-3 bg-[#F8F9FA] rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {user?.nom_prenom}
              </p>
              <p className="text-xs text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Membre du comité
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <LogOut size={18} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header mobile */}
        <div className="lg:hidden bg-white border-b border-[#E9ECEF] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors"
              >
                <Menu size={20} className="text-[#6C757D]" />
              </button>
              <h1 
                className="font-display text-lg font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Espace Comité
              </h1>
            </div>
            
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {user.nom_prenom}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors"
                >
                  <LogOut size={16} className="text-[#6C757D]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ComiteLayout;
