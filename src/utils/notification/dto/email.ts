export interface IEmailConsumerBody {
  from: string;
  to?: string;
  subject?: string;
  message?: string;
}
