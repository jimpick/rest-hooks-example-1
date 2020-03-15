import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { CacheProvider } from "rest-hooks";
import App from "./App";

import "antd/dist/antd.css";
import "./styles.css";

const rootElement = document.getElementById("root");
render(
  <CacheProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CacheProvider>,
  rootElement
);
