import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Users, TrendingUp, Briefcase, Calendar } from "lucide-react";

interface GameMenuProps {
  teamName: string;
}

export const GameMenu = ({ teamName }: GameMenuProps) => {
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
          >
            <Users className="h-5 w-5" />
            <span className="text-base">Gerenciar Elenco</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-base">Mercado de Transferências</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-14"
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
        </div>
      </SheetContent>
    </Sheet>
  );
};
