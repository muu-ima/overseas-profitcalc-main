"use client";

// import { isUnder135GBP, applyVAT } from "@/lib/vatRule";

type FinalProfitDetail = {
  costPriceJPY: number;
  sellingPriceJPY: number; 
  sellingPriceGBP: number; // 元値も渡しておく
  adjustedPriceGBP: number;
  categoryFeeGBP: number;
  customsFeeGBP: number;
  payoneerFeeGBP: number;
  totalFeesGBP: number;
  netSellingGBP: number;
  exchangeFeeJPY: number;
  netSellingJPY: number;
  vatAmountGBP: number;    // ← ここを追加
  vatAmountJPY: number;    // ← ここを追加
  importVATGBP?: number; // 仕入れ時VAT
  importVATJPY?: number;
  vatToPayGBP?: number; // 納付額
  vatToPayJPY?: number;
  netProfitJPY: number;
  finalProfitJPY: number;
  exchangeAdjustmentJPY: number;
  feeRebateJPY: number;
  profitMargin: number;
};

type FinalResultProps = {
  shippingMethod: string;
  shippingJPY: number;
  data: FinalProfitDetail;
  exchangeRateGBPtoJPY: number;
};



export default function FinalResult({
  shippingMethod,
  shippingJPY,
  data,
  exchangeRateGBPtoJPY
}: FinalResultProps) {
  return (
    <div className="p-4 border rounded-lg shadow space-y-2 bg-white">
      <h2 className="text-lg font-bold mb-2">【最終利益の詳細】</h2>

      <div className="space-y-1">
        <p>■ 配送方法: {shippingMethod}</p>
        <p>■ 配送料:
          £{(shippingJPY / exchangeRateGBPtoJPY).toFixed(2)} /
          ¥{shippingJPY.toLocaleString()} 円</p>
        <p>■ 仕入れ : ￡{(data.costPriceJPY / exchangeRateGBPtoJPY).toFixed(2)} / ￥{data.costPriceJPY.toLocaleString()}</p>

        <div className="border-t border-gray-300 my-2" />
        <p>
          ■ カテゴリ手数料:
          £{(data.categoryFeeGBP).toFixed(2)} /
          ￥{Math.round(data.categoryFeeGBP * exchangeRateGBPtoJPY).toLocaleString(undefined, { maximumFractionDigits: 0 })}円
        </p>
        <p>
          ■ 関税:
          £{data.customsFeeGBP.toFixed(2)} /
          ￥{Math.round(data.customsFeeGBP * exchangeRateGBPtoJPY).toLocaleString()} 円
        </p>

        <p>
          ■ Payoneer手数料:
          £{data.payoneerFeeGBP.toFixed(2)} /
          ￥{Math.round(data.payoneerFeeGBP * exchangeRateGBPtoJPY).toLocaleString()} 円
        </p>

        <p>
          ■ 両替手数料:
          £{(data.adjustedPriceGBP / exchangeRateGBPtoJPY).toFixed(2)} /
          ￥{data.exchangeFeeJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })} 円
        </p>

        <div className="border-t border-gray-300 my-2" />

        <p>■ VAT額:
          £{(data.vatAmountJPY / exchangeRateGBPtoJPY).toFixed(2)} /
          ￥{data.vatAmountJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })}円
        </p>
        <p>
          ■ VAT込み価格:
          £{data.adjustedPriceGBP.toFixed(2)} /
          ￥{Math.round(data.adjustedPriceGBP * exchangeRateGBPtoJPY).toLocaleString()} 円
        </p>

        <p>■ VAT抜き価格: £{data.sellingPriceGBP.toFixed(2)} /
          ￥{Math.round(data.sellingPriceGBP * exchangeRateGBPtoJPY).toLocaleString()} 円
        </p>

        {data.vatToPayGBP !== undefined && data.vatToPayGBP !== null && (
          <p>■ 差額納付VAT: £{data.vatToPayGBP.toFixed(2)}</p>
        )}
        <div className="border-t border-gray-300 my-2" />


        <p>■ 利益（売上 - 仕入 - 送料）: {data.netProfitJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })} 円</p>
        <p>■ 最終利益(JPY): {data.finalProfitJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })} 円</p>
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-gray-700 font-medium">利益率</span>
          <span className="text-2xl font-bold text-green-600">{data.profitMargin.toFixed(2)}%</span>
        </div>
        <p className="text-gray-500 text-sm">
          ※ 税還付金 : ￡{(data.exchangeAdjustmentJPY / exchangeRateGBPtoJPY).toFixed(2)} / ￥{data.exchangeAdjustmentJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          <br></br>
          ※ 手数料還付金 :￡{(data.feeRebateJPY / exchangeRateGBPtoJPY).toFixed(2)} / ￥{data.feeRebateJPY.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}
