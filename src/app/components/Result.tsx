'use client';

import React from "react";
import { applyVAT, isUnder135GBP } from "@/lib/vatRule";
import { getAdjustedRate } from "@/lib/exchange";
import { convertToJPY } from "@/lib/price";

type CalcResult = {
    shippingJPY: number;
    categoryFeeJPY: number;
    actualCost: number;
    grossProfit: number;
    profitMargin: number;
    method: string;
};

type ResultProps = {
    originalPriceGBP: number; // 入力そのままの GBP
    priceJPY: number; // 追加：計算済みのJPY価格をpropsで受け取る
    rate: number;         // APIから取得した生レート
    includeVAT: boolean;
    calcResult: CalcResult | null;  // anyを具体的に
};

export default function Result({ originalPriceGBP,priceJPY, rate, includeVAT }: ResultProps) {
    const fee = 3.3; // 為替手数料（固定値でも可、将来的にprops化も可能）

    // 生レートに手数料を足して調整したレートを作る
    const adjustedRate = getAdjustedRate(rate, fee);

    //135ポンド以上かどうか (ロジック反転)
    const overThreshold = !isUnder135GBP(originalPriceGBP,);

    //VAT適用したGBP価格
    const priceWithVAT = includeVAT ? applyVAT(originalPriceGBP,) : originalPriceGBP;

    //最終JPY価格（四捨五入）
    const finalJPY = convertToJPY(priceWithVAT, adjustedRate);

    return (
        <div className="result-box p-4 border rounded bg-gray-50">
            <p>GBP価格(ポンド): ￡{originalPriceGBP.toFixed(2)}</p>
            <p>円換算価格: ￥{priceJPY.toLocaleString()}</p>
            <p>為替レート (手数料込み): {adjustedRate.toFixed(3)} 円</p>
            <p>135ポンド超過： {overThreshold ? "はい" : "いいえ"}</p>
            <p>VAT適用: {includeVAT ? "含む" : "含まない"}</p>
            <p className="font-bold text-lg mt-2">概算価格: ￥{finalJPY.toLocaleString()}</p>
        </div>
    );
}