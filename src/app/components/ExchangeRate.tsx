'use client';
import { useEffect, useState } from "react";
import { getAdjustedRate} from "@/lib/exchange";

export default function ExchangeRate({
    onRateChange,    
}: {
    onRateChange?: (rate: number | null) => void;
}) {
    const [rawRate, setRawRate] = useState<number | null>(null);
    const [adjustedRate, setAdjustedRate] = useState<number | null>(null);

    useEffect(()=> {
        fetch('https://enyukari.capoo.jp/profit-calc/exchangeRate.json')
        .then(res => res.json())
        .then(data => {
            const base = data.rate;
            const adjusted = getAdjustedRate(base);
            setRawRate(base);
            setAdjustedRate(adjusted);
            if (onRateChange) onRateChange(data.rate);
        })
        .catch(err => {
            console.error('為替取得エラー', err);
            setRawRate(null);
            setAdjustedRate(null);
            if (onRateChange) onRateChange(null);
        });
    }, []);

     return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">現在の為替レート</h2>
      <p>
        GBP → JPY : (手数料込み) :{" "}
        {adjustedRate !== null ? `${adjustedRate?.toFixed(2)}円` : '取得中...'}
      </p>
      <p className="text-sm text-gray-500">
      (生レート: {rawRate !== null ? `${rawRate}円` : '取得中...'} /手数料: +3.3円)
      </p>
    </div>
  );
}