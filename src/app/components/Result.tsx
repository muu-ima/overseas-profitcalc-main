'use client';

import React from "react";
import { applyVAT, isUnder135GBP } from "@/lib/vatRule";
import { getAdjustedRate } from "@/lib/exchange";
import { convertToJPY } from "@/lib/price";

type ResultProps = {
    priceGBP: number;
    rate: number;         // APIから取得した生レート
    includeVAT: boolean;
    calcResult: any;
};

export default function Result({ priceGBP, rate, includeVAT }: ResultProps) {
    const fee = 3.3; // 為替手数料（固定値でも可、将来的にprops化も可能）

    // 生レートに手数料を足して調整したレートを作る
    const adjustedRate = getAdjustedRate(rate, fee);

    //135ポンド以上かどうか (ロジック反転)
    const overThreshold = !isUnder135GBP(priceGBP);

    //VAT適用したGBP価格
    const priceWithVAT = includeVAT ? applyVAT(priceGBP) : priceGBP;

    //最終JPY価格（四捨五入）
    const finalJPY = convertToJPY(priceWithVAT, adjustedRate); 

    return (
        <div className="result-box p-4 border rounded bg-gray-50">
            <p>GBP価格: ￡{priceGBP.toFixed(2)}</p>
            <p>為替レート (手数料込み): {adjustedRate.toFixed(3)} 円</p>
            <p>135ポンド以上： {overThreshold ? "はい" : "いいえ"}</p>
            <p>VAT {includeVAT ? "含む" : "含まない"}</p>
            <p className="font-bold text-lg mt-2">最終価格: ￥{finalJPY.toLocaleString()}</p>
        </div>
    );
}