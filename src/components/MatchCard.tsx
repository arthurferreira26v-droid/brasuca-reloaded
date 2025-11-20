import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface MatchCardProps {
  homeTeam: string;
  homeLogo: string;
  homePosition: string;
  awayTeam: string;
  awayLogo: string;
  awayPosition: string;
  round: string;
  homeForm: boolean[];
  awayForm: boolean[];
}

export const MatchCard = ({
  homeTeam,
  homeLogo,
  homePosition,
  awayTeam,
  awayLogo,
  awayPosition,
  round,
  homeForm,
  awayForm,
}: MatchCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-[#1e3a5f] to-[#0d1b2a] border-border p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">{round}</p>
        <h2 className="text-2xl font-bold text-foreground">
          {homeTeam.toUpperCase()} VS {awayTeam.toUpperCase()}
        </h2>
      </div>

      <div className="flex items-center justify-between mb-8">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center p-4">
              <img src={homeLogo} alt={homeTeam} className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-card rounded-full px-3 py-1 border-2 border-border">
              <span className="text-sm font-bold">{homePosition}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {homeForm.map((win, i) => (
              win ? (
                <CheckCircle2 key={i} className="h-5 w-5 text-primary fill-primary" />
              ) : (
                <XCircle key={i} className="h-5 w-5 text-destructive fill-destructive" />
              )
            ))}
          </div>
        </div>

        <div className="text-4xl font-bold text-muted-foreground">VS</div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center p-4">
              <img src={awayLogo} alt={awayTeam} className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-card rounded-full px-3 py-1 border-2 border-border">
              <span className="text-sm font-bold">{awayPosition}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {awayForm.map((win, i) => (
              win ? (
                <CheckCircle2 key={i} className="h-5 w-5 text-primary fill-primary" />
              ) : (
                <XCircle key={i} className="h-5 w-5 text-destructive fill-destructive" />
              )
            ))}
          </div>
        </div>
      </div>

      <Button className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90">
        JOGAR
      </Button>
    </Card>
  );
};
