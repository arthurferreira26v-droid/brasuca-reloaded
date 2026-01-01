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
  Briefcase,
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
}

export const GameMenu = ({
  teamName,
  championshipId,
  onManageSquad,
  onTransferMarket,
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
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {teamName}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={() => navigate(`/classificacao?time=${teamName}`)}
          >
            <Trophy className="h-5 w-5" />
            Classificação
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={onManageSquad}
          >
            <Users className="h-5 w-5" />
            Gerenciar Elenco
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={onTransferMarket}
          >
            <TrendingUp className="h-5 w-5" />
            Mercado de Transferências
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={() => navigate(`/calendario?time=${teamName}`)}
          >
            <Calendar className="h-5 w-5" />
            Calendário
          </Button>

          {/* ✅ BOTÃO FINANÇAS CORRIGIDO */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14 bg-yellow-400/10 text-yellow-400"
            onClick={() => navigate(`/financas?time=${teamName}`)}
          >
            <Briefcase className="h-5 w-5" />
            Finanças
          </Button>

          <div className="pt-4 mt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-14 text-red-500 hover:text-red-600 hover:bg-red-500/10"
              onClick={handleExit}
            >
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};