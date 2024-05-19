import React from "react";
import ReactDOM from "react-dom/client";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";

import { PrimeReactProvider,PrimeReactContext } from "primereact/api";

const root = ReactDOM.createRoot(document.getElementById("root"));
const value = {
  ripple: true,
  unstyled: false,
};
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <PrimeReactProvider value={value}>
          <App />
        </PrimeReactProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
