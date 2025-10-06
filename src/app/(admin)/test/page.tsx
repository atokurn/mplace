"use client";

import { Suspense } from "react";
import TestClient from "./TestClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestClient />
    </Suspense>
  );
}