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
import UnitSelect from "@/pages/UnitSelect";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/learn" component={() => <UnitSelect mode="learn" />} />
        <Route path="/learn/:unitId" component={Learn} />
        <Route path="/practice" component={() => <UnitSelect mode="practice" />} />
        <Route path="/practice/:unitId" component={Practice} />
        <Route path="/diagrams" component={Diagrams} />
        <Route path="/exam" component={Exam} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
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
