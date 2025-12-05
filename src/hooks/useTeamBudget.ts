import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Orçamentos iniciais por time (em reais/dólares)
const TEAM_INITIAL_BUDGETS: Record<string, number> = {
  "Flamengo": 18000000,
  "Palmeiras": 17000000,
  "Botafogo": 15000000,
  "Corinthians": 12000000,
  "Internacional": 11000000,
  "São Paulo": 10000000,
  "Fluminense": 9000000,
  "Cruzeiro": 9000000,
  "Santos": 7000000,
  "Grêmio": 7000000,
  "Atlético Mineiro": 7000000,
  "Vasco": 5000000,
};

const getInitialBudget = (teamName: string): number => {
  return TEAM_INITIAL_BUDGETS[teamName] || 5000000;
};

export const useTeamBudget = (teamName: string, championshipId: string | undefined) => {
  const initialBudget = getInitialBudget(teamName);
  const [budget, setBudget] = useState<number>(initialBudget);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      if (!championshipId) {
        setLoading(false);
        return;
      }

      try {
        // Buscar budget do time
        const { data, error } = await supabase
          .from("team_budgets")
          .select("budget")
          .eq("championship_id", championshipId)
          .eq("team_name", teamName)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setBudget(data.budget);
        } else {
          // Se não existir, criar um novo registro com o budget inicial do time
          const { data: newBudget, error: insertError } = await supabase
            .from("team_budgets")
            .insert({
              championship_id: championshipId,
              team_id: teamName.toLowerCase().replace(/\s+/g, "-"),
              team_name: teamName,
              budget: initialBudget,
            })
            .select("budget")
            .single();

          if (insertError) throw insertError;
          if (newBudget) setBudget(newBudget.budget);
        }
      } catch (error) {
        console.error("Erro ao buscar budget do time:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [teamName, championshipId, initialBudget]);

  return { budget, loading };
};
