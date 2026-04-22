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
import InscriptionsFermees from "./pages/InscriptionsFermees";
import EquipesSelectionnees from "./pages/EquipesSelectionnees";
import Agenda from "./pages/Agenda";
import Mentors from "./pages/Mentors";
import Partenaires from "./pages/Partenaires";
import Galerie from "./pages/Galerie";
import TermesConditions from "./pages/TermesConditions";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Thematiques from "./pages/Thematiques";
import VerificationBadge from "./pages/public/VerificationBadge";
import Feedback from "./pages/Feedback";
import Laureats from "./pages/Laureats";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import GestionInscriptions from "./pages/admin/GestionInscriptions";
import AdminFeedbacks from "./pages/admin/AdminFeedbacks";
import GestionMentors from "./pages/admin/GestionMentors";
import GestionPartenaires from "./pages/admin/GestionPartenaires";
import GestionGalerie from "./pages/admin/GestionGalerie";
import GestionBadges from "./pages/admin/GestionBadges";
import GestionComite from "./pages/admin/GestionComite";
import Attribution from "./pages/admin/SelectionFinale";
import GestionSelection from "./pages/admin/GestionSelection";
import PreviewSelection from "./pages/admin/PreviewSelection";
import Statistiques from "./pages/admin/Statistiques";
import GestionLaureats from "./pages/admin/GestionLaureats";


// Comité pages
import ComiteLogin from "./pages/comite/ComiteLogin";
import ComiteDashboard from "./pages/comite/ComiteDashboard";
import EvaluationDossier from "./pages/comite/EvaluationDossier";
import ComiteEvaluations from "./pages/comite/ComiteEvaluations";
import MesEvaluations from "./pages/comite/MesEvaluations";
import ClassementComite from "./pages/comite/ClassementComite";
import ClassementIndividuels from "./pages/comite/ClassementIndividuels";
import ClassementParProjet from "./pages/comite/ClassementParProjet";
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
              <Route path="/inscription" element={<InscriptionsFermees />} />
              <Route path="/equipes-selectionnees" element={<EquipesSelectionnees />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/partenaires" element={<Partenaires />} />
              <Route path="/galerie" element={<Galerie />} />
              <Route path="/termes-conditions" element={<TermesConditions />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/thematiques" element={<Thematiques />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/verification/:badgeId" element={<VerificationBadge />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/laureats" element={<Laureats />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/inscriptions" element={<ProtectedRoute><GestionInscriptions /></ProtectedRoute>} />
              <Route path="/admin/feedbacks" element={<ProtectedRoute><AdminFeedbacks /></ProtectedRoute>} />
              <Route path="/admin/mentors" element={<ProtectedRoute><GestionMentors /></ProtectedRoute>} />
              <Route path="/admin/partenaires" element={<ProtectedRoute><GestionPartenaires /></ProtectedRoute>} />
              <Route path="/admin/galerie" element={<ProtectedRoute><GestionGalerie /></ProtectedRoute>} />
              <Route path="/admin/badges" element={<ProtectedRoute><GestionBadges /></ProtectedRoute>} />
              <Route path="/admin/comite" element={<ProtectedRoute><GestionComite /></ProtectedRoute>} />
              <Route path="/admin/attribution" element={<ProtectedRoute><Attribution /></ProtectedRoute>} />
              <Route path="/admin/selection" element={<ProtectedRoute><GestionSelection /></ProtectedRoute>} />
              <Route path="/admin/preview-selection" element={<ProtectedRoute><PreviewSelection /></ProtectedRoute>} />
              <Route path="/admin/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />
              <Route path="/admin/laureats" element={<ProtectedRoute><GestionLaureats /></ProtectedRoute>} />

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
              <Route 
                path="/comite/mes-evaluations" 
                element={
                  <ComiteLayout>
                    <MesEvaluations />
                  </ComiteLayout>
                } 
              />
              <Route 
                path="/comite/classement" 
                element={
                  <ComiteLayout>
                    <ClassementComite />
                  </ComiteLayout>
                } 
              />
              <Route 
                path="/comite/classement-individuels" 
                element={
                  <ComiteLayout>
                    <ClassementIndividuels />
                  </ComiteLayout>
                } 
              />
              <Route 
                path="/comite/classement-projets" 
                element={
                  <ComiteLayout>
                    <ClassementParProjet />
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
