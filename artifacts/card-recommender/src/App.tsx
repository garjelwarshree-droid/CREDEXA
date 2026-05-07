import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Recommendations from "@/pages/Recommendations";
import Compare from "@/pages/Compare";
import CardDetails from "@/pages/CardDetails";
import Bookmarks from "@/pages/Bookmarks";
import Analytics from "@/pages/Analytics";
import Search from "@/pages/Search";
import About from "@/pages/About";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/compare" component={Compare} />
        <Route path="/cards/:id" component={CardDetails} />
        <Route path="/bookmarks" component={Bookmarks} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/search" component={Search} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
