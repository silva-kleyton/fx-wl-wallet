import { Injectable } from "@nestjs/common";
import { RequestWhiteListService } from "../services/request-white-list.service";
@Injectable()
class RetrieveAllRequestsListByAdminUseCase {
  constructor(private requestWhiteListService: RequestWhiteListService) {}
  async execute(input: string) {
    return await this.requestWhiteListService.listAllRequestWhiteListByAdmin(
      input,
    );
  }
}
export { RetrieveAllRequestsListByAdminUseCase };
