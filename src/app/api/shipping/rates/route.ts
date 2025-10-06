import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rajaOngkirService, isRajaOngkirConfigured, missingRajaOngkirConfig } from "@/lib/services/rajaongkir";

const requestSchema = z.object({
  origin: z.string().min(1), // RajaOngkir city_id/subdistrict_id depending on account tier
  destination: z.string().min(1),
  weight: z.number().int().positive(), // grams
  couriers: z.array(z.string()).min(1), // e.g. ["jne", "pos", "tiki"]
});

export async function POST(req: NextRequest) {
  try {
    if (!isRajaOngkirConfigured()) {
      const missing = missingRajaOngkirConfig();
      return NextResponse.json(
        { success: false, error: `RajaOngkir not configured. Missing: ${missing.join(", ")}` },
        { status: 503 },
      );
    }

    const json = await req.json();
    const parsed = requestSchema.parse(json);

    const input: { origin: string; destination: string; weight: number; couriers: string[] } = {
      origin: parsed.origin,
      destination: parsed.destination,
      weight: parsed.weight,
      couriers: parsed.couriers,
    };

    const data = await rajaOngkirService.getCosts(input);

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.flatten() }, { status: 400 });
    }
    console.error("/api/shipping/rates error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch shipping rates" }, { status: 500 });
  }
}

export async function GET() {
  const configured = isRajaOngkirConfigured();
  const missing = missingRajaOngkirConfig();
  return NextResponse.json({ configured, missing });
}