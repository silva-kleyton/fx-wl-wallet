import { Injectable } from "@nestjs/common";
import { EnableOrDisableRequestWhiteListDTO } from "../../adapters/dto/enable-or-disable-white-list.dto";
import { RequestWhiteListService } from "../services/request-white-list.service";
@Injectable()
class EnableOrDisableWhiteListUsecase {
  constructor(private requestWhiteListService: RequestWhiteListService) {}
  async execute(input: EnableOrDisableRequestWhiteListDTO) {
    return await this.requestWhiteListService.enableOrDisableRequestWhiteList(
      input,
    );
  }
}
export { EnableOrDisableWhiteListUsecase };
