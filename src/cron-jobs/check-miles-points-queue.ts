import { HttpService } from "@nestjs/axios";
import { Context, Handler } from "aws-lambda";
import { PrismaService } from "../prisma/prisma.service";
import { CoreService } from "../services/core/core.service";
import { MilesService } from "../services/miles/miles.service";

const prismaService: PrismaService = new PrismaService();
const httpService : HttpService = new HttpService();
const coreService: CoreService = new CoreService(httpService);
const milesService: MilesService = new MilesService(prismaService, coreService);

export const handler: Handler = async (event: any, context: Context) => {
  await milesService.checkPointsToReDeem();
};
