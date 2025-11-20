import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface League {
  id: string;
  name: string;
  flag: string;
}

interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: string;
  onSelect: (leagueId: string) => void;
}

export const LeagueSelector = ({ leagues, selectedLeague, onSelect }: LeagueSelectorProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {leagues.map((league) => (
        <Button
          key={league.id}
          variant={selectedLeague === league.id ? "default" : "secondary"}
          onClick={() => onSelect(league.id)}
          className={cn(
            "h-auto flex flex-col items-center gap-2 px-6 py-4 min-w-[140px] transition-all",
            selectedLeague === league.id && "shadow-[0_0_20px_hsl(var(--neon-green)/0.4)]"
          )}
        >
          <span className="text-3xl">{league.flag}</span>
          <span className="text-sm font-semibold">{league.name}</span>
        </Button>
      ))}
    </div>
  );
};
