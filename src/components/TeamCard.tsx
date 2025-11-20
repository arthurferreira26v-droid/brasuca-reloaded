import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TeamCardProps {
  name: string;
  logo: string;
  rating: number;
  onClick: () => void;
}

export const TeamCard = ({ name, logo, rating, onClick }: TeamCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--neon-green)/0.3)]"
    >
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="relative h-24 w-24 flex items-center justify-center bg-secondary rounded-full p-4 group-hover:bg-secondary/80 transition-colors">
          <img
            src={logo}
            alt={name}
            className="h-full w-full object-contain"
          />
        </div>
        
        <h3 className="text-lg font-bold text-center text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-accent text-accent"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
