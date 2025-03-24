import { Injectable } from "@nestjs/common";
import { VolutiCredentialsService } from "src/modules/voluti-credentials/application/services/voluti-credentials.service";
import { CrytoService } from "src/utils/crypto/crypto.service";
import axios from "axios";
import { WalletService } from "src/modules/wallet/wallet.service";
import https from "node:https";
import { IVolutiHTTPAgent } from "../../adapters/dto/voluti/voluti-service.dto";

import { GetTVolutiCredentialsResponse } from "../../adapters/dto/voluti/voluti-get-credentials.dto";
import {
  WithdrawMoneyInput,
  WithdrawMoneyOutput,
} from "../../adapters/dto/voluti/voluti-draw-money.dto";
@Injectable()
class VolutiService {
  private url: string;
  constructor(
    private walletService: WalletService,
    private volutiCredentialsService: VolutiCredentialsService,
    private cryptoService: CrytoService,
  ) {
    if (!process.env.VOLUTI_URL) {
      return null;
    }

    this.url = process.env.VOLUTI_URL;
  }

  async createToken(
    credentials: GetTVolutiCredentialsResponse,
    certifiedUserAgent?: https.Agent,
  ): Promise<string> {
    // Get certified user agent
    const currentCertifiedUserAgent = certifiedUserAgent
      ? certifiedUserAgent
      : this.getHTTPSAgent({
          cert: credentials.certificateCrt,
          key: credentials.certificateKey,
          passphrase: credentials.pfxPassword,
          pfx: credentials.certificatePfx,
        });
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: currentCertifiedUserAgent,
    };

    const data = {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      grant_type: "client_credentials",
    };
    const responseOfToken = await axios.post(
      `${this.url}/api/v2/oauth/token`,
      data,
      headers,
    );
    return responseOfToken.data.access_token;
  }

  async createTransferWebhook(credentials: GetTVolutiCredentialsResponse) {
    const certifiedUserAgent = this.getHTTPSAgent({
      cert: credentials.certificateCrt,
      key: credentials.certificateKey,
      passphrase: credentials.pfxPassword,
      pfx: credentials.certificatePfx,
    });
    try {
      const token = await this.createToken(credentials, certifiedUserAgent);
      const data = {
        uri: `${process.env.BASE_URL_SALE}/webhook/voluti`,
        method: "POST",
        enabled: true,
        pauseOnFail: true,
      };

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        httpsAgent: certifiedUserAgent,
      };

      await axios.post(`${this.url}/api/v2/webhooks/transfer`, data, headers);
    } catch (error) {
      console.log("Error on createWebhook", error);
      console.log("Error data on createWebhook", error?.response?.data);
      throw error;
    }
  }

  private async getAndDecryptCredentials(
    adminId: string,
  ): Promise<GetTVolutiCredentialsResponse> {
    //To get the credentials
    const credentials =
      await this.volutiCredentialsService.findCredentialByAdminId({
        adminId,
      });
    //To validate if the credentials exists
    if (!credentials) {
      throw new Error("Credentials not found");
    }
    return {
      clientId: this.cryptoService.decrypt(credentials.clientId),
      clientSecret: this.cryptoService.decrypt(credentials.clientSecret),
      certificateCrt: this.cryptoService.decrypt(credentials.certificateCrt),
      certificateKey: this.cryptoService.decrypt(credentials.certificateKey),
      pfxPassword: this.cryptoService.decrypt(credentials.pfxPassword),
      certificatePfx: this.cryptoService.decrypt(credentials.certificatePfx),
    };
  }

  private getHTTPSAgent(input: IVolutiHTTPAgent) {
    return new https.Agent({ ...input, pfx: Buffer.from(input.pfx, "base64") });
  }

  async withdrawMoney({
    adminId,
    idempotencyKey,
    body,
  }: WithdrawMoneyInput): Promise<WithdrawMoneyOutput> {
    try {
      const credentials = await this.getAndDecryptCredentials(adminId);
      const certifiedUserAgent = this.getHTTPSAgent({
        cert: credentials.certificateCrt,
        key: credentials.certificateKey,
        passphrase: credentials.pfxPassword,
        pfx: credentials.certificatePfx,
      });
      const token = await this.createToken(credentials, certifiedUserAgent);

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey,
        },
        httpsAgent: certifiedUserAgent,
      };

      const drawRequest = await axios.post(
        `${this.url}/api/v2/pix/payments/dict`,
        body,
        headers,
      );
      console.log("drawRequest ", drawRequest);

      return drawRequest.data as WithdrawMoneyOutput;
    } catch (error) {
      console.log("Error on drawMoney", error);
      console.log("Error data on drawMoney", error?.response?.data);
      throw error;
    }
  }
}

export { VolutiService };
