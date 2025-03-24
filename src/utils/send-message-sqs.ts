import { Producer } from "sqs-producer";

export interface ISQSInputParams {
  Id: string;
  MessageBody: string;
  MessageDeduplicationId?: string;
  MessageGroupId?: string;
  DelaySeconds?: number;
}

export async function sendMessageSQS(
  paramsSQS: ISQSInputParams,
  SQSQueueName: string
) {
  const producer = Producer.create({
    queueUrl: `${process.env.BASE_URL_SQS}${SQSQueueName}`,
    region: `${process.env.AWS_REGION_APP}`,
  });

  console.log(`${process.env.BASE_URL_SQS}${SQSQueueName}`);

  return await producer.send({
    id: paramsSQS.Id,
    body: paramsSQS.MessageBody,
    groupId: paramsSQS.MessageGroupId,
    deduplicationId: paramsSQS.MessageDeduplicationId,
    delaySeconds: paramsSQS?.DelaySeconds,
  });
}
