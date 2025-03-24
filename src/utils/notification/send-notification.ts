import {
  SQSClient,
  SendMessageCommand,
  SendMessageRequest,
} from "@aws-sdk/client-sqs";
import { IMessageConsumer } from "./dto/send-notification.dto";

const sqs = new SQSClient({ region: process.env.AWS_REGION_APP });
const queueUrl = `${process.env.BASE_URL_SQS}/send-notification-${process.env.NODE_ENV}`;
const sendNotification = async (notification: IMessageConsumer) => {
  const params: SendMessageRequest = {
    MessageBody: JSON.stringify(notification),
    QueueUrl: queueUrl,
  };

  try {
    await sqs.send(new SendMessageCommand(params));
  } catch (error) {
    console.error(
      `error ao enviar mensagem para a fila send-notification-${process.env.NODE_ENV}`
    );

    throw error;
  }
};

export default sendNotification;
