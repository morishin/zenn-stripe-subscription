# zenn-stripe-subscription

このリポジトリは [zenn.dev](https://zenn.dev/) の本「[【実践】StripeとFirebaseでサーバレスな定期課金決済アプリを作る](https://zenn.dev/morishin/books/182b222a7d7095509f62)」のソースコードです。対象本をご購入の方はこちらのリポジトリからソースコードをご参照ください。

## アプリケーション概要

メールアドレスを入力すると決済リンクを発行してメールで送信し、リンク先ページでクレジットカード情報を入力することで Stripe 上で定期購読課金の決済を行うウェブアプリケーションです。

`/functions` が API (Cloud Functions)、`/public` がウェブページ (Firebase Hosting) のソースコードとなっています。

index.html | payment.html
---- | ----
<img src="https://user-images.githubusercontent.com/1413408/95308090-679eba80-08c4-11eb-99ce-75b5b3a5657d.png" width="512"/> | <img src="https://user-images.githubusercontent.com/1413408/95308101-6a011480-08c4-11eb-882d-44088dfe3196.png" width="512"/>

## Setup

[Node.js](https://nodejs.org/ja/) v12, [yarn](https://classic.yarnpkg.com/ja/docs/install#mac-stable), [firebase-tools](https://github.com/firebase/firebase-tools) が必要です。それぞれをインストールの上、下記コマンドを実行してください。

```sh
dev/setup
```

## Develop

下記のコマンドで Cloud Functions エミュレータで関数を実行した上で、ウェブページの開発サーバを起動します。

```sh
dev/start
```

起動したら http://localhost:1234/index.html へブラウザからアクセスします。

## Deploy

`/.firebaserc` の `"zenn-stripe-subscription"` の部分はご自身で作成した Firebase プロジェクトの ID に書き換えてから行ってください。

```sh
firebase deploy
```

で Cloud Functions と Firebase Hosting が両方ビルドの上デプロイされます。
Firebase Hosting はデフォルトでは https://{{FirebaseプロジェクトID}}.web.app/ でホストされます。

初回のみ Cloud Functions へ環境変数の設定を行う必要があります。

⚠️ 開発環境の Cloud Functions エミュレータでは `/functions/.runtimeconfig.json` の値が使用されます。

設定例▼

```sh
firebase functions:config:set \
  app.web_host="your-firebase-project-id.web.app" \
  app.encryption_secret_key="******" \
  app.encryption_salt="******" \
  stripe.secret_key="sk_live_******" \
  stripe.price_id="price_******" \
  sendgrid.api_key="SG.******" \
  sendgrid.payment_link_template_id="d-******" \
  sendgrid.payment_completed_template_id="d-******"
```
