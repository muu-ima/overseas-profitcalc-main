// lib/vatRule.ts

const GBP_THRESHOLD = 135;
const VAT_RATE = 0.2//20%

/**
 * 135ポンド未満かどうかを判定
 * @param priceGBP GBP価格
 */

export function isUnder135GBP(priceGBP: number): boolean {
    return priceGBP < GBP_THRESHOLD;
}

/**
 * VAT込み価格を返す（加算後の価格）
 * @param priceGBP GBP価格
 */

export function applyVAT(priceGBP: number): number {
    return priceGBP *(1 + VAT_RATE);
}

/**
 * VAT金額のみを返す
 * @param priceGBP GBP価格
 */

export function calculateVAT(priceGBP: number): number {
    return priceGBP * VAT_RATE;
}