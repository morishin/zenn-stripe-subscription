import { config } from "firebase-functions";

export const environment = {
  webHost: config().app.web_host as string,
  encryptionSecretKey: config().app.encryption_secret_key as string,
  encryptionSalt: config().app.encryption_salt as string,
  stripeSecretKey: config().stripe.secret_key as string,
  stripePriceId: config().stripe.price_id as string,
  sendgridApiKey: config().sendgrid.api_key as string,
  sendgridPaymentLinkTemplateId: config().sendgrid
    .payment_link_template_id as string,
  sendgridPaymentCompletedTemplateId: config().sendgrid
    .payment_completed_template_id as string,
  fromEmail: "no-reply@morishin.me",
};
