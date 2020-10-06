/** @jsx jsx */
import { css, jsx, Global } from "@emotion/core";
import { Classes, Colors } from "@blueprintjs/core";
import * as querystring from "querystring";
import { CheckoutForm } from "./CheckoutForm";
import * as Api from "~lib/Api";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const globalStyle = css`
  body {
    background-color: ${Colors.LIGHT_GRAY5};
    font-size: 16px;
  }
`;

const style = css`
  margin: 0 auto;
  width: 1200px;
  max-width: 100%;
`;

export const Container = () => {
  // https://stripe.com/docs/stripe-js/react#usestripe-hook
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 決済用リンク URL の code パラメータの値を取得する
  const code = querystring.parse(location.search.substring(1))["code"] as
    | string
    | string[]
    | undefined;
  if (typeof code !== "string") {
    return <div>URLが不正です。</div>;
  }

  const onSubmit = async (name: string) => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement not found.");
      return;
    }

    try {
      setIsSubmitting(true);

      // PeymentMethod を作成する
      // https://stripe.com/docs/api/payment_methods
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (!paymentMethod || error) {
        throw error;
      }

      // Subscription を作成する
      await Api.createSubscription({
        code,
        name,
        payment_method_id: paymentMethod.id,
      });
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      window.alert("🙅‍♀️お支払いの処理に失敗しました");
      return;
    } finally {
      setIsSubmitting(false);
    }

    window.alert("お支払いが完了しました🎉");
  };

  return (
    <section css={style}>
      <Global styles={globalStyle} />
      <h1 className={Classes.HEADING}>お支払いページ</h1>
      <CheckoutForm
        isEnabled={stripe !== null}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </section>
  );
};
