
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LandingPage } from "@/pages/landing";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
import { DashboardPage } from "@/pages/dashboard";
import { ResearcherSearchPage } from "@/pages/researcher-search";
import { ProfilePage } from "@/pages/profile";
import { ProfileEditPage } from "@/pages/profile-edit";
import { AffiliationsPage } from "@/pages/affiliations";
import { AffiliationFormPage } from "@/pages/affiliation-form";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Redirect root to landing page for unauthenticated users */}
            <Route path="/" element={<Navigate to="/landing" replace />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/researchers" element={<ResearcherSearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/profile/affiliations" element={<AffiliationsPage />} />
            <Route path="/profile/affiliations/new" element={<AffiliationFormPage />} />
            <Route path="/profile/affiliations/:id/edit" element={<AffiliationFormPage />} />
            
            {/* Placeholder routes for navigation */}
            <Route path="/papers" element={<div className="p-8 text-center">Papers page - Coming Soon</div>} />
            <Route path="/projects" element={<div className="p-8 text-center">Projects page - Coming Soon</div>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
