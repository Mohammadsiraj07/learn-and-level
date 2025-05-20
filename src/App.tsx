
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Matches from "./pages/Matches";
import Schedule from "./pages/Schedule";
import Test from "./pages/Test";
import AdminTestRequests from "./pages/AdminTestRequests";

const queryClient = new QueryClient();

// Check if profile is completed to at least 80%
const isProfileCompleted = () => {
  return localStorage.getItem("profileCompleted") === "true";
};

// Profile requirement checker component
const ProfileRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  if (!isProfileCompleted()) {
    // Redirect to profile page but remember where they wanted to go
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <ProfileRequiredRoute>
                    <Marketplace />
                  </ProfileRequiredRoute>
                </ProtectedRoute>
              } />
              <Route path="/matches" element={
                <ProtectedRoute>
                  <ProfileRequiredRoute>
                    <Matches />
                  </ProfileRequiredRoute>
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <ProfileRequiredRoute>
                    <Schedule />
                  </ProfileRequiredRoute>
                </ProtectedRoute>
              } />
              <Route path="/test" element={
                <ProtectedRoute>
                  <ProfileRequiredRoute>
                    <Test />
                  </ProfileRequiredRoute>
                </ProtectedRoute>
              } />
              <Route path="/admin/test-requests" element={
                <ProtectedRoute>
                  <ProfileRequiredRoute>
                    <AdminTestRequests />
                  </ProfileRequiredRoute>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
