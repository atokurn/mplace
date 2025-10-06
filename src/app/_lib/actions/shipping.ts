"use server";

import { getRatesSchema, type GetRatesInput } from "../validations/shipping";
import { rajaOngkirService, isRajaOngkirConfigured, missingRajaOngkirConfig } from "@/lib/services/rajaongkir";
import { getErrorMessage } from "@/lib/handle-error";

export async function getShippingRates(input: GetRatesInput) {
  try {
    if (!isRajaOngkirConfigured()) {
      const missing = missingRajaOngkirConfig();
      return { data: null, error: `Shipping provider not configured. Missing: ${missing.join(", ")}` };
    }

    const parsed = getRatesSchema.parse(input);
    const validated: { origin: string; destination: string; weight: number; couriers: string[] } = {
      origin: parsed.origin,
      destination: parsed.destination,
      weight: parsed.weight,
      couriers: parsed.couriers,
    };
    const data = await rajaOngkirService.getCosts(validated);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}