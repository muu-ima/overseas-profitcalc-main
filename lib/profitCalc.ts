import { isUnder135GBP, applyVAT } from "./vatRule";

export function calculateFinalProfitDetail({
  sellingPrice,
  costPrice,
  shippingJPY,
  categoryFeeJPY,
  customsRate,
  platformRate,
  includeVAT = false,
  exchangeRateGBPtoJPY,
}: {
  sellingPrice: number;
  costPrice: number;
  shippingJPY: number;
  categoryFeeJPY: number;
  customsRate: number;
  platformRate: number;
  includeVAT?: boolean;
  exchangeRateGBPtoJPY?: number;
}) {
  let adjustedSellingPrice = sellingPrice;

  if (includeVAT && exchangeRateGBPtoJPY) {
    const priceGBP = sellingPrice / exchangeRateGBPtoJPY;
    if (!isUnder135GBP(priceGBP)) {
      adjustedSellingPrice = applyVAT(priceGBP) * exchangeRateGBPtoJPY;
    }
  } else if (includeVAT) {
    adjustedSellingPrice = sellingPrice * 1.2;
  }

  const customsFee = adjustedSellingPrice * (customsRate / 100);
  const platformFee = adjustedSellingPrice * (platformRate / 100);

  const totalCost =
    costPrice + shippingJPY + categoryFeeJPY + customsFee + platformFee;
  const profit = adjustedSellingPrice - totalCost;

  const profitMargin = sellingPrice === 0
    ? 0
    : (profit / (includeVAT ? adjustedSellingPrice : sellingPrice)) * 100;

  const vatAmount = adjustedSellingPrice - sellingPrice;

  return {
    customsFee,
    platformFee,
    totalCost,
    profit,
    profitMargin,
    vatAmount,
    priceIncludingVAT: adjustedSellingPrice,
  };
}

/**
 * カテゴリ手数料額を計算
 */
export function calculateCategoryFee(
  sellingPrice: number,
  categoryFeePercent: number
): number {
  return sellingPrice * (categoryFeePercent / 100);
}

/**
 * 送料JPY換算
 */
export function convertShippingPriceToJPY(
  shippingPriceGBP: number,
  exchangeRate: number
): number {
  return shippingPriceGBP * exchangeRate;
}

/**
 * 実費計算
 */
export function calculateActualCost(
  costPrice: number,
  shippingJPY: number,
  categoryFeeJPY: number
): number {
  return costPrice + shippingJPY + categoryFeeJPY;
}

/**
 * 粗利計算
 */
export function calculateGrossProfit(
  sellingPrice: number,
  actualCost: number
): number {
  return sellingPrice - actualCost;
}

/**
 * 利益率計算
 */
export function calculateProfitMargin(
  grossProfit: number,
  sellingPrice: number
): number {
  if (sellingPrice === 0) return 0;
  return (grossProfit / sellingPrice) * 100;
}
