import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useTeamBudget = (teamName: string, championshipId: string | undefined) => {
  const [budget, setBudget] = useState<number>(5000000); // Valor padrão: 5 milhões
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
          // Se não existir, criar um novo registro
          const { data: newBudget, error: insertError } = await supabase
            .from("team_budgets")
            .insert({
              championship_id: championshipId,
              team_id: teamName.toLowerCase().replace(/\s+/g, "-"),
              team_name: teamName,
              budget: 5000000,
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
  }, [teamName, championshipId]);

  return { budget, loading };
};
