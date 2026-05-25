import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/contexts/ProgressContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Learn from "@/pages/Learn";
import Practice from "@/pages/Practice";
import Diagrams from "@/pages/Diagrams";
import Exam from "@/pages/Exam";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/learn/:unitId" component={Learn} />
        <Route path="/learn" component={() => { window.location.replace(import.meta.env.BASE_URL + "learn/lu1"); return null; }} />
        <Route path="/practice/:unitId" component={Practice} />
        <Route path="/practice" component={() => { window.location.replace(import.meta.env.BASE_URL + "practice/lu1"); return null; }} />
        <Route path="/diagrams" component={Diagrams} />
        <Route path="/exam" component={Exam} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ProgressProvider>
    </QueryClientProvider>
  );
}

export default App;
