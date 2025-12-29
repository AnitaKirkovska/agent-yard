import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import SecretSantaGiftFinder from "./pages/SecretSantaGiftFinder";
import CustomerGifts from "./pages/CustomerGifts";
import AgentReads from "./pages/AgentReads";
import SEOAgent from "./pages/SEOAgent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/secret-ai-santa" element={<SecretSantaGiftFinder />} />
            <Route path="/customer-gifts" element={<CustomerGifts />} />
            <Route path="/agent-reads" element={<AgentReads />} />
            <Route path="/seo-agent" element={<SEOAgent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
