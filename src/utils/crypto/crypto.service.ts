import { Injectable } from "@nestjs/common";
import crypto from "crypto-js";
@Injectable()
class CrytoService {
  private key: string;
  constructor() {
    if (!process.env.CRYPTO_KEY) {
      return null;
    }
    this.key = process.env.CRYPTO_KEY;
  }
  encrypt(data) {
    return crypto.AES.encrypt(data, this.key).toString();
  }
  decrypt(data) {
    return crypto.AES.decrypt(data, this.key).toString(crypto.enc.Utf8);
  }
}
export { CrytoService };
