import { X } from "lucide-react";
import { formatMarketValue } from "@/utils/marketValue";

interface FinancesModalProps {
  budget: number;
  totalSales: number;
  totalPurchases: number;
  onClose: () => void;
  onInvest?: () => void;
}

export const FinancesModal = ({
  budget,
  totalSales,
  totalPurchases,
  onClose,
  onInvest,
}: FinancesModalProps) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Content Card */}
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-8 space-y-6">
        {/* Caixa do Time */}
        <div className="space-y-3">
          <h3 className="text-white text-lg font-medium">Caixa do Time</h3>
          <div className="bg-[#c8ff00] text-black font-bold text-2xl py-4 px-6 rounded-xl text-center">
            {formatMarketValue(budget)}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white text-lg">Vendas</span>
            <span className="text-green-500 font-bold text-lg">
              {formatMarketValue(totalSales)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white text-lg">Compras</span>
            <span className="text-red-500 font-bold text-lg">
              {formatMarketValue(totalPurchases)}
            </span>
          </div>
        </div>

        {/* Investir Button */}
        <button
          onClick={onInvest}
          className="w-full bg-[#c8ff00] hover:bg-[#d8ff40] text-black font-bold text-lg py-4 rounded-xl transition-colors"
        >
          Investir
        </button>
      </div>
    </div>
  );
};
