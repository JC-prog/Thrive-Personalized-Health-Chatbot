import { useState } from 'react'
import { Switch, Route } from 'wouter'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Pages
import AuthPage from "@pages/auth-page"
import NotFound from '@pages/not-found-page'

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/not-found" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Router />
  );
}

export default App
