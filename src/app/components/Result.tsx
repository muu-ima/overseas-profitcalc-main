'use client';

import React from "react";
import { applyVAT, isUnder135GBP } from "@/lib/vatRule";
import { convertToJPY } from "@/lib/price";

type ResultProps = {
    priceGBP: number;
    rate: number;
    includeVAT: boolean;
    calcResult: any;
};

export default function Result({ priceGBP, rate, includeVAT }: ResultProps) {
    //VAT加算前の価格が135ポンド以下かどうか
    const underThreshold = isUnder135GBP(priceGBP);

    //VAT適用したGBP価格
    const priceWithVAT = includeVAT ? applyVAT(priceGBP) : priceGBP;

    //最終JPY価格（四捨五入）
    const finalJPY = convertToJPY(priceWithVAT, rate);

    return (
        <div className="result-box p-4 border rounded bg-gray-50">
            <p>GBP価格: ￡{priceGBP.toFixed(2)}</p>
            <p>為替レート: {rate} 円</p>
            <p>135ポンド以下： {underThreshold ? "はい" : "いいえ"}</p>
            <p>VAT {includeVAT ? "含む" : "含まない"}</p>
            <p className="font-bold text-lg mt-2">最終価格: ￥{finalJPY.toLocaleString()}</p>
        </div>
    );
}