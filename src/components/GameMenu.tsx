import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Users, TrendingUp, Briefcase, Calendar, Trophy, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameMenuProps {
  teamName: string;
  onManageSquad?: () => void;
  onTransferMarket?: () => void;
}

export const GameMenu = ({ teamName, onManageSquad, onTransferMarket }: GameMenuProps) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{teamName}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={() => navigate(`/classificacao?time=${teamName}`)}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-base">Classificaçã</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={onManageSquad}
          >
            <Users className="h-5 w-5" />
            <span className="text-base">Gerenciar Elenco</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={onTransferMarket}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-base">Mercado de Transferências</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
            onClick={() => navigate(`/calendario?time=${teamName}`)}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-base">Calendário</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
          >
            <Briefcase className="h-5 w-5" />
            <span className="text-base">Finanças</span>
          </Button>

          <div className="pt-4 mt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-14 text-red-500 hover:text-red-600 hover:bg-red-500/10"
              onClick={() => navigate("/")}
            >
              <LogOut className="h-5 w-5" />
              <span className="text-base font-semibold">Sair</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
