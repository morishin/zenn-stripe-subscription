import * as functions from "firebase-functions";
import { environment } from "./environment";
import { decrypt, encrypt } from "./crypt";
import Stripe from "stripe";
import { sendEmail, createCustomer, createSubscription } from "./api";

const webHost = process.env.FUNCTIONS_EMULATOR
  ? "http://localhost:1234"
  : `https://${environment.webHost}`;

/**
 * POST /send_payment_link_email
 *
 * 指定のメールアドレスに決済用リンクを送信するエンドポイント
 *
 * @param {string} email メールアドレス
 */
export const send_payment_link_email = functions.https.onRequest(
  async (request, response) => {
    if (process.env.FUNCTIONS_EMULATOR) {
      response.set("Access-Control-Allow-Origin", "*");
    }
    const params: SendPaymentLinkEmailRequestParams = JSON.parse(request.body);

    // email アドレスを暗号化したものを決済用リンクの code パラメータとして付与
    const encryptedEmail = encrypt(
      params.email,
      environment.encryptionSecretKey
    );
    const paymentUrl = `${webHost}/payment.html?code=${encryptedEmail}`;
    await sendEmail(params.email, environment.sendgridPaymentLinkTemplateId, {
      payment_url: paymentUrl,
    });
    response.status(202).send();
  }
);

/**
 * POST /create_subscription
 *
 * ユーザーのメールアドレス(code から復号)、名前、クレジットカードのトークンから Stripe の Customer と Subscription を作成するエンドポイント
 *
 * @param {string} code 決済用リンクのクエリパラメータに含まれていた code の値
 * @param {string} name ユーザーがフォームで入力した名前
 * @param {string} source Stripe Elements で作成したユーザーのクレジットカードのトークン
 */
export const create_subscription = functions.https.onRequest(
  async (request, response) => {
    if (process.env.FUNCTIONS_EMULATOR) {
      response.set("Access-Control-Allow-Origin", "*");
    }

    const params: CreateSubscriptionRequestParams = JSON.parse(request.body);
    if (!(params.code && params.name && params.payment_method_id)) {
      response.status(400).send("Missing Params");
      return;
    }

    // code からユーザーの email を復号化
    let email: string;
    try {
      email = decrypt(params.code, environment.encryptionSecretKey);
    } catch (error) {
      response.status(400).send("Bad Parameter: code value is invalid");
      return;
    }

    // Stripe の Customer を作成
    let customer: Stripe.Customer;
    try {
      customer = await createCustomer({
        email,
        name: params.name,
        paymentMethodId: params.payment_method_id,
      });
    } catch (error) {
      functions.logger.error("Failed to createCustomer", error);
      response.status(500).send("Failed to createCustomer");
      return;
    }

    // Stripe の Subscription を作成
    let subscription: Stripe.Subscription;
    try {
      subscription = await createSubscription({
        customerId: customer.id,
        priceId: environment.stripePriceId,
      });
    } catch (error) {
      functions.logger.error("Failed to createSubscription", error);
      response.status(500).send("Failed to createSubscription");
      return;
    }

    // ユーザーへ定期購読課金の開始をメール通知
    try {
      await sendEmail(email, environment.sendgridPaymentCompletedTemplateId, {
        name: params.name,
      });
    } catch (error) {
      functions.logger.error(
        `Failed to send payment completed notification to customer ID: ${customer.id}`,
        error
      );
    }

    response.status(201).send(subscription);
  }
);
