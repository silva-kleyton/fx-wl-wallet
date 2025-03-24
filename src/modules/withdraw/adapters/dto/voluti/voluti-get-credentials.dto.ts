import { VolutiCredentials } from "@prisma/client";

export type GetTVolutiCredentialsResponse = Omit<
  VolutiCredentials,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "adminId"
>;
