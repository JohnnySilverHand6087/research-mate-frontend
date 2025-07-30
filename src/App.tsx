
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Redirect root to profile */}
            <Route path="/" element={<Navigate to="/profile" replace />} />
            
            {/* Protected routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/profile/affiliations" element={<AffiliationsPage />} />
            <Route path="/profile/affiliations/new" element={<AffiliationFormPage />} />
            <Route path="/profile/affiliations/:id/edit" element={<AffiliationFormPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
