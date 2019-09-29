import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

import Home from "./components/Home";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue
  },
  typography: {
    fontFamily: "PT Sans"
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Route exact path="/" component={Home} />
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
