import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, Users as UsersIcon, UserCheck, Handshake, Image, BadgeCheck, LogOut, BarChart3, Shield } from "lucide-react";

const links = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/inscriptions", icon: Users, label: "Inscriptions" },
  { path: "/admin/mentors", icon: UserCheck, label: "Mentors" },
  { path: "/admin/partenaires", icon: Handshake, label: "Partenaires" },
  { path: "/admin/galerie", icon: Image, label: "Galerie" },
  { path: "/admin/badges", icon: BadgeCheck, label: "Badges" },
  { path: "/admin/comite", icon: UsersIcon, label: "Comité" },
  { path: "/admin/attribution", icon: Shield, label: "Attribution", sensitive: true },
  { path: "/admin/statistiques", icon: BarChart3, label: "Statistiques" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white">
      <aside className="hidden lg:flex w-60 flex-col border-r border-[#E9ECEF] bg-white p-4 shadow-lg">
        <Link to="/admin/dashboard" className="font-display text-lg font-bold text-[#24366E] mb-6 px-2 hover:text-[#FEEB09] transition-colors">
          Admin Panel
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <Link key={l.path} to={l.path}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                l.sensitive 
                  ? location.pathname === l.path 
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25 border border-red-600/30' 
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200/50'
                  : location.pathname === l.path 
                    ? 'bg-gradient-to-r from-[#24366E] to-[#24366E] text-white shadow-lg shadow-[#24366E]/25 border border-[#24366E]/20' 
                    : 'text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA] hover:border hover:border-[#E9ECEF]/50'
              }`}>
              <l.icon size={16} className={location.pathname === l.path ? 'text-white' : l.sensitive ? 'text-red-600' : 'text-[#24366E]'} /> {l.label}
              {l.sensitive && (
                <span className="ml-auto">
                  <Shield size={12} className={location.pathname === l.path ? 'text-white' : 'text-red-500'} />
                </span>
              )}
            </Link>
          ))}
        </nav>
        <button onClick={signOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#DC2626] hover:bg-[#DC2626]/10 hover:text-[#B91C1C] transition-colors mt-auto border border-[#DC2626]/20">
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#E9ECEF] bg-white flex overflow-x-auto shadow-lg">
        {links.slice(0, 5).map((l) => (
          <Link key={l.path} to={l.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] min-w-[64px] transition-all duration-300 ${
              location.pathname === l.path 
                ? 'text-[#24366E] bg-[#24366E]/10 border-t-2 border-t-[#24366E]' 
                : 'text-[#6C757D] hover:text-[#212529] hover:bg-[#F8F9FA]'
            }`}>
            <l.icon size={18} className={location.pathname === l.path ? 'text-[#24366E]' : 'text-[#6C757D]'} /> {l.label}
          </Link>
        ))}
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
