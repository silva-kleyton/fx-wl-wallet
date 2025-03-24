import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // constructor(admin = false) {
  //   super({
  //     // datasources: {
  //     //   db: {
  //     //     url: admin
  //     //       ? `${process.env.DATABASE_URL}`
  //     //       : `${process.env.DATABASE_URL_ADMIN}`,
  //     //   },
  //     // },
  //   });
  // }

  async onModuleInit() {
    await this.$connect();
    // await this.middlewareSoftDelete();
    // await this.middlewareListSoftDelete();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // async middlewareSoftDelete() {
  //   this.$use(async (params, next) => {
  //     // Ao chamar a função de delete. Irá trocar por um update colocando o deleted. Criando um softDelete
  //     if (params.action == "delete") {
  //       params.action = "update";
  //       params.args["data"] = { deletedAt: new Date() };
  //     }

  //     // Ao chamar a função de deleteMany. Irá trocar por um updateMany colocando o deleted. Criando um softDelete
  //     if (params.action == "deleteMany") {
  //       params.action = "updateMany";
  //       if (params.args.data != undefined) {
  //         params.args.data["deletedAt"] = new Date();
  //       } else {
  //         params.args["data"] = { deletedAt: new Date() };
  //       }
  //     }

  //     return next(params);
  //   });
  // }

  // // listas e buscas sem retornar os item que possuem deletedAt setado
  // async middlewareListSoftDelete() {
  //   this.$use(async (params, next) => {
  //     if (params.action === "findUnique" || params.action === "findFirst") {
  //       params.action = "findFirst";
  //       if (!params.args.where["deletedAt"]) {
  //         params.args.where = {
  //           ...params.args.where,
  //           deletedAt: null,
  //         };
  //       }
  //     }

  //     if (params.action == "findMany") {
  //       if (params.args.where) {
  //         if (params.args.where.deletedAt == undefined) {
  //           params.args.where = {
  //             ...params.args.where,
  //             deletedAt: null,
  //           };
  //         }
  //       } else {
  //         params.args["where"] = { ...params.args.where, deletedAt: null };
  //       }
  //     }

  //     // middleware count - retorna correto na paginação - o count tem o action como aggregate pelo Prisma.
  //     if (params.action == "aggregate" && params.dataPath.includes("_count")) {
  //       if (params.args.where != undefined) {
  //         if (params.args.where.deletedAt == undefined) {
  //           params.args.where = { ...params.args.where, deletedAt: null };
  //         }
  //       } else {
  //         params.args["where"] = { ...params.args.where, deletedAt: null };
  //       }
  //     }

  //     return next(params);
  //   });
  // }
}
