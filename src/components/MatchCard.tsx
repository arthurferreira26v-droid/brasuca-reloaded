import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
  userTeam: string;
  userLogo: string;
  userPosition: string;
  opponentTeam: string;
  opponentLogo: string;
  opponentPosition: string;
  round: string;
  userForm: boolean[];
  opponentForm: boolean[];
  isHome: boolean;
}

export const MatchCard = ({
  userTeam,
  userLogo,
  userPosition,
  opponentTeam,
  opponentLogo,
  opponentPosition,
  round,
  userForm,
  opponentForm,
  isHome,
}: MatchCardProps) => {
  const navigate = useNavigate();

  const handlePlayMatch = () => {
    navigate(`/partida?time=${userTeam}&adversario=${opponentTeam}`);
  };

  // Define which team goes on left and right based on home/away
  const leftTeam = isHome ? userTeam : opponentTeam;
  const leftLogo = isHome ? userLogo : opponentLogo;
  const leftPosition = isHome ? userPosition : opponentPosition;
  const leftForm = isHome ? userForm : opponentForm;
  
  const rightTeam = isHome ? opponentTeam : userTeam;
  const rightLogo = isHome ? opponentLogo : userLogo;
  const rightPosition = isHome ? opponentPosition : userPosition;
  const rightForm = isHome ? opponentForm : userForm;

  return (
    <Card className="bg-[#050B2B] border-[#0a1540] p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">{round}</p>
        <h2 className="text-2xl font-bold text-foreground">
          {leftTeam.toUpperCase()} VS {rightTeam.toUpperCase()}
        </h2>
      </div>

      <div className="flex items-center justify-between mb-8">
        {/* Left Team */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center p-4">
              <img src={leftLogo} alt={leftTeam} className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-card rounded-full px-3 py-1 border-2 border-border">
              <span className="text-sm font-bold">{leftPosition}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {leftForm.map((win, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  win 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}
              >
                {win ? '✓' : 'X'}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            isHome 
              ? 'bg-green-600/20 text-green-400' 
              : 'bg-blue-600/20 text-blue-400'
          }`}>
            {isHome ? 'EM CASA' : 'FORA'}
          </span>
          <div className="text-4xl font-bold text-muted-foreground">VS</div>
        </div>

        {/* Right Team */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center p-4">
              <img src={rightLogo} alt={rightTeam} className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-card rounded-full px-3 py-1 border-2 border-border">
              <span className="text-sm font-bold">{rightPosition}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {rightForm.map((win, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  win 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}
              >
                {win ? '✓' : 'X'}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button 
        onClick={handlePlayMatch}
        className="w-full h-14 text-lg font-bold bg-[#c8ff00] hover:bg-[#b3e600] text-black"
      >
        JOGAR
      </Button>
    </Card>
  );
};
