/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "api-wallet is online",
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,

      body: JSON.stringify({
        message: "some error happened",
      }),
    };
  }
};
