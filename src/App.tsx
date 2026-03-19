import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Inscription from "./pages/Inscription";
import EquipesSelectionnees from "./pages/EquipesSelectionnees";
import ProfilParticipant from "./pages/ProfilParticipant";
import Agenda from "./pages/Agenda";
import Mentors from "./pages/Mentors";
import Partenaires from "./pages/Partenaires";
import Galerie from "./pages/Galerie";
import RetourPostHack from "./pages/RetourPostHack";
import TermesConditions from "./pages/TermesConditions";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import GestionInscriptions from "./pages/admin/GestionInscriptions";
import GestionAgenda from "./pages/admin/GestionAgenda";
import GestionMentors from "./pages/admin/GestionMentors";
import GestionPartenaires from "./pages/admin/GestionPartenaires";
import GestionGalerie from "./pages/admin/GestionGalerie";
import GestionAnnonces from "./pages/admin/GestionAnnonces";
import GestionBadges from "./pages/admin/GestionBadges";
import Classement from "./pages/admin/Classement";
import Statistiques from "./pages/admin/Statistiques";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/equipes-selectionnees" element={<EquipesSelectionnees />} />
            <Route path="/participant/:id" element={<ProfilParticipant />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/partenaires" element={<Partenaires />} />
            <Route path="/galerie" element={<Galerie />} />
            <Route path="/retour" element={<RetourPostHack />} />
            <Route path="/termes-conditions" element={<TermesConditions />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/inscriptions" element={<ProtectedRoute><GestionInscriptions /></ProtectedRoute>} />
            <Route path="/admin/agenda" element={<ProtectedRoute><GestionAgenda /></ProtectedRoute>} />
            <Route path="/admin/mentors" element={<ProtectedRoute><GestionMentors /></ProtectedRoute>} />
            <Route path="/admin/partenaires" element={<ProtectedRoute><GestionPartenaires /></ProtectedRoute>} />
            <Route path="/admin/galerie" element={<ProtectedRoute><GestionGalerie /></ProtectedRoute>} />
            <Route path="/admin/annonces" element={<ProtectedRoute><GestionAnnonces /></ProtectedRoute>} />
            <Route path="/admin/badges" element={<ProtectedRoute><GestionBadges /></ProtectedRoute>} />
            <Route path="/admin/classement" element={<ProtectedRoute><Classement /></ProtectedRoute>} />
            <Route path="/admin/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
