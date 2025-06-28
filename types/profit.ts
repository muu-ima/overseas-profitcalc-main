// /types/profit.ts

export type ShippingResult = {
  method: string;
  price: number | null;
};

export type CategoryFeeType = {
  label: string;
  value: number;
  categories: string[];
};

export type CalcResult = {
  shippingJPY: number;
  categoryFeeJPY: number;
  actualCost: number;
  grossProfit: number;
  profitMargin: number;
  method: string;
};

export type FinalProfitDetail = {
  sellingPrice: number;
  costPrice: number;
  shippingJPY: number;
  categoryFeeJPY: number;
  customsFee: number;
  platformFee: number;
  actualCost: number;
  grossProfit: number;
  profitMargin: number;
};
