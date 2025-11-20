-- Criar tabela de campeonatos
CREATE TABLE public.championships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  current_round INTEGER NOT NULL DEFAULT 1,
  total_rounds INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de partidas
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  championship_id UUID NOT NULL REFERENCES public.championships(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  home_team_id TEXT NOT NULL,
  home_team_name TEXT NOT NULL,
  home_team_logo TEXT NOT NULL,
  away_team_id TEXT NOT NULL,
  away_team_name TEXT NOT NULL,
  away_team_logo TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  is_played BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de classificação
CREATE TABLE public.standings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  championship_id UUID NOT NULL REFERENCES public.championships(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  logo TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  played INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_matches_championship ON public.matches(championship_id);
CREATE INDEX idx_matches_round ON public.matches(round);
CREATE INDEX idx_matches_is_played ON public.matches(is_played);
CREATE INDEX idx_standings_championship ON public.standings(championship_id);
CREATE INDEX idx_standings_points ON public.standings(points DESC);

-- Habilitar RLS (mas deixar acesso público já que não há autenticação)
ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público de leitura e escrita
CREATE POLICY "Permitir acesso público a campeonatos"
ON public.championships
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir acesso público a partidas"
ON public.matches
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir acesso público a classificação"
ON public.standings
FOR ALL
USING (true)
WITH CHECK (true);