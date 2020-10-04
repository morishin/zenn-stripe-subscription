import React from "react";
import { render } from "react-dom";
import { Container } from "~components/index/Container";

const $app = document.getElementById("root")!;
function renderApp() {
  render(<Container />, $app);
}

renderApp();

if (module.hot) {
  module.hot.accept(renderApp);
}
