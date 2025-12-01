import { Wallet } from "lucide-react";

interface TeamBudgetProps {
  budget: number;
}

export const TeamBudget = ({ budget }: TeamBudgetProps) => {
  // Formatar o valor em milhões
  const formatBudget = (value: number) => {
    const millions = value / 1000000;
    return millions.toFixed(2);
  };

  return (
    <div className="border-t border-[#1a2c4a] bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-900/40 via-green-800/40 to-green-900/40 border border-green-700/50 rounded-lg px-6 py-3">
          <Wallet className="w-5 h-5 text-green-400" />
          <div className="flex flex-col">
            <span className="text-xs text-green-300/80 font-medium">Caixa do Time</span>
            <span className="text-xl font-bold text-green-400">
              $ {formatBudget(budget)} M
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
