import { z } from "zod";

const API_KEY = process.env.RAJAONGKIR_API_KEY;
const BASE_URL = process.env.RAJAONGKIR_BASE_URL; // e.g. https://api.rajaongkir.com/starter or /basic or /pro

if (!API_KEY) {
  // Do not throw at module load in Next.js; defer to runtime for better DX
  console.warn("[RajaOngkir] RAJAONGKIR_API_KEY is not set. Shipping rate requests will fail.");
}

if (!BASE_URL) {
  console.warn("[RajaOngkir] RAJAOngkir BASE_URL is not set (RAJAONGKIR_BASE_URL). Example: https://api.rajaongkir.com/starter");
}

export const costRequestSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  weight: z.number().int().positive(), // in grams
  courier: z.string().min(2), // e.g. "jne", "pos", "tiki"
});

export type CostRequest = z.infer<typeof costRequestSchema>;

export interface RajaOngkirCostResponse {
  rajaongkir: {
    status: { code: number; description: string };
    origin_details?: unknown;
    destination_details?: unknown;
    results: Array<{
      code: string;
      name: string;
      costs: Array<{
        service: string;
        description: string;
        cost: Array<{ value: number; etd: string; note: string }>;
      }>;
    }>;
  };
}

export interface ShippingRateService {
  getCosts(params: { origin: string; destination: string; weight: number; couriers: string[] }): Promise<{
    origin: string;
    destination: string;
    weight: number;
    couriers: string[];
    results: RajaOngkirCostResponse[];
  }>;
}

async function requestCostOnce({ origin, destination, weight, courier }: CostRequest) {
  if (!API_KEY || !BASE_URL) {
    throw new Error("RajaOngkir is not configured. Please set RAJAONGKIR_API_KEY and RAJAONGKIR_BASE_URL env vars.");
  }

  const url = `${BASE_URL.replace(/\/$/, "")}/cost`;
  const body = new URLSearchParams();
  body.set("origin", origin);
  body.set("destination", destination);
  body.set("weight", String(weight));
  body.set("courier", courier);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "key": API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    // 10s timeout via Next fetch options is not native; rely on platform defaults
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`RajaOngkir cost request failed (${res.status}): ${text}`);
  }
  const data = await res.json() as RajaOngkirCostResponse;
  return { courier, data };
}

export const rajaOngkirService: ShippingRateService = {
  async getCosts({ origin, destination, weight, couriers }) {
    const uniqueCouriers = Array.from(new Set(couriers.map((c) => c.toLowerCase().trim()).filter(Boolean)));
    if (uniqueCouriers.length === 0) {
      throw new Error("At least one courier must be provided");
    }

    const results = await Promise.all(
      uniqueCouriers.map((courier) => requestCostOnce({ origin, destination, weight, courier }))
    );

    // Return aggregated payload preserving original API shape per courier
    return {
      origin,
      destination,
      weight,
      couriers: results.map((r) => r.courier),
      results: results.map((r) => r.data),
    };
  },
};

// Helpers to check configuration state at runtime (server-side only)
export function isRajaOngkirConfigured(): boolean {
  return Boolean(API_KEY && BASE_URL);
}

export function missingRajaOngkirConfig(): string[] {
  const missing: string[] = [];
  if (!API_KEY) missing.push("RAJAONGKIR_API_KEY");
  if (!BASE_URL) missing.push("RAJAONGKIR_BASE_URL");
  return missing;
}