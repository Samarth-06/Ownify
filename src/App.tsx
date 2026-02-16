import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadWork from "./pages/UploadWork";
import Portfolio from "./pages/Portfolio";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import BackgroundParticles from "./components/BackgroundParticles";
import GlowCursor from "./components/GlowCursor";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  // Index has its own Navbar, others share the global one
  const showGlobalNav = location.pathname !== '/';

  return (
    <>
      {showGlobalNav && <Navbar />}
      {showGlobalNav && <BackgroundParticles />}
      {showGlobalNav && <GlowCursor />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadWork />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
