import { Injectable } from "@nestjs/common";
@Injectable()
class GetAnticipationAnswerOfSimplepayAuthorizationUseCase {
  async execute() {
    return {
      mode: "manual",
      response: {
        status:
          "Its necessary to ask support to Simplepay to know the status of the authorization.",
      },
    };
  }
}
export { GetAnticipationAnswerOfSimplepayAuthorizationUseCase };
