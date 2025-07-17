"use client";

import React from "react";
import { useEffect, useState } from "react";
import { getCheapestShipping, ShippingData } from "@/lib/shipping";
import ExchangeRate from "./components/ExchangeRate";
import Result from "./components/Result";
import {
  calculateFinalProfitDetail,
} from "@/lib/profitCalc";

import { isUnder135GBP } from "@/lib/vatRule";
// import { calculateFinalProfitDetail } from "@/lib/profitCalc";
import FinalResultModal from "./components/FinalResultModal";
import { motion, AnimatePresence } from "framer-motion";


// ここから型定義を追加
type ShippingResult = {
  method: string;
  price: number | null;
};

type CategoryFeeType = {
  label: string;
  value: number;
  categories: string[];
};

export default function Page() {
  // State管理
  const [shippingRates, setShippingRates] = useState<ShippingData | null>(null);
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [weight, setWeight] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  });
  const [rate, setRate] = useState<number | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryFeeType[]>([]);
  const [selectedCategoryFee, setSelectedCategoryFee] = useState<number | "">(
    ""
  );
  const [result, setResult] = useState<ShippingResult | null>(null);
  // VATのStateを追加
  const [includeVAT, setIncludeVAT] = useState<boolean>(false);
  //モーダル制御
  const [isOpen, setIsOpen] = useState(false);


  // 配送料データ読み込み
  useEffect(() => {
    fetch("/data/shipping.json")
      .then((res) => res.json())
      .then((data) => setShippingRates(data));
  }, []);

  // VAT判定専用
  useEffect(() => {
    if (typeof sellingPrice === "number") {
      const priceGBP = sellingPrice;
      setIncludeVAT(isUnder135GBP(priceGBP));
    } else {
      setIncludeVAT(false);
    }
  }, [sellingPrice, rate]);

  useEffect(() => {
    fetch("/data/categoryFees.json")
      .then((res) => res.json())
      .then((data) => setCategoryOptions(data));
  }, []);

  useEffect(() => {
    if (rate !== null) {
      console.log(`最新為替レート：${rate}`);
    }
  }, [rate]);

  useEffect(() => {
    if (shippingRates && weight !== null && weight > 0) {
      const cheapest = getCheapestShipping(shippingRates, weight, dimensions);
      setResult(cheapest);
    }
  }, [shippingRates, weight, dimensions]);


  const final = (
    typeof sellingPrice === "number" &&
    typeof costPrice === "number" &&
    rate !== null &&
    result?.price !== null &&
    result?.method &&
    selectedCategoryFee !== ""
  ) ? calculateFinalProfitDetail({
    sellingPriceGBP: sellingPrice,
    costPriceJPY: costPrice,
    shippingJPY: result.price,
    categoryFeePercent: selectedCategoryFee as number,
    customsRatePercent: 1.35,
    payoneerFeePercent: 2,
    includeVAT: includeVAT,
    exchangeRateGBPtoJPY: rate,
  }) : null;

  const isEnabled =
    sellingPrice !== "" &&
    costPrice !== "" &&
    rate !== null &&
    weight !== null &&
    selectedCategoryFee !== "";

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
      <div className="flex-1 flex flex-col space-y-4">
        {/* 為替レート表示コンポーネント */}
        <ExchangeRate onRateChange={setRate} />
        <div>
          <label className="block font-semibold mb-1">仕入れ値 (円) </label>
          <input
            type="number"
            step="10"
            min="10"
            value={costPrice}
            onChange={(e) => {
              const raw = e.target.value;
              //空なら空にする
              if (raw === "") {
                setCostPrice("");
                return;
              }

              //数値化
              let num = Number(raw);

              //マイナスなら0に
              if (num < 0) num = 0;

              setCostPrice(num);
            }}
            placeholder="仕入れ値"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">売値 (£) </label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) =>
              setSellingPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="売値"
            className="w-full px-3 py-2 border rounded-md"
          />
          {rate !== null && sellingPrice !== "" && (
            <p>概算円価格：約 {Math.round(Number(sellingPrice) * rate)} 円</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">実重量 (g) </label>
          <input
            type="number"
            value={weight ?? ""}
            onChange={(e) =>
              setWeight(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="実重量"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">サイズ (cm)</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={dimensions.length || ""}
              onChange={(e) =>
                setDimensions((prev) => ({
                  ...prev,
                  length: Number(e.target.value),
                }))
              }
              placeholder="長さ"
              className="px-2 py-1 border rounded-md"
            />
            <input
              type="number"
              value={dimensions.width || ""}
              onChange={(e) =>
                setDimensions((prev) => ({
                  ...prev,
                  width: Number(e.target.value),
                }))
              }
              placeholder="幅"
              className="px-2 py-1 border rounded-md"
            />
            <input
              type="number"
              value={dimensions.height || ""}
              onChange={(e) =>
                setDimensions((prev) => ({
                  ...prev,
                  height: Number(e.target.value),
                }))
              }
              placeholder="高さ"
              className="px-2 py-1 border rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">カテゴリ手数料 </label>
          <select
            value={selectedCategoryFee}
            onChange={(e) => setSelectedCategoryFee(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">カテゴリを選択してください</option>
            {categoryOptions.map((cat) => (
              <option key={cat.label} value={cat.value}>
                {cat.label} ({cat.value}%)
              </option>
            ))}
          </select>
        </div>

      </div>
      {/* 右カラム */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* 配送結果 */}
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <p>
            配送方法: {
              result === null
                ? "計算中..."
                : result.method
            }
          </p>
          <p>
            配送料: {
              result === null
                ? "計算中..."
                : result.price !== null
                  ? `${result.price}円`
                  : "不明"
            }
          </p>
        </div>


        {/* 利益結果 */}
        {rate !== null && sellingPrice !== "" && (
          <Result
            originalPriceGBP={typeof sellingPrice === "number" ? sellingPrice : 0}  // ★ 修正
            priceJPY={typeof sellingPrice === "number" && rate !== null ? sellingPrice * rate : 0}
            rate={rate}
            includeVAT={includeVAT} // 自動判定
            exchangeRateGBPtoJPY={rate!}
          />
        )}

        <AnimatePresence>
          {final && (
            <motion.button key="final-profit-button" 
              onClick={() => setIsOpen(true)}
              disabled={!isEnabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className={`btn-primary ${isEnabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed text-gray-200"
                } px-8 py-4 text-lg rounded-full`}
            >
              最終利益の詳細を見る
            </motion.button>
          )}
        </AnimatePresence>

      </div>

      {final && (
        <FinalResultModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          shippingMethod={result?.method || ""}
          shippingJPY={result?.price || 0}
          data={final}
          exchangeRateGBPtoJPY={rate!}
        />
      )}
    </div>
  );
}
