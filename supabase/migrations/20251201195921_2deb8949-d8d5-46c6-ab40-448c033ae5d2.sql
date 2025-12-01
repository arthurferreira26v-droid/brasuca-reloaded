-- Criar tabela para armazenar o caixa/budget dos times
CREATE TABLE IF NOT EXISTS public.team_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id uuid REFERENCES public.championships(id) ON DELETE CASCADE NOT NULL,
  team_id text NOT NULL,
  team_name text NOT NULL,
  budget bigint NOT NULL DEFAULT 5000000, -- Valor inicial: 5 milhões
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(championship_id, team_id)
);

-- Habilitar RLS
ALTER TABLE public.team_budgets ENABLE ROW LEVEL SECURITY;

-- Permitir acesso público
CREATE POLICY "Permitir acesso público a budgets"
ON public.team_budgets
FOR ALL
USING (true)
WITH CHECK (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_team_budgets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_team_budgets_updated_at
BEFORE UPDATE ON public.team_budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_team_budgets_updated_at();