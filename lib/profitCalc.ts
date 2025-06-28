// lib/profitCalc.ts

/**
 * カテゴリ手数料額を計算
 * @param sellingPrice 売値 (JPY)
 * @param categoryFeePercent カテゴリ手数料 (%)
 * @returns カテゴリ手数料 (JPY)
 */

export function calculateCategoryFee(
    sellingPrice: number,
    categoryFeePercent: number
): number {
    return sellingPrice * (categoryFeePercent / 100);
}

/**
 * 送料JPY換算
 * @param shippingPriceGBP 送料（GBP）
 * @param exchangeRate 為替レート（JPY/GBP）
 * @returns 送料（JPY）
 */
export function convertShippingPriceToJPY(
  shippingPriceGBP: number,
  exchangeRate: number
): number {
  return shippingPriceGBP * exchangeRate;
}

/**
 * 実費計算
 * @param costPrice 仕入れ値 (JPY)
 * @param shippingJPY 送料 (JPY)
 * @param categoryFeeJPY カテゴリ手数料額 (JPY)
 * @returns 実費合計　(JPY)
 */

export function calculateActualCost(
    costPrice: number,
    shippingJPY: number,
    categoryFeeJPY: number
): number {
    return costPrice + shippingJPY +categoryFeeJPY;
}

/**
 * 粗利計算
 * @param sellingPrice 売値 (JPY)
 * @param actualCost 実費合計 (JPY)
 * @returns 粗利　(JPY)
 */

export function calculateGrossProfit(
    sellingPrice: number,
    actualCost: number
): number {
    return sellingPrice - actualCost;
}

/**
 * 利益率計算
 * @param grossProfit 粗利 (JPY)
 * @param sellingPrice 売値　(JPY)
 * @returns 利益率 (%)
 */

export function calculateProfitMargin (
    grossProfit: number,
    sellingPrice: number
): number {
    if (sellingPrice === 0) return 0;
    return ( grossProfit / sellingPrice) * 100
}

export function calculateFinalProfitDetail({
  sellingPrice,
  costPrice,
  shippingJPY,
  categoryFeeJPY,
  customsRate,
  platformRate,
}: {
  sellingPrice: number;
  costPrice: number;
  shippingJPY: number;
  categoryFeeJPY: number;
  customsRate: number;
  platformRate: number;
}) {
  const customsFee = sellingPrice * (customsRate / 100);
  const platformFee = sellingPrice * (platformRate / 100);

  const totalCost = costPrice + shippingJPY + categoryFeeJPY + customsFee + platformFee;
  const profit = sellingPrice - totalCost;
  const profitMargin = (profit / sellingPrice) * 100;

  return {
    customsFee,
    platformFee,
    totalCost,
    profit,
    profitMargin,
  };
}
