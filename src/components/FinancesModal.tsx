import { X, TrendingUp, TrendingDown, Wallet, CircleDollarSign } from "lucide-react";
import { formatMarketValue } from "@/utils/marketValue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface FinancesModalProps {
  budget: number;
  totalSales: number;
  totalPurchases: number;
  onClose: () => void;
  onInvest?: () => void;
  hasActiveInvestment?: boolean;
}

export const FinancesModal = ({
  budget,
  totalSales,
  totalPurchases,
  onClose,
  onInvest,
  hasActiveInvestment = false,
}: FinancesModalProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const investmentCost = 4000000; // $4 milhões
  const canInvest = budget >= investmentCost && !hasActiveInvestment;

  const handleInvestClick = () => {
    if (!canInvest) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmInvest = () => {
    setShowConfirmDialog(false);
    onInvest?.();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Content Card */}
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold tracking-tight">Finanças</h2>
            <p className="text-zinc-500 text-sm mt-1">Gerencie o caixa do seu time</p>
          </div>

          {/* Caixa do Time - Hero Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#c8ff00] to-[#a8e600] rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-black/60" />
                <span className="text-black/60 text-sm font-medium">Caixa do Time</span>
              </div>
              <div className="text-black font-bold text-4xl tracking-tight">
                {formatMarketValue(budget)}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Vendas */}
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-zinc-400 text-sm">Vendas</span>
              </div>
              <span className="text-green-500 font-bold text-xl">
                {formatMarketValue(totalSales)}
              </span>
            </div>

            {/* Compras */}
            <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-zinc-400 text-sm">Compras</span>
              </div>
              <span className="text-red-500 font-bold text-xl">
                {formatMarketValue(totalPurchases)}
              </span>
            </div>
          </div>

          {/* Investir Button */}
          <div className="space-y-3">
            <button
              onClick={handleInvestClick}
              disabled={!canInvest}
              className={`w-full flex items-center justify-center gap-3 font-bold text-lg py-4 rounded-xl transition-all ${
                canInvest
                  ? "bg-[#c8ff00] hover:bg-[#d8ff40] text-black hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              <CircleDollarSign className="w-5 h-5" />
              {hasActiveInvestment ? "Investimento Ativo" : "Investir"}
            </button>
            <p className="text-center text-zinc-500 text-xs">
              {hasActiveInvestment 
                ? "Você já possui um investimento ativo. Ganhe $200 mil por jogo!"
                : "Invista $4 milhões e ganhe $200 mil a cada jogo"}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Investimento</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Você irá investir <span className="text-[#c8ff00] font-bold">$4 milhões</span> e 
              receberá <span className="text-green-500 font-bold">$200 mil</span> a cada partida jogada.
              <br /><br />
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmInvest}
              className="bg-[#c8ff00] text-black hover:bg-[#d8ff40]"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};