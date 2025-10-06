import { z } from "zod";

export const getRatesSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  weight: z.number().int().positive(),
  couriers: z.array(z.string()).min(1),
});

export type GetRatesInput = z.infer<typeof getRatesSchema>;