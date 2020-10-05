import axios from "axios";
import Stripe from "stripe";
import { environment } from "./environment";
const stripe = new Stripe(environment.stripeSecretKey, {
  apiVersion: "2020-08-27",
});

/**
 * Stripe の Customer を作成する
 *
 * @param {CustomerCreateParams} params
 * @returns {Promise<Stripe.Customer>}
 */
export async function createCustomer(
  params: CustomerCreateParams
): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    payment_method: params.paymentMethodId,
    invoice_settings: { default_payment_method: params.paymentMethodId },
  });
  return customer;
}

/**
 * Stripe の Subscription を作成する
 *
 * @param {SubscriptionCreateParams} params
 * @returns {Promise<Stripe.Subscription>}
 */
export async function createSubscription(
  params: SubscriptionCreateParams
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
  });
  return subscription;
}

/**
 * Sendgrid の API 経由でメールを送信する。
 *
 * @param {string} to メールの送信先アドレス
 * @param {string} templateId Sendgrid の Dynamic Template ID
 * @param {{ [key: string]: string }} dynamicTemplateData Dynamic Template に適用するパラメータ
 * @returns {Promise<void>}
 */
export async function sendEmail(
  to: string,
  templateId: string,
  dynamicTemplateData: { [key: string]: string }
): Promise<void> {
  return axios.post(
    "https://api.sendgrid.com/v3/mail/send",
    {
      personalizations: [
        {
          to: [{ email: to }],
          dynamic_template_data: dynamicTemplateData,
        },
      ],
      from: {
        email: environment.fromEmail,
      },
      template_id: templateId,
    },
    {
      headers: {
        Authorization: `Bearer ${environment.sendgridApiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
}
