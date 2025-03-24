import { Context, Handler } from "aws-lambda";
import { PrismaService } from "../prisma/prisma.service";
import { NikyService } from "../services/niky/niky.service";

const prismaService: PrismaService = new PrismaService();
const nikyService: NikyService = new NikyService(prismaService);

export const handler: Handler = async (event: any, context: Context) => {
  await nikyService.authenticate();
};
