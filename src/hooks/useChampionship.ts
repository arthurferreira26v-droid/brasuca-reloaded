// @ts-nocheck - Database types will be updated after migration
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { teams, Team } from "@/data/teams";

interface Match {
  id: string;
  championship_id: string;
  round: number;
  home_team_id: string;
  home_team_name: string;
  home_team_logo: string;
  away_team_id: string;
  away_team_name: string;
  away_team_logo: string;
  home_score: number | null;
  away_score: number | null;
  is_played: boolean;
}

interface Championship {
  id: string;
  name: string;
  season: string;
  current_round: number;
  total_rounds: number;
}

export const useChampionship = (userTeamName: string) => {
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  const generateChampionshipFixtures = (userTeam: Team, allTeams: Team[]) => {
    const fixtures: Omit<Match, "id" | "championship_id">[] = [];
    const opponents = allTeams.filter(t => t.id !== userTeam.id);
    
    opponents.forEach((opponent, index) => {
      const isHome = index % 2 === 0;
      
      if (isHome) {
        fixtures.push({
          round: index + 1,
          home_team_id: userTeam.id,
          home_team_name: userTeam.name,
          home_team_logo: userTeam.logo,
          away_team_id: opponent.id,
          away_team_name: opponent.name,
          away_team_logo: opponent.logo,
          home_score: null,
          away_score: null,
          is_played: false,
        });
      } else {
        fixtures.push({
          round: index + 1,
          home_team_id: opponent.id,
          home_team_name: opponent.name,
          home_team_logo: opponent.logo,
          away_team_id: userTeam.id,
          away_team_name: userTeam.name,
          away_team_logo: userTeam.logo,
          home_score: null,
          away_score: null,
          is_played: false,
        });
      }
    });

    opponents.forEach((opponent, index) => {
      const roundNumber = opponents.length + index + 1;
      const isHome = index % 2 !== 0;
      
      if (isHome) {
        fixtures.push({
          round: roundNumber,
          home_team_id: userTeam.id,
          home_team_name: userTeam.name,
          home_team_logo: userTeam.logo,
          away_team_id: opponent.id,
          away_team_name: opponent.name,
          away_team_logo: opponent.logo,
          home_score: null,
          away_score: null,
          is_played: false,
        });
      } else {
        fixtures.push({
          round: roundNumber,
          home_team_id: opponent.id,
          home_team_name: opponent.name,
          home_team_logo: opponent.logo,
          away_team_id: userTeam.id,
          away_team_name: userTeam.name,
          away_team_logo: userTeam.logo,
          home_score: null,
          away_score: null,
          is_played: false,
        });
      }
    });

    return fixtures;
  };

  useEffect(() => {
    const initChampionship = async () => {
      setLoading(true);
      
      const userTeam = teams.find(t => t.name === userTeamName);
      if (!userTeam) {
        setLoading(false);
        return;
      }

      const brazilianTeams = teams.filter(t => t.league === "brasileiro");

      try {
        const { data: existingChampionships, error: fetchError } = await supabase
          .from("championships")
          .select("*")
          .eq("name", `Brasileirão - ${userTeamName}`)
          .limit(1);

        if (fetchError) throw fetchError;

        let championshipId: string;

        if (existingChampionships && existingChampionships.length > 0) {
          championshipId = existingChampionships[0].id;
          setChampionship(existingChampionships[0]);
        } else {
          const { data: newChampionship, error: createError } = await supabase
            .from("championships")
            .insert({
              name: `Brasileirão - ${userTeamName}`,
              season: "2024",
              current_round: 1,
              total_rounds: (brazilianTeams.length - 1) * 2,
            })
            .select()
            .single();

          if (createError) throw createError;
          if (!newChampionship) throw new Error("Falha ao criar campeonato");
          
          championshipId = newChampionship.id;
          setChampionship(newChampionship);

          const fixtures = generateChampionshipFixtures(userTeam, brazilianTeams);
          const fixturesWithChampionship = fixtures.map(f => ({
            ...f,
            championship_id: championshipId,
          }));

          const { error: insertError } = await supabase
            .from("matches")
            .insert(fixturesWithChampionship);

          if (insertError) throw insertError;

          const standingsData = brazilianTeams.map(team => ({
            championship_id: championshipId,
            team_id: team.id,
            team_name: team.name,
            logo: team.logo,
            points: 0,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goals_for: 0,
            goals_against: 0,
            goal_difference: 0,
            position: 1,
          }));

          const { error: standingsError } = await supabase
            .from("standings")
            .insert(standingsData);

          if (standingsError) throw standingsError;
        }

        const { data: matches, error: matchError } = await supabase
          .from("matches")
          .select("*")
          .eq("championship_id", championshipId)
          .eq("is_played", false)
          .order("round", { ascending: true })
          .limit(1);

        if (matchError) throw matchError;

        if (matches && matches.length > 0) {
          setNextMatch(matches[0]);
        }
      } catch (error) {
        console.error("Erro ao inicializar campeonato:", error);
      } finally {
        setLoading(false);
      }
    };

    initChampionship();
  }, [userTeamName]);

  return { championship, nextMatch, loading };
};
