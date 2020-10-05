import * as crypto from "crypto";
import { environment } from "./environment";

/**
 * AES-256-CBC で暗号化する
 *
 * @export
 * @param {string} plainText
 * @param {string} secretKey
 * @returns
 */
export function encrypt(plainText: string, secretKey: string) {
  const key = crypto.scryptSync(secretKey, environment.encryptionSalt, 32);
  const iv = Buffer.alloc(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedText = cipher.update(plainText, "utf8", "hex");
  encryptedText += cipher.final("hex");
  return encryptedText.toString();
}

/**
 * AES-256-CBC で復号化する
 *
 * @export
 * @param {string} encryptedText
 * @param {string} secretKey
 * @returns
 */
export function decrypt(encryptedText: string, secretKey: string) {
  const key = crypto.scryptSync(secretKey, environment.encryptionSalt, 32);
  const iv = Buffer.alloc(16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let plainText = decipher.update(encryptedText, "hex", "utf8");
  plainText += decipher.final("utf8");
  return plainText.toString();
}
