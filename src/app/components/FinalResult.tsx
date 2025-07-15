"use client";

// import { isUnder135GBP, applyVAT } from "@/lib/vatRule";

type FinalProfitDetail = {
  adjustedPriceGBP: number;
  categoryFeeGBP: number;
  customsFeeGBP: number;
  payoneerFeeGBP: number;
  totalFeesGBP: number;
  netSellingGBP: number;
  exchangeFeeJPY: number;
  netSellingJPY: number;
  vatAmountGBP: number;
  vatAmountJPY: number;
  netProfitJPY: number;
  finalProfitJPY: number;
};

type FinalResultProps = {
  shippingMethod: string;
  shippingJPY: number;
  categoryFeeJPY: number;
  data: FinalProfitDetail;
  exchangeRateGBPtoJPY: number;
};



export default function FinalResult({
  shippingMethod,
  shippingJPY,
  categoryFeeJPY,
  data,
  exchangeRateGBPtoJPY
}: FinalResultProps) {
  return (
    <div className="p-4 border rounded-lg shadow space-y-2">
      <h2 className="text-lg font-bold">最終利益の詳細</h2>
      <p>配送方法: {shippingMethod}</p>
      <p>配送料:
        £{(shippingJPY / exchangeRateGBPtoJPY).toFixed(2)} /
        ¥{shippingJPY.toLocaleString()} 円</p>
      <p>
        カテゴリ手数料:
        £{(categoryFeeJPY / exchangeRateGBPtoJPY).toFixed(2)} /
        ￥{categoryFeeJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })}円
      </p>
      <p>
        関税:
        £{data.customsFeeGBP.toFixed(2)} /
        ￥{Math.round(data.customsFeeGBP * exchangeRateGBPtoJPY).toLocaleString()} 円
      </p>

      <p>
        Payoneer手数料:
        £{data.payoneerFeeGBP.toFixed(2)} /
        ￥{Math.round(data.payoneerFeeGBP * exchangeRateGBPtoJPY).toLocaleString()} 円
      </p>

      <p>VAT額:
        £{(data.vatAmountJPY / exchangeRateGBPtoJPY).toFixed(2)} /
        ￥{data.vatAmountJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })}円
      </p>
      <p>
        VAT込み価格:
        £{data.adjustedPriceGBP.toFixed(2)} /
        ￥{Math.round(data.adjustedPriceGBP * exchangeRateGBPtoJPY).toLocaleString()} 円
      </p>

      <p>
        両替手数料:
        ￥{data.exchangeFeeJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })} 円
      </p>

      <p>正味JPY: {data.netSellingJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })} 円</p>
      <p>最終利益(JPY): {data.finalProfitJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })} 円</p>
    </div>
  );
}
