import { isUnder135GBP, applyVAT } from "./vatRule";

/**
 * 最終利益の詳細を計算する
 * @param {Object} params - パラメータオブジェクト
 * @param {number} params.sellingPrice - 売値（JPY）
 * @param {number} params.costPrice - 仕入れ値（JPY）
 * @param {number} params.shippingJPY - 配送料（JPY）
 * @param {number} params.categoryFeeJPY - カテゴリ手数料（JPY）
 * @param {number} params.customsRate - 関税率（%）
 * @param {number} params.platformRate - プラットフォーム手数料率（%）
 * @param {boolean} [params.includeVAT=false] - VATを含めるかどうか
 * @param {number} [params.exchangeRateGBPtoJPY] - GBPからJPYへの為替レート
 * @returns {Object} 最終利益の詳細
 * @returns {number} returns.customsFee - 関税額（JPY）
 * @returns {number} returns.platformFee - プラットフォーム手数料（JPY）
 * @returns {number} returns.totalCost - 実費合計（JPY）
 * @returns {number} returns.profit - 利益（JPY）
 * @returns {number} returns.profitMargin - 利益率（%）
 * @returns {number} returns.vatAmount - VAT額（JPY）
 * @returns {number} returns.priceIncludingVAT - VAT込み売値（JPY）
 */
export function calculateFinalProfitDetail({
    sellingPrice,
    costPrice,
    shippingJPY,
    categoryFeeJPY,
    customsRate,
    platformRate,
    includeVAT = false,
    exchangeRateGBPtoJPY,
    targetMargin = 0.25, // 👈 25% をデフォルトにする
}: {
    sellingPrice: number;
    costPrice: number;
    shippingJPY: number;
    categoryFeeJPY: number;
    customsRate: number;
    platformRate: number;
    includeVAT?: boolean;
    exchangeRateGBPtoJPY?: number;
    targetMargin?: number;
}) {
    let adjustedSellingPrice = sellingPrice;

    if (includeVAT && exchangeRateGBPtoJPY) {
        const priceGBP = sellingPrice / exchangeRateGBPtoJPY;
        if (isUnder135GBP(priceGBP)) {
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

    const suggestedPrice = totalCost / (1 - targetMargin);

    return {
        customsFee,
        platformFee,
        totalCost,
        profit,
        profitMargin,
        vatAmount,
        priceIncludingVAT: adjustedSellingPrice,
        suggestedPrice,
        targetMargin,
    };
}

/**
 * カテゴリ手数料額を計算する
 * @param {number} sellingPrice - 売値（JPY）
 * @param {number} categoryFeePercent - カテゴリ手数料率（%）
 * @returns {number} カテゴリ手数料額（JPY）
 */
export function calculateCategoryFee(
    sellingPrice: number,
    categoryFeePercent: number
): number {
    return sellingPrice * (categoryFeePercent / 100);
}

/**
 * 配送料（GBP）をJPYに換算する
 * @param {number} shippingPriceGBP - 配送料（GBP）
 * @param {number} exchangeRate - 為替レート（JPY/GBP）
 * @returns {number} 配送料（JPY）
 */
export function convertShippingPriceToJPY(
    shippingPriceGBP: number,
    exchangeRate: number
): number {
    return shippingPriceGBP * exchangeRate;
}

/**
 * 実費合計を計算する
 * @param {number} costPrice - 仕入れ値（JPY）
 * @param {number} shippingJPY - 配送料（JPY）
 * @param {number} categoryFeeJPY - カテゴリ手数料額（JPY）
 * @returns {number} 実費合計（JPY）
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
 * @param {number} sellingPrice - 売値（JPY）
 * @param {number} actualCost - 実費合計（JPY）
 * @returns {number} 粗利（JPY）
 */
export function calculateGrossProfit(
    sellingPrice: number,
    actualCost: number
): number {
    return sellingPrice - actualCost;
}

/**
 * 利益率を計算する
 * @param {number} grossProfit - 粗利（JPY）
 * @param {number} sellingPrice - 売値（JPY）
 * @returns {number} 利益率（%）
 */
export function calculateProfitMargin(
    grossProfit: number,
    sellingPrice: number
): number {
    if (sellingPrice === 0) return 0;
    return (grossProfit / sellingPrice) * 100;
}


