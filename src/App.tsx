import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppRoutes from "./authWrapper/RenderUserRoutes";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

const queryClient = new QueryClient();

const App = () => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
              <Router>
                <AppRoutes />
              </Router>
          </TooltipProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
);

export default App;
