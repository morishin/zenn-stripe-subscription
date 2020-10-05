type CustomerCreateParams = {
  email: string;
  name: string;
  paymentMethodId: string;
};

type SubscriptionCreateParams = {
  customerId: string;
  priceId: string;
};

type SendPaymentLinkEmailRequestParams = {
  email: string;
};

type CreateSubscriptionRequestParams = {
  code: string;
  name: string;
  payment_method_id: string;
};
