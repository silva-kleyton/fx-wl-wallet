import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { NikyService } from "../../../services/niky/niky.service";

export enum CardStatus {
  active = "active",
  inactive = "inactive",
  blocked = "blocked",
}

@Injectable()
export class FindAllCardByUserService {
  constructor(
    private readonly nikyService: NikyService,
    private readonly prismaService: PrismaService
  ) {}

  public async call(userId: string, cardStatus?: CardStatus) {
    const wallet = await this.prismaService.wallet.findFirst({
      where: { user: userId },
      include: { userInfo: true },
    });

    if (!wallet) throw new BadRequestException("Wallet not found");

    if (!wallet?.userInfo?.cpf) {
      throw new BadRequestException("cpf user not found in wallet");
    }

    const cardsNiky = await this.nikyService.listCardInformation(
      wallet.userInfo.cpf
    );

    if (!cardsNiky.cartao) return [];

    const cardsWithCodes = cardsNiky.cartao.filter((card) => card.codigo);

    const cards = await this.prismaService.card.findMany({
      where: {
        providerId: {
          in: cardsWithCodes.map((item) => item.codigo),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCards = cards
      .map((card) => {
        if (!card?.name) return;

        const value = cardsWithCodes.find(
          (item) => card.providerId === item.codigo
        );

        return {
          name: card.name,
          ...value,
        };
      })
      .filter(Boolean);

    if (cardStatus) {
      return formattedCards.filter(
        (card) => card.status === this.fromCardStatusToNikyStatus(cardStatus)
      );
    }

    return formattedCards;
  }

  private fromCardStatusToNikyStatus(cardStatus: CardStatus): string {
    switch (cardStatus) {
      case CardStatus.active: {
        return "Ativo";
      }
      case CardStatus.inactive: {
        return "Pronto para ativação";
      }
      case CardStatus.blocked: {
        return "Bloqueado";
      }
    }
  }
}
