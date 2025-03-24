import { Handler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import { endOfYesterday, startOfYesterday, subHours } from "date-fns";

const prismaService = new PrismaClient();

export const handler: Handler = async () => {
  const waitingAntecipations = await prismaService.request.findMany({
    where: {
      typeRequest: "antecipation",
      status: "waiting",
      createdAt: {
        gte: subHours(startOfYesterday(), 3),
        lte: subHours(endOfYesterday(), 3),
      },
    },
  });

  await prismaService.request.updateMany({
    data: {
      status: "canceled",
    },
    where: {
      id: {
        in: waitingAntecipations.map((a) => a.id),
      },
    },
  });
};
