import Stripe from "stripe";
import { environment } from "./Environment";

type SendPaymentLinkEmailRequestParams = {
  email: string;
};

type CreateSubscriptionRequestParams = {
  code: string;
  name: string;
  payment_method_id: string;
};

class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export async function sendPaymentLinkEmail(
  params: SendPaymentLinkEmailRequestParams
): Promise<void> {
  const response = await fetch(
    `${environment.apiBaseUrl}/send_payment_link_email`,
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  if (!response.ok) {
    throw new ApiError(
      response.status,
      await response.text().catch(() => response.statusText)
    );
  }
}

export async function createSubscription(
  params: CreateSubscriptionRequestParams
): Promise<Stripe.Subscription> {
  const response = await fetch(
    `${environment.apiBaseUrl}/create_subscription`,
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  if (!response.ok) {
    throw new ApiError(
      response.status,
      await response.text().catch(() => response.statusText)
    );
  }
  return (await response.json()) as Stripe.Subscription;
}
