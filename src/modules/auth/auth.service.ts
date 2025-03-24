import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  private apiKeys: string[] = [`${process.env.X_API_KEY}`];

  validateApiKey(apiKey: string) {
    return this.apiKeys.find((key) => apiKey === key);
  }
}
