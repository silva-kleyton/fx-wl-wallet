import { Injectable } from "@nestjs/common";
import { RequestWhiteListService } from "../services/request-white-list.service";
@Injectable()
class RetrieveByIdWhiteListUsecase {
  constructor(
    private readonly requestWhiteListService: RequestWhiteListService,
  ) {}
  async execute(id) {
    return await this.requestWhiteListService.listRequestWhiteListById(id);
  }
}
export { RetrieveByIdWhiteListUsecase };
