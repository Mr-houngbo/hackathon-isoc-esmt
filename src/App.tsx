import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ComiteAuthProvider } from "@/context/ComiteAuthContext";
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
import VerificationBadge from "./pages/public/VerificationBadge";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import GestionInscriptions from "./pages/admin/GestionInscriptions";
import GestionMentors from "./pages/admin/GestionMentors";
import GestionPartenaires from "./pages/admin/GestionPartenaires";
import GestionGalerie from "./pages/admin/GestionGalerie";
import GestionBadges from "./pages/admin/GestionBadges";
import GestionComite from "./pages/admin/GestionComite";
import Attribution from "./pages/admin/SelectionFinale";
import Statistiques from "./pages/admin/Statistiques";


// Comité pages
import ComiteLogin from "./pages/comite/ComiteLogin";
import ComiteDashboard from "./pages/comite/ComiteDashboard";
import EvaluationDossier from "./pages/comite/EvaluationDossier";
import ComiteEvaluations from "./pages/comite/ComiteEvaluations";
import ComiteLayout from "./components/layout/ComiteLayout";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ComiteAuthProvider>
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
              <Route path="/verification/:badgeId" element={<VerificationBadge />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/inscriptions" element={<ProtectedRoute><GestionInscriptions /></ProtectedRoute>} />
              <Route path="/admin/mentors" element={<ProtectedRoute><GestionMentors /></ProtectedRoute>} />
              <Route path="/admin/partenaires" element={<ProtectedRoute><GestionPartenaires /></ProtectedRoute>} />
              <Route path="/admin/galerie" element={<ProtectedRoute><GestionGalerie /></ProtectedRoute>} />
              <Route path="/admin/badges" element={<ProtectedRoute><GestionBadges /></ProtectedRoute>} />
              <Route path="/admin/comite" element={<ProtectedRoute><GestionComite /></ProtectedRoute>} />
              <Route path="/admin/attribution" element={<ProtectedRoute><Attribution /></ProtectedRoute>} />
              <Route path="/admin/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />


              {/* Comité */}
              <Route path="/comite/login" element={<ComiteLogin />} />
              <Route 
                path="/comite/dashboard" 
                element={
                  <ComiteLayout>
                    <ComiteDashboard />
                  </ComiteLayout>
                } 
              />
              <Route 
                path="/comite/evaluations" 
                element={
                  <ComiteLayout>
                    <ComiteEvaluations />
                  </ComiteLayout>
                } 
              />
              <Route 
                path="/comite/evaluation/:equipeId" 
                element={
                  <ComiteLayout>
                    <EvaluationDossier />
                  </ComiteLayout>
                } 
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ComiteAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
