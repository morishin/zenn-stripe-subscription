/** @jsx jsx */
import { css, jsx, Global } from "@emotion/core";
import { Button, Classes, Colors, Intent } from "@blueprintjs/core";
import * as Api from "~lib/Api";
import { ChangeEvent, useState } from "react";

const globalStyle = css`
  body {
    background-color: ${Colors.LIGHT_GRAY5};
    font-size: 16px;
  }
`;

const emailInputStyle = css`
  width: 320px;
  margin-right: 5px;
`;

const style = css`
  margin: 0 auto;
  width: 1200px;
  max-width: 100%;
`;

export const Container = () => {
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const onClickSend = async () => {
    try {
      setIsSending(true);
      await Api.sendPaymentLinkEmail({ email });
    } catch (error) {
      console.error(error);
      setIsSending(false);
      window.alert("🙅‍♀️メールの送信に失敗しました");
    } finally {
      setIsSending(false);
    }

    window.alert(
      "メールを送信しました。メールに記載のリンクからお支払い手続きへお進みください。"
    );
  };

  return (
    <section css={style}>
      <Global styles={globalStyle} />
      <h1 className={Classes.HEADING}>登録ページ</h1>
      <p>お支払いページのリンクを記載したメールを送信します。</p>
      <input
        className={`${Classes.INPUT} bp3-large`}
        css={emailInputStyle}
        dir="auto"
        type="text"
        placeholder="メールアドレスを入力する"
        defaultValue={email}
        onChange={onChangeEmail}
      />
      <Button
        large
        intent={Intent.SUCCESS}
        disabled={email.length === 0}
        loading={isSending}
        onClick={onClickSend}
      >
        送信する
      </Button>
    </section>
  );
};
