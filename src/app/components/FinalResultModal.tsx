"use client";

import { Dialog } from "@headlessui/react";
import FinalResult from "./FinalResult";

type FinalProfitDetail = {
  costPriceJPY: number;
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
      {/* 背景 */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* モーダルの中央配置 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">
            最終利益の詳細
          </Dialog.Title>

          {/* Close ボタン */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
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
