"use client";

type FinalProfitDetail = {
  customsFee: number;
  platformFee: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
};

type FinalResultProps = {
  shippingMethod: string;
  shippingJPY: number;
  categoryFeeJPY: number;
  data: FinalProfitDetail;
};

export default function FinalResult({
  shippingMethod,
  shippingJPY,
  categoryFeeJPY,
  data,
}: FinalResultProps) {
  return (
    <div className="p-4 border rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">最終利益の詳細</h2>
      <p>配送方法: {shippingMethod}</p>
      <p>配送料: {shippingJPY.toLocaleString()} 円</p>
      <p>カテゴリ手数料: {categoryFeeJPY.toLocaleString()} 円</p>
      <p>関税: {data.customsFee.toLocaleString()} 円</p>
      <p>プラットフォーム手数料: {data.platformFee.toLocaleString()} 円</p>
      <p>実費合計: {data.totalCost.toLocaleString()} 円</p>
      <p>粗利: {data.profit.toLocaleString()} 円</p>
      <p>利益率: {data.profitMargin.toFixed(2)}%</p>
      <p className="font-bold text-green-600">
        最終利益: {data.profit.toLocaleString()} 円
      </p>
    </div>
  );
}
