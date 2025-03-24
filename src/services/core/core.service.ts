import { BadRequestException, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ResponseUserCore, ReturnRequest } from "./dto/create-core.dto";

@Injectable()
export class CoreService {
  constructor(private readonly httpService: HttpService) {}

  async requestAdvance(userId: string): Promise<ReturnRequest> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`/backoffice/${userId}`)
      );

      const fourteenDescount = +data.advanceFeefour;
      const thirtyDescount = +data.advanceFeeThirty;
      return {
        fourteenDescount,
        thirtyDescount,
      };
    } catch (e) {
      throw new BadRequestException({
        message: "erro request core descount user",
        error: e,
      });
    }
  }

  async getUserByEmail(email: string): Promise<ResponseUserCore> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`/user/email/${email}`)
      );

      return data;
    } catch (e) {
      console.error(e);
      throw new BadRequestException({
        message: "erro request core descount user",
        error: e,
      });
    }
  }
}
