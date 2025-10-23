
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react"; // Make sure React is imported
import Index from "./pages/Index";
import Diagnose from "./pages/Diagnose";
import Treat from "./pages/Treat";
import Manifestation from "./pages/Manifestation"; // Import the new Manifestation page
import Affiliate from "./pages/Affiliate";
import AffiliateRegister from "./pages/AffiliateRegister";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Purchase from "./pages/Purchase";
import Admin from "./pages/Admin";
import AddUserAdmin from "./pages/AddUserAdmin";
import BalanceChakras from "./pages/BalanceChakras"; // Importamos la nueva página
import Auth from "./pages/Auth";
import SessionHistory from "./pages/SessionHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import AffiliateProtectedRoute from "./components/AffiliateProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AffiliateProvider } from "./context/AffiliateContext";
import { SessionProvider } from "./context/SessionContext";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AffiliateProvider>
            <SessionProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/purchase" element={<Purchase />} />
                  <Route path="/affiliate-register" element={<AffiliateRegister />} />
                  <Route path="/affiliate-dashboard" element={
                    <AffiliateProtectedRoute>
                      <AffiliateDashboard />
                    </AffiliateProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/add-user-admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AddUserAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/session-history" element={
                    <ProtectedRoute>
                      <SessionHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/diagnose" element={
                    <ProtectedRoute>
                      <Diagnose />
                    </ProtectedRoute>
                  } />
                  <Route path="/treat" element={
                    <ProtectedRoute>
                      <Treat />
                    </ProtectedRoute>
                  } />
                  {/* Nueva ruta para equilibrar chakras */}
                  <Route path="/balance-chakras" element={
                    <ProtectedRoute>
                      <BalanceChakras />
                    </ProtectedRoute>
                  } />
                  {/* Nueva ruta para la página de manifestación */}
                  <Route path="/manifestation" element={
                    <ProtectedRoute>
                      <Manifestation />
                    </ProtectedRoute>
                  } />
                  <Route path="/affiliate" element={
                    <ProtectedRoute>
                      <Affiliate />
                    </ProtectedRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SessionProvider>
          </AffiliateProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
