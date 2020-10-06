import React from "react";
import { render } from "react-dom";
import { Container } from "~components/payment/Container";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { environment } from "~lib/Environment";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(environment.stripePublicKey);

const $app = document.getElementById("root")!;
function renderApp() {
  render(
    <Elements stripe={stripePromise}>
      <Container />
    </Elements>,
    $app
  );
}

renderApp();

if (module.hot) {
  module.hot.accept(renderApp);
}
