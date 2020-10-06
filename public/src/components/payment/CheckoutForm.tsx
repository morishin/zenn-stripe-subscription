/** @jsx jsx */
import { css, Global, jsx } from "@emotion/core";
import React, { useState } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { Button, Classes, Colors, Intent } from "@blueprintjs/core";
import { StripeCardElementOptions } from "@stripe/stripe-js";

const nameInputStyle = css`
  width: 300px;
  margin-right: 10px;
`;

const globalStyle = css`
  .StripeElement {
    background-color: ${Colors.WHITE};
    width: 500px;
    margin-bottom: 20px;
    padding: 10px;

    appearance: none;
    border: none;
    border-radius: 3px;
    box-shadow: 0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0),
      inset 0 0 0 1px rgba(16, 22, 26, 0.15),
      inset 0 1px 1px rgba(16, 22, 26, 0.2);
    outline: none;
    transition: box-shadow 100ms cubic-bezier(0.4, 1, 0.75, 0.9);
    vertical-align: middle;
  }

  .StripeElement--focus {
    box-shadow: 0 0 0 1px #137cbd, 0 0 0 3px rgba(19, 124, 189, 0.3),
      inset 0 1px 1px rgba(16, 22, 26, 0.2);
  }
`;

const cardElementOptions: StripeCardElementOptions = {
  iconStyle: "solid",
  style: {
    base: {
      backgroundColor: Colors.WHITE,
      fontWeight: "500",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: Colors.GRAY3,
      },
    },
    invalid: {
      iconColor: Colors.RED3,
      color: Colors.RED3,
    },
  },
  hidePostalCode: true,
};

type Props = {
  isEnabled: boolean;
  isSubmitting: boolean;
  onSubmit: (name: string) => void;
};

export const CheckoutForm: React.FC<Props> = ({
  isEnabled,
  isSubmitting,
  onSubmit,
}) => {
  const [name, setName] = useState<string>("");

  const onClickPay = () => {
    onSubmit(name);
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div>
      <Global styles={globalStyle} />
      <p>
        お名前とクレジットカード情報をご入力の上、お支払い手続きをお願いいたします。
      </p>
      <h2>お名前</h2>
      <input
        className={`${Classes.INPUT} bp3-large`}
        css={nameInputStyle}
        dir="auto"
        type="text"
        placeholder="ペイ太郎"
        defaultValue={name}
        onChange={onChangeName}
      />
      <h2>クレジットカード情報</h2>
      <CardElement options={cardElementOptions} />
      <Button
        large
        intent={Intent.SUCCESS}
        disabled={!isEnabled}
        loading={isSubmitting}
        onClick={onClickPay}
      >
        支払う
      </Button>
    </div>
  );
};
