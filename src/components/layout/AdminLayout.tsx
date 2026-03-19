import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, Calendar, UserCheck, Handshake, Image, Megaphone, BadgeCheck, LogOut } from "lucide-react";

const links = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/inscriptions", icon: Users, label: "Inscriptions" },
  { path: "/admin/agenda", icon: Calendar, label: "Agenda" },
  { path: "/admin/mentors", icon: UserCheck, label: "Mentors" },
  { path: "/admin/partenaires", icon: Handshake, label: "Partenaires" },
  { path: "/admin/galerie", icon: Image, label: "Galerie" },
  { path: "/admin/annonces", icon: Megaphone, label: "Annonces" },
  { path: "/admin/badges", icon: BadgeCheck, label: "Badges" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-muted/30 p-4">
        <Link to="/admin/dashboard" className="font-display text-lg font-bold text-primary mb-6 px-2">
          Admin Panel
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <Link key={l.path} to={l.path}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === l.path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}>
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={signOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-auto">
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background flex overflow-x-auto">
        {links.slice(0, 5).map((l) => (
          <Link key={l.path} to={l.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] min-w-[64px] ${
              location.pathname === l.path ? 'text-primary' : 'text-muted-foreground'
            }`}>
            <l.icon size={18} /> {l.label}
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
