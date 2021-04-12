import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { TopBar } from "./components/TopBar";
import { Home } from "./pages/Home";
import { AddScholarship } from "./pages/AddScholarship";
import Scholarship from "./pages/Scholarship";

function App() {
  return (
    <Router>
      <TopBar />
      <Switch>
        <Route path="/add-scholarship">
          <AddScholarship />
        </Route>
        <Route path="/scholarship">
          <Scholarship />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
