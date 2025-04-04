import { Switch, Route } from 'wouter'
import './App.css'
import { ProtectedRoute } from '@lib/protected-route'

// Pages
import AuthPage from "@pages/auth-page"
import NotFound from '@pages/not-found-page'
import AssessmentPage from '@pages/assessment-page'
import DashboardPage from '@pages/dashboard-page'

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/not-found" component={NotFound} />
      <Route path="/assessment" component={AssessmentPage} />
      <Route path="/" component={DashboardPage} />
    </Switch>
  );
}

function App() {
  return (
    <Router />
  );
}

export default App
