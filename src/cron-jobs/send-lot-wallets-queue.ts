import { Handler, Context } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import { SQSClient } from "@aws-sdk/client-sqs";
import { Producer } from "sqs-producer";
import { randomUUID } from "crypto";

new SQSClient({ region: `${process.env.AWS_REGION_APP}` });
const queueUrl = `${process.env.URL_QUEUE_LOT_WALLET_CRON}`;

const producer = Producer.create({
  queueUrl: queueUrl,
  region: `${process.env.AWS_REGION_APP}`,
});

const prismaService = new PrismaClient();

export const handler: Handler = async (event: any, context: Context) => {
  const wallets = await prismaService.wallet.findMany({});

  console.log("carteiras:", wallets.length);

  // const messages: { id: string; body: string }[] = [];

  for (const wallet of wallets) {
    console.log(`walletId: ${wallet.id}`);

    await producer.send({
      id: randomUUID(),
      body: JSON.stringify({
        walletId: wallet.id,
        userId: wallet.user,
      }),
    });
  }

  // console.log(`quantidade de mensagens: ${messages.length}`);

  // const size = await producer.queueSize();

  // console.log(`quantidade na fila: ${size}`);

  // for (let i = 0; i < wallets.length; i++) {
  //   // await producer.send([
  //   //   {
  //   //     id: "id1",
  //   //     body: "Hello world with two string attributes: attr1 and attr2",
  //   //   },
  //   //   {
  //   //     id: "id2",
  //   //     body: "Hello world delayed by 5 seconds",
  //   //     delaySeconds: 5,
  //   //   },
  //   // ]);

  //   // const params: AWS.SQS.SendMessageRequest = {
  //   //   DelaySeconds: i + 1,
  //   //   MessageBody: JSON.stringify({
  //   //     walletId: wallets[i].id,
  //   //     userId: wallets[i].user,
  //   //   }),
  //   //   QueueUrl: queueUrl,
  //   // };

  //   // await sqs
  //   //   .sendMessage(params, function (err, data) {
  //   //     if (err) {
  //   //       console.log(
  //   //         "Error:",
  //   //         `Error ao enviar mensagem para a fila lot-wallet-cron-${process.env.NODE_ENV}: ` +
  //   //           err
  //   //       );

  //   //       throw err;
  //   //     }
  //   //   })
  //   //   .promise();
  // }

  // for (const wallet of wallets) {
  //   console.log(wallet);

  //   const params: AWS.SQS.SendMessageRequest = {
  //     MessageBody: JSON.stringify({ walletId: wallet.id, userId: wallet.user }),
  //     QueueUrl: queueUrl,
  //   };

  //   await sqs
  //     .sendMessage(params, function (err, data) {
  //       if (err) {
  //         console.log(
  //           "Error:",
  //           `Error ao enviar mensagem para a fila lot-wallet-cron-${process.env.NODE_ENV}: ` +
  //             err
  //         );

  //         throw err;
  //       }
  //     })
  //     .promise();
  // }
};
