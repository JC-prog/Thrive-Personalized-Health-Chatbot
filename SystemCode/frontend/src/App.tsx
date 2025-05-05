// App.tsx
import { Switch, Route } from 'wouter';
import './App.css';
import { AuthProvider } from "./hooks/auth-context";

// Pages
import AuthPage from "@pages/auth-page";
import NotFound from '@pages/not-found-page';
import AssessmentPage from '@pages/assessment-page';
import DashboardPage from '@pages/DashboardPage';
import ChatPage from '@pages/chat-page';
import ProfilePage from '@pages/profile-page';

import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/not-found" component={NotFound} />
      <ProtectedRoute path="/assessment" component={AssessmentPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
