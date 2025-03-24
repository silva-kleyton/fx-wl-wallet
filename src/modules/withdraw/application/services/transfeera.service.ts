import { Injectable } from "@nestjs/common";
import axios from "axios";
import { TransfeeraCredentialsService } from "../../../../modules/transfeera-credentials/application/services/transfeera-credentials.service";
import { WalletService } from "../../../../modules/wallet/wallet.service";
import { CrytoService } from "../../../../utils/crypto/crypto.service";
import { CreateTransferDTO } from "../../adapters/dto/transfeera/create-transaction.dto";
import { QueryTransfeeraDTO } from "../../adapters/dto/transfeera/query-transfeera.dto";
import { SendTransfeeraDTO } from "../../adapters/dto/transfeera/send-transfeera.dto";
@Injectable()
class TransfeeraService {
  private authorizationUrl: string;
  private url: string;
  constructor(
    private walletService: WalletService,
    private transfeeraCredentialsService: TransfeeraCredentialsService,
    private cryptoService: CrytoService,
  ) {
    if (
      !process.env.TRANSFEERA_AUTHORIZATION_URL ||
      !process.env.TRANSFEERA_URL
    ) {
      return null;
    }
    this.authorizationUrl = process.env.TRANSFEERA_AUTHORIZATION_URL;
    this.url = process.env.TRANSFEERA_URL;
  }
  async createToken(input: string): Promise<string> {
    //To get the wallet
    const wallet = await this.walletService.findOne(input);
    //To validate if the wallet exists
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    //To get the credentials
    const credentials =
      await this.transfeeraCredentialsService.findCredentialByAdminId({
        adminId: wallet.adminId,
      });
    //To validate if the credentials exists
    if (!credentials) {
      throw new Error("Credentials not found");
    }
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const decryptedClientSecret = this.cryptoService.decrypt(
      credentials.clientSecret,
    );
    const data = {
      client_id: credentials.clientId,
      client_secret: decryptedClientSecret,
      grant_type: "client_credentials",
    };
    const responseOfToken = await axios.post(
      `${this.authorizationUrl}/authorization`,
      data,
      headers,
    );
    return responseOfToken.data.access_token;
  }
  async createTransfer(input: CreateTransferDTO): Promise<string> {
    const token = await this.createToken(input.walletId);
    if (!token) {
      throw new Error("Token not found");
    }
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "DEVS X LTDA (infra@devsx.com.br)",
      },
    };
    const data = {
      name: null,
      transfers: [
        {
          value: (input.value / 100).toFixed(2),
          integration_id: null,
          pix_description: input.pix_description,
          destination_bank_account: input.destination_bank_account,
          pix_key_validation: input.pix_key_validation,
        },
      ],
      billets: [],
    };
    const responseOfTransfer = await axios.post(
      `${this.url}/batch`,
      data,
      headers,
    );
    return responseOfTransfer.data.id;
  }
  async queryCreatedTransfer(input: QueryTransfeeraDTO): Promise<any> {
    const token = await this.createToken(input.walletId);
    if (!token) {
      throw new Error("Token not found");
    }
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "DEVS X LTDA (",
      },
    };
    const responseOfTransfer = await axios.get(
      `${this.url}/batch/${input.id}`,
      headers,
    );
    return responseOfTransfer.data;
  }
  async sendTransfer(input: SendTransfeeraDTO): Promise<any> {
    const token = await this.createToken(input.walletId);
    if (!token) {
      throw new Error("Token not found");
    }
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "DEVS X LTDA (infra@devsx.com.br)",
      },
    };
    const data = null;
    const responseOfTransfer = await axios.post(
      `${this.url}/batch/${input.id}/close`,
      data,
      headers,
    );
    return responseOfTransfer.data;
  }
}
export { TransfeeraService };
