"use client";

import { Suspense } from "react";
import { ChristmasBingo } from "./BingoInside";

export default function ChristmasBingoPage() {
    return (
        <Suspense
            fallback={<div className="text-center text-white">Loading...</div>}
        >
            <ChristmasBingo />
        </Suspense>
    );
}
