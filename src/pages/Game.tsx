import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Users, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const [searchParams] = useSearchParams();
  const teamName = searchParams.get("time") || "Seu Time";
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">{teamName}</h1>
          </div>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Títulos</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jogadores</p>
                <p className="text-2xl font-bold text-foreground">25</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posição</p>
                <p className="text-2xl font-bold text-foreground">1º</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temporada</p>
                <p className="text-2xl font-bold text-foreground">2025</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 bg-gradient-to-br from-card to-secondary border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Gerenciar Elenco
            </h2>
            <p className="text-muted-foreground mb-6">
              Contrate jogadores, renove contratos e monte seu time dos sonhos.
            </p>
            <Button className="w-full">Ir para Elenco</Button>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-secondary border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Próxima Partida
            </h2>
            <p className="text-muted-foreground mb-6">
              Prepare sua tática e escale o time para o próximo jogo.
            </p>
            <Button className="w-full" variant="secondary">
              Ver Calendário
            </Button>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-secondary border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Treinamento
            </h2>
            <p className="text-muted-foreground mb-6">
              Desenvolva as habilidades dos seus jogadores.
            </p>
            <Button className="w-full" variant="secondary">
              Treinar Time
            </Button>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-secondary border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Finanças
            </h2>
            <p className="text-muted-foreground mb-6">
              Gerencie o orçamento e invista no clube.
            </p>
            <Button className="w-full" variant="secondary">
              Ver Finanças
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Game;
