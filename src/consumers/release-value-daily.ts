import { Handler, SQSEvent, SQSRecord } from "aws-lambda";
import { endOfYesterday, startOfYesterday, subHours } from "date-fns";
import { Producer } from "sqs-producer";
import { InputTransactionWalletDto } from "../modules/balance/dto/input-transaction-wallet.dto";
import { PrismaService } from "../prisma/prisma.service";
import { NikyService } from "../services/niky/niky.service";
import { generateCodeTansaction } from "../utils/generate-codes";

const prismaService = new PrismaService();
const nikyService = new NikyService(prismaService);

export const handler: Handler = async (event: SQSEvent) => {
  const records: SQSRecord[] = event.Records;
  // liberar valor diário
  for (const record of records) {
    // wallet id da fila
    const data = <{ walletId: string; userId: string }>JSON.parse(record.body);

    const { walletId, userId } = data;

    const wallet = await prismaService.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    if (!wallet) throw "wallet id not found";

    /**
     * busca todas as transações do tipo deposito, com tipo comissão em que a data de desbloqueio seja o dia anterior
     */

    const transactionsDaily = await prismaService.transactions.findMany({
      where: {
        OR: [
          {
            walletId: walletId,
            type: "deposit",
            typeInput: {
              in: [
                "affiliationCommission",
                "salesCommission",
                "sellerCommission",
                "coProducerCommission",
              ],
            },
            anteciped: false,
            releasedAnticipation: true,
            OR: [
              {
                released: false,
              },
              {
                released: null,
              },
            ],
            dateUnlock: {
              gte: subHours(startOfYesterday(), 3),
              lte: subHours(new Date(), 3),
            },
          },
          {
            walletId: walletId,
            type: "deposit",
            typeInput: {
              in: [
                "affiliationCommission",
                "salesCommission",
                "sellerCommission",
                "coProducerCommission",
              ],
            },
            anteciped: false,
            AND: [
              { releasedAnticipation: null },
              { dateUnlockAnticipation: null },
            ],

            OR: [
              {
                released: false,
              },
              {
                released: null,
              },
            ],
            dateUnlock: {
              gte: subHours(startOfYesterday(), 3),
              lte: subHours(new Date(), 3),
            },
          },
          {
            walletId: walletId,
            type: "debit",
            typeInput: {
              in: ["cardAds"],
            },
            dateUnlock: {
              gte: subHours(startOfYesterday(), 3),
              lte: subHours(endOfYesterday(), 3),
            },
          },
        ],
      },
    });
    const transactionDailyAnticipation =
      await prismaService.transactions.findMany({
        where: {
          OR: [
            {
              walletId: walletId,
              type: "deposit",
              typeInput: {
                in: [
                  "affiliationCommission",
                  "salesCommission",
                  "sellerCommission",
                  "coProducerCommission",
                ],
              },

              OR: [
                {
                  releasedAnticipation: false,
                },
                {
                  releasedAnticipation: null,
                },
              ],
              dateUnlockAnticipation: {
                gte: subHours(startOfYesterday(), 3),
                lte: subHours(new Date(), 3),
              },
            },
            {
              walletId: walletId,
              type: "debit",
              typeInput: {
                in: ["cardAds"],
              },
              dateUnlock: {
                gte: subHours(startOfYesterday(), 3),
                lte: subHours(endOfYesterday(), 3),
              },
            },
          ],
        },
      });
    console.log(
      "Quantidade de transações encontradas:",
      transactionsDaily.length,
    );

    const valueBlocked = transactionDailyAnticipation.reduce(
      (acc, value) => acc + value.value,
      0,
    );

    const valueToRelease = transactionsDaily.reduce(
      (acc, value) => (value.anteciped ? acc + 0 : acc + value.value - (value.antecipedAmount ?? 0)),
      0,
    );

    const SQSQueueName = `${process.env.URL_QUEUE_INPUT_WALLET_TRANSACTION}`;

    const inputCronTransaction: InputTransactionWalletDto = {
      date: new Date(),
      code: generateCodeTansaction(),
      priceSale: 0,
      saleId: undefined,
      type: "movement",
      typeInput: "releaseMoney",
      userId: userId,
      value: 0,
      valueBlocked: valueBlocked,
      valueToRelease: valueToRelease,
      valueDisponibility: valueToRelease,
    };

    console.log(SQSQueueName);

    const producer = Producer.create({
      queueUrl: `${process.env.URL_QUEUE_INPUT_WALLET_TRANSACTION}`,
      region: `us-east-1`,
    });

    await producer.send({
      id: userId,
      groupId: userId,
      deduplicationId: inputCronTransaction.code,
      body: JSON.stringify(inputCronTransaction),
    });

    await prismaService.transactions.updateMany({
      where: {
        id: {
          in: transactionsDaily.map((t) => t.id),
        },
      },
      data: {
        released: true,
      },
    });

    await prismaService.transactions.updateMany({
      where: {
        id: {
          in: transactionDailyAnticipation.map((t) => t.id),
        },
      },
      data: {
        releasedAnticipation: true,
      },
    });

    // await sendMessageSQS(
    //   {
    //     Id: inputCronTransaction.code,
    //     MessageBody: JSON.stringify(inputCronTransaction),
    //     MessageGroupId: userId,
    //     MessageDeduplicationId: inputCronTransaction.code,
    //   },
    //   SQSQueueName
    // );
  }

  // liberar valor cartão facebook
  for (const record of records) {
    const data = <{ walletId: string; userId: string }>JSON.parse(record.body);

    const { walletId, userId } = data;

    const wallet = await prismaService.wallet.findFirst({
      where: {
        id: walletId,
      },
      include: {
        cards: true,
      },
    });

    for (const card of wallet.cards) {
      // criar recarga de cartão
      // enviar mensagem para a  fila de inputTransaction com o tipo 'facebookAds'
      // jogando o valor bloqueado como negativo -card.facebookDailyReleaseValue

      if (card.facebookDailyReleaseValue <= 0) continue;

      // enviando recarga para a nicky
      // await nikyService.createRecharge({
      //   idAgencia: "0000000",
      //   dataExecucao: new Date().toISOString(),
      //   codigoLoteAgencia: "00000000",
      //   descricaoLoteAgencia: "recargar facebook",
      //   valorTotal: card.facebookDailyReleaseValue,
      //   quantidadeTotal: 1,
      //   recargas: [
      //     {
      //       codigoItemAgencia: 1234567,
      //       cpfDestinatario: "33333333333",
      //       cartaoDestinatario: card.providerId,
      //       valorRecarga: card.facebookDailyReleaseValue,
      //       descricaoItemAgencia: "",
      //     },
      //   ],
      // });

      const inputCronTransaction: InputTransactionWalletDto = {
        date: new Date(),
        code: generateCodeTansaction(),
        priceSale: 0,
        saleId: undefined,
        type: "debit",
        typeInput: "cardAds",
        userId: userId,
        value: 0,
        valueBlocked: -card.facebookDailyReleaseValue,
        valueToRelease: 0,
        valueDisponibility: 0,
      };

      const producer = Producer.create({
        queueUrl: `${process.env.URL_QUEUE_INPUT_WALLET_TRANSACTION}`,
        region: `us-east-1`,
      });

      await producer.send({
        id: userId,
        groupId: userId,
        deduplicationId: inputCronTransaction.code,
        body: JSON.stringify(inputCronTransaction),
      });

      // await sendMessageSQS(
      //   {
      //     Id: inputCronTransaction.code,
      //     MessageBody: JSON.stringify(inputCronTransaction),
      //     MessageGroupId: userId,
      //     MessageDeduplicationId: inputCronTransaction.code,
      //   },
      //   SQSQueueName
      // );
    }
  }
};
