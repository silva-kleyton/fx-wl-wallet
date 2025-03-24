import { Injectable } from "@nestjs/common";
import { CreateRequestWhiteListDTO } from "../../adapters/dto/create-request-white-list.dto";
import { RequestWhiteListService } from "../services/request-white-list.service";

@Injectable()
class CreateRequestWhiteListUseCase {
  constructor(private requestWhiteListService: RequestWhiteListService) {}
  async execute(input: CreateRequestWhiteListDTO) {
    const requestWhiteList =
      await this.requestWhiteListService.findRequestWhiteListDuplicated(input);
    if (requestWhiteList) {
      return "Request white List already exists";
    }
    return await this.requestWhiteListService.createRequestWhiteList(input);
  }
}
export { CreateRequestWhiteListUseCase };
