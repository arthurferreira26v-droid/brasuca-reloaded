import { brazilianStandings } from "@/data/standings";
import { ChevronUp, ChevronDown, Minus } from "lucide-react";

export const StandingsTable = () => {
  const getPositionColor = (position: number) => {
    if (position <= 4) return "text-[#00ff87]"; // Libertadores
    if (position <= 6) return "text-[#00b8ff]"; // Pré-Libertadores
    if (position <= 12) return "text-white"; // Meio de tabela
    return "text-red-500"; // Rebaixamento
  };

  const getPositionIndicator = (position: number) => {
    if (position <= 4) return <div className="w-1 h-8 bg-[#00ff87] rounded-full" />;
    if (position <= 6) return <div className="w-1 h-8 bg-[#00b8ff] rounded-full" />;
    if (position <= 12) return <div className="w-1 h-8 bg-white/20 rounded-full" />;
    return <div className="w-1 h-8 bg-red-500 rounded-full" />;
  };

  return (
    <div className="bg-black border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold text-white">CAMPEONATO BRASILEIRO - SÉRIE A</h2>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[auto_50px_1fr_repeat(8,50px)] gap-2 px-4 py-3 border-b border-border text-xs font-bold text-muted-foreground">
        <div className="w-1"></div>
        <div className="text-center">#</div>
        <div>TIME</div>
        <div className="text-center">PTS</div>
        <div className="text-center">J</div>
        <div className="text-center">V</div>
        <div className="text-center">E</div>
        <div className="text-center">D</div>
        <div className="text-center">GP</div>
        <div className="text-center">GC</div>
        <div className="text-center">SG</div>
      </div>

      {/* Mobile Table Header */}
      <div className="md:hidden grid grid-cols-[auto_40px_1fr_50px_50px_50px] gap-2 px-4 py-3 border-b border-border text-xs font-bold text-muted-foreground">
        <div className="w-1"></div>
        <div className="text-center">#</div>
        <div>TIME</div>
        <div className="text-center">PTS</div>
        <div className="text-center">J</div>
        <div className="text-center">SG</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {brazilianStandings.map((team) => (
          <div key={team.teamId}>
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-[auto_50px_1fr_repeat(8,50px)] gap-2 px-4 py-3 hover:bg-white/5 transition-colors items-center">
              {/* Position Indicator */}
              <div className="flex items-center">
                {getPositionIndicator(team.position)}
              </div>
              
              {/* Position Number */}
              <div className={`text-center font-bold ${getPositionColor(team.position)}`}>
                {team.position}
              </div>
              
              {/* Team Name & Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center p-1">
                  <img src={team.logo} alt={team.teamName} className="w-full h-full object-contain" />
                </div>
                <span className="font-medium text-white truncate">{team.teamName}</span>
              </div>
              
              {/* Stats */}
              <div className="text-center font-bold text-white">{team.points}</div>
              <div className="text-center text-muted-foreground">{team.played}</div>
              <div className="text-center text-green-500">{team.wins}</div>
              <div className="text-center text-muted-foreground">{team.draws}</div>
              <div className="text-center text-red-500">{team.losses}</div>
              <div className="text-center text-muted-foreground">{team.goalsFor}</div>
              <div className="text-center text-muted-foreground">{team.goalsAgainst}</div>
              <div className={`text-center font-medium ${
                team.goalDifference > 0 
                  ? 'text-green-500' 
                  : team.goalDifference < 0 
                  ? 'text-red-500' 
                  : 'text-muted-foreground'
              }`}>
                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden grid grid-cols-[auto_40px_1fr_50px_50px_50px] gap-2 px-4 py-3 hover:bg-white/5 transition-colors items-center">
              {/* Position Indicator */}
              <div className="flex items-center">
                {getPositionIndicator(team.position)}
              </div>
              
              {/* Position Number */}
              <div className={`text-center font-bold ${getPositionColor(team.position)}`}>
                {team.position}
              </div>
              
              {/* Team Name & Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center p-1">
                  <img src={team.logo} alt={team.teamName} className="w-full h-full object-contain" />
                </div>
                <span className="font-medium text-white text-sm truncate">{team.teamName}</span>
              </div>
              
              {/* Stats (mobile: PTS, J, SG) */}
              <div className="text-center font-bold text-white">{team.points}</div>
              <div className="text-center text-muted-foreground">{team.played}</div>
              <div className={`text-center font-medium ${
                team.goalDifference > 0 
                  ? 'text-green-500' 
                  : team.goalDifference < 0 
                  ? 'text-red-500' 
                  : 'text-muted-foreground'
              }`}>
                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white/5 border-t border-border px-4 py-4 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00ff87] rounded" />
          <span className="text-muted-foreground">Libertadores (1º - 4º)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00b8ff] rounded" />
          <span className="text-muted-foreground">Pré-Libertadores (5º - 6º)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-muted-foreground">Rebaixamento (17º - 20º)</span>
        </div>
      </div>
    </div>
  );
};
