import axios from 'axios'
import { Injectable } from "@nestjs/common";
import { RequestService } from "../../request.service";
import { ReceiveAnticipationSimulationStatusUseCase } from './receive-anticipation-simulation-status.use-case'

@Injectable()
class GetAnticipationSimulationStatusUseCase {
  constructor(
    private requestService: RequestService,
    private receiveAnticipationSimulationStatusUseCase: ReceiveAnticipationSimulationStatusUseCase,
  ) {}

  async execute() {
    const requests = await this.requestService.getProcessingAnticipationsToVerifyStatus()
    console.log('processing requests ', requests)

    await Promise.allSettled(requests.map(async request => {
      const response = await axios.get(`${process.env.BASE_URL_SALE}/anticipation/request/${request.userId}/iugu`, {
        headers: {
          "x-api-key": process.env.API_KEY_SALE,
        },
      })

      await this.receiveAnticipationSimulationStatusUseCase.execute({
        ...response.data,
        request
      })
    }))
  }
}

export { GetAnticipationSimulationStatusUseCase };
