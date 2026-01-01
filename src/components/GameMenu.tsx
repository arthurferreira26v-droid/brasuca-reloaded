import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Users,
  TrendingUp,
  Wallet,
  Calendar,
  Trophy,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTeamBudget } from "@/hooks/useTeamBudget";

interface GameMenuProps {
  teamName: string;
  championshipId: string | undefined;
  onManageSquad?: () => void;
  onTransferMarket?: () => void;
  onOpenFinances?: () => void;
}

export const GameMenu = ({
  teamName,
  championshipId,
  onManageSquad,
  onTransferMarket,
  onOpenFinances,
}: GameMenuProps) => {
  const navigate = useNavigate();

  const { resetBudget } = useTeamBudget(teamName, championshipId);

  const handleExit = async () => {
    await resetBudget();
    navigate("/");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 bg-card">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-foreground">
            {teamName}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-2">
          {/* Classificação - Design refinado com destaque dourado */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14 hover:bg-yellow-500/10 group"
            onClick={() => navigate(`/classificacao?time=${teamName}`)}
          >
            <div className="p-2 rounded-lg bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <span className="text-base font-medium text-foreground">Classificação</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14 hover:bg-blue-500/10 group"
            onClick={onManageSquad}
          >
            <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-base font-medium text-foreground">Gerenciar Elenco</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14 hover:bg-purple-500/10 group"
            onClick={onTransferMarket}
          >
            <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-base font-medium text-foreground">Mercado de Transferências</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14 hover:bg-cyan-500/10 group"
            onClick={() => navigate(`/calendario?time=${teamName}`)}
          >
            <div className="p-2 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
              <Calendar className="h-5 w-5 text-cyan-500" />
            </div>
            <span className="text-base font-medium text-foreground">Calendário</span>
          </Button>

          {/* Finanças - Design refinado com destaque verde */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14 hover:bg-green-500/10 group"
            onClick={onOpenFinances}
          >
            <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
              <Wallet className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-base font-medium text-foreground">Finanças</span>
          </Button>

          <div className="pt-4 mt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-14 text-red-500 hover:text-red-600 hover:bg-red-500/10 group"
              onClick={handleExit}
            >
              <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold">Sair</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
