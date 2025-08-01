import { isUnder135GBP, applyVAT } from "./vatRule";

/**
 * 最終利益の詳細を計算する
 * @param {Object} params - パラメータオブジェクト
 * @param {number} params.sellingPrice - 売値（GBP）
 * @param {number} params.costPrice - 仕入れ値（JPY）
 * @param {number} params.shippingJPY - 配送料（JPY）
 * @param {number} params.categoryFeeJPY - カテゴリ手数料（JPY）
 * @param {number} params.customsRate - 関税率（%）
 * @param {number} params.platformRate - プラットフォーム手数料率（%）
 * @param {boolean} [params.includeVAT=false] - VATを含めるかどうか
 * @param {number} [params.exchangeRateGBPtoJPY] - GBPからJPYへの為替レート
 * @param {number} [params.targetMargin=0.25] - 目標利益率
 * @returns {Object} 最終利益の詳細
 */
export function calculateFinalProfitDetail({
  sellingPriceGBP,
  shippingJPY,
  categoryFeePercent,
  customsRatePercent,
  payoneerFeePercent,
  costPriceJPY,
  includeVAT = false,
  exchangeRateGBPtoJPY,
}: {
  sellingPriceGBP: number;   // 売値（￡）
  costPriceJPY: number; // JPY
  shippingJPY: number; // JPY
  categoryFeePercent: number; // %
  customsRatePercent: number;   // 関税 (%)
  payoneerFeePercent: number;
  includeVAT?: boolean;
  exchangeRateGBPtoJPY: number;
}) {
  if (!exchangeRateGBPtoJPY) {
    throw new Error("exchangeRateGBPtoJPY が必要です！");
  }

  // 1. VAT込み売値 (￡)
  const adjustedPriceGBP = includeVAT && isUnder135GBP(sellingPriceGBP)
    ? applyVAT(sellingPriceGBP)
    : sellingPriceGBP;
  console.log("1. VAT込み売値 (￡):", adjustedPriceGBP);

  // 2. カテゴリ手数料 (￡)
  const categoryFeeGBP = adjustedPriceGBP * (categoryFeePercent / 100);
  console.log("2.カテゴリ手数料（￡）:", categoryFeeGBP);

  // 3. 関税 (￡)
  const customsFeeGBP = adjustedPriceGBP * (customsRatePercent / 100);
  console.log("3. 関税（￡）:", customsFeeGBP);

  // 4. 粗利 (￡)
  const grossProfitGBP = adjustedPriceGBP - (categoryFeeGBP + customsFeeGBP);
  console.log("4. 粗利（￡）:", grossProfitGBP);

  // 5. Payoneer手数料 (粗利の %) (￡)
  const payoneerFeeGBP = grossProfitGBP * (payoneerFeePercent / 100);
  console.log("5. payoneer手数料（￡）:", payoneerFeeGBP);

  // 6. 総手数料合計 (￡)
  const totalFeesGBP = categoryFeeGBP + payoneerFeeGBP + customsFeeGBP;
  console.log("6. 総手数料合計（￡）:", totalFeesGBP);

  // 7. 手数料引き後の正味収入 (￡) ← VAT込み総額ベース
  const netSellingGBP = adjustedPriceGBP - totalFeesGBP;
  console.log("7. 手数料引き後の正味収入（￡）:", netSellingGBP);

  // 8.両替手数料(JPY)
  const exchangeFeePerGBP = 3.3;
  const exchangeFeeJPY = netSellingGBP * exchangeFeePerGBP;
  console.log("8.両替手数料(JPY)：", exchangeFeeJPY);

  // 9.正味JPY(GBP→JPY換算、両替手数料を引く)
  const netSellingJPY = (netSellingGBP * exchangeRateGBPtoJPY) - exchangeFeeJPY;

  // 10. VAT分（￡ → JPY）
  const vatAmountGBP = adjustedPriceGBP - sellingPriceGBP;
  const vatAmountJPY = vatAmountGBP * exchangeRateGBPtoJPY;
  // 差額納付分
  const vatToPayGBP = vatAmountGBP;

  // 11. 利益JPY (仕入れ値・送料を引く)
  const netProfitJPY = netSellingJPY - vatAmountJPY - costPriceJPY - shippingJPY;

  // 税還付金(JPY)　手数料還付金(JPY)
  const exchangeAdjustmentJPY = costPriceJPY * 10 / 110;

  const feeRebateJPY = (categoryFeeGBP * 10 / 100) * exchangeRateGBPtoJPY;

  // 12. 最終損益 (JPY)
  const finalProfitJPY = netProfitJPY + exchangeAdjustmentJPY + feeRebateJPY;

  // 13. 利益率
  const sellingPriceJPY = sellingPriceGBP * exchangeRateGBPtoJPY;
  const profitMargin = sellingPriceJPY === 0 ? 0 : (finalProfitJPY / sellingPriceJPY) * 100;


  return {
    sellingPriceGBP,
    sellingPriceJPY,
    adjustedPriceGBP,
    categoryFeeGBP,
    customsFeeGBP,
    costPriceJPY,
    payoneerFeeGBP,
    totalFeesGBP,
    netSellingGBP,
    exchangeFeeJPY,
    netSellingJPY,
    vatAmountGBP,
    vatAmountJPY,
    vatToPayGBP,
    netProfitJPY,
    finalProfitJPY,
    exchangeAdjustmentJPY,
    feeRebateJPY,
    profitMargin
  };
}

/**
 * カテゴリ手数料額を計算する
 */
export function calculateCategoryFee(
  sellingPrice: number,
  categoryFeePercent: number
): number {
  return sellingPrice * (categoryFeePercent / 100);
}

/**
 * 配送料（GBP）をJPYに換算する
 */
export function convertShippingPriceToJPY(
  shippingPriceGBP: number,
  exchangeRate: number
): number {
  return shippingPriceGBP * exchangeRate;
}

/**
 * 実費合計を計算する
 */
export function calculateActualCost(
  costPrice: number,
  shippingJPY: number,
  categoryFeeJPY: number
): number {
  return costPrice + shippingJPY + categoryFeeJPY;
}

/**
 * 粗利を計算する
 */
export function calculateGrossProfit(
  sellingPrice: number,
  actualCost: number
): number {
  return sellingPrice - actualCost;
}

/**
 * 利益率を計算する
 */
export function calculateProfitMargin(
  grossProfit: number,
  sellingPrice: number
): number {
  if (sellingPrice === 0) return 0;
  return (grossProfit / sellingPrice) * 100;
}
