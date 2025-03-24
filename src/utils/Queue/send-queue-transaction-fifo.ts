import { InputTransactionWalletDto } from "../../modules/balance/dto/input-transaction-wallet.dto";
import { sendMessageSQS } from "../send-message-sqs";

export const sendQueueTransactionFIFO = async (
  data: InputTransactionWalletDto,
) => {
  const params = {
    Id: data.userId,
    MessageDeduplicationId: String(data.userId),
    MessageBody: JSON.stringify(data),
    DelaySeconds: 0,
  };
  await sendMessageSQS(
    params,
    `${process.env.URL_QUEUE_INPUT_WALLET_TRANSACTION}`,
  );
};
