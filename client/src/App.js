import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import Container from "./components/Container/Container";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/store";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import introspectionQueryResultData from "./fragmentTypes.json";

const { REACT_APP_APOLLO_CLIENT_URI: uri } = process.env;

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const cache = new InMemoryCache({ fragmentMatcher });
const client = new ApolloClient({ uri, cache });

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: "#443f46"
    },
    secondary: {
      main: "#493632"
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  },
  desktopWidth: "75vw",
  dashWidth: "75vw",
  smallDeviceWidth: "90vw"
});

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <ReduxProvider store={store}>
            <ApolloProvider client={client}>
              <Container>
                <Header />
                <Content />
                <Footer />
              </Container>
            </ApolloProvider>
          </ReduxProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
