"use client";

import { Dialog } from "@headlessui/react";
import FinalResult from "./FinalResult";

type FinalProfitDetail = {
  costPriceJPY: number;
  sellingPriceJPY: number;
  sellingPriceGBP: number;
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
  importVATGBP?: number;
  importVATJPY?: number;
  vatToPayGBP?: number;
  vatToPayJPY?: number;
  netProfitJPY: number;
  finalProfitJPY: number;
  exchangeAdjustmentJPY: number;
  feeRebateJPY: number;
  profitMargin: number;
};

type FinalResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  shippingMethod: string;
  shippingJPY: number;
  data: FinalProfitDetail;
  exchangeRateGBPtoJPY: number;
};

export default function FinalResultModal({
  isOpen,
  onClose,
  shippingMethod,
  shippingJPY,
  data,
  exchangeRateGBPtoJPY,
}: FinalResultModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景オーバーレイ */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      {/* モーダル中央配置 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-2xl p-8 w-full sm:max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 ease-in-out">
          {/* タイトル */}
          <Dialog.Title className="text-2xl font-semibold mb-6 text-center">
            最終利益の詳細
          </Dialog.Title>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition"
            aria-label="Close"
          >
            ✕
          </button>

          {/* 中身 */}
          <FinalResult
            shippingMethod={shippingMethod}
            shippingJPY={shippingJPY}
            data={data}
            exchangeRateGBPtoJPY={exchangeRateGBPtoJPY}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
