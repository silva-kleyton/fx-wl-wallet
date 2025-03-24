import { Request } from "@prisma/client";

export type StatusEnum =
  | "aproved"
  | "waiting"
  | "denied"
  | "autoAproved"
  | "done"
  | "failed";
type UpdateAntecipationRequest = Partial<Request>;
export { UpdateAntecipationRequest };
