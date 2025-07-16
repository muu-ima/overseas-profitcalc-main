'use client';

import React from "react";
import { applyVAT, isUnder135GBP } from "@/lib/vatRule";

type ResultProps = {
    originalPriceGBP: number; // 入力そのままの GBP
    priceJPY: number; // 追加：計算済みのJPY価格をpropsで受け取る
    rate: number;         // APIから取得した生レート
    includeVAT: boolean;
    exchangeRateGBPtoJPY: number;  // これを追加！
};

export default function Result({ originalPriceGBP, priceJPY,  includeVAT,exchangeRateGBPtoJPY, }: ResultProps) {

    //135ポンド以上かどうか (ロジック反転)
    const overThreshold = !isUnder135GBP(originalPriceGBP,);

    //VAT適用したGBP価格
    const priceWithVAT = includeVAT ? applyVAT(originalPriceGBP,) : originalPriceGBP;

    return (
        <div className="result-box p-4 border rounded bg-gray-50">
            <p>GBP価格(ポンド): ￡{originalPriceGBP.toFixed(1)} /
                ￥{priceJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })}円
            </p>
            <p>135ポンド超過： {overThreshold ? "はい" : "いいえ"}</p>
            <p>VAT適用: {includeVAT ? "含む" : "含まない"}</p>
            <p className="font-bold text-lg mt-2">
                概算価格（GBP）: £{priceWithVAT.toFixed(2)}<br />
                概算価格（JPY）: ￥{(priceWithVAT * exchangeRateGBPtoJPY).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>        
        </div>
    );
}