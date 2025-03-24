export interface InputFinishWithdraw {
  status: "LIQUIDATED" | "CANCELED" | "REFUNDED";
  endToEndId: string;
}
